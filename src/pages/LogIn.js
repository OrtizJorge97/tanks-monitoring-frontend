import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import {isValidEmail, isValidPassword} from '../utility/Accounts';
import useFetch from "../hooks/useFetch";
import { apiModes } from '../api/ApiProperties';
import { UserContext } from '../components/Context';


export default function LogInPage() {
  const {user, setUser} = React.useContext(UserContext);

  const navigate = useNavigate();
  document.title = "Log In";
  const [values, setValues, doFetch] = useFetch({
    password: '',
    emailText: '',
    showPassword: false,
    emailError: "",
    passwordError: ""
  });

  const [validFields, setValidFields] = React.useState({
    validEmail: true,
    validPassword: true
  });
  const [busyProps, setBusyProps] = React.useState({
    progressVisibility: "none",
    disabledButton: false,
    responseTextMessage: "",
    responseMsgTextColor: "#000000"
  });

  const handleChange = (event, prop) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async(event) => {
    try {
      event.preventDefault();

      let response = null;
      let emailError = isValidEmail(values.emailText);
      let passwordError = isValidPassword(values.password);
      let responseTextMessage = "";
      let responseMsgTextColor = "#000000";
      let userAuthenticated = false;
      console.log("LOG TO UPLOAD PROJECT IN OTHER BRANCH");
      console.log("COMMIT FOR DEV DEV")
      setValues({
        ...values,
        emailError: emailError,
        passwordError: passwordError
      });
      setBusyProps({
        progressVisibility: "block",
        disabledButton: true
      }); 

      if(!emailError && !passwordError) {
        console.log(values.password);
        const jsonData = await doFetch("POST", apiModes.LOGIN, false,
                                      {email: values.emailText, 
                                      password: values.password});
        console.log(jsonData);
        //check if server responded and if status was successful
        
        if(jsonData.msg === "Succesfully authenticated") {
          responseMsgTextColor = "#03945f";
          userAuthenticated = true;
        }
        else if(jsonData.msg === "Password incorect") {
          responseMsgTextColor = "#940303";
        }
        
        else if(jsonData.msg === "User not found") {
          responseMsgTextColor = "#940303";
        }
        responseTextMessage = jsonData.msg;
          
        setBusyProps({
          progressVisibility: "none",
          disabledButton: false,
          responseTextMessage: responseTextMessage,
          responseMsgTextColor: responseMsgTextColor
        });
        console.log(userAuthenticated);
        if(userAuthenticated) {
          localStorage.setItem("accessToken", jsonData.access_token);
          localStorage.setItem("email", jsonData.user.email);
          localStorage.setItem("refreshToken", jsonData.refresh_token);
          localStorage.setItem("name", jsonData.user.name);
          localStorage.setItem("lastName", jsonData.user.last_name);
          localStorage.setItem("company", jsonData.user.company);
          localStorage.setItem("role", jsonData.user.role);

          setUser({
            ...user,
            access_token: localStorage.getItem("accessToken")
          })
          setBusyProps({
            progressVisibility: "none",
            disabledButton: false
          }); 
          navigate("/tanks-monitor");
        }
      }
      else {
        setBusyProps({
          progressVisibility: "none",
          disabledButton: false
        }); 
      }
    }
    catch(error) {
      if(error.message === 'Failed to fetch') {
        setBusyProps({
          progressVisibility: "none",
          disabledButton: false,
          responseTextMessage: "Please check your internet connection and try again",
          responseMsgTextColor: ""
        });
      }
    }

  };

  return (
    <div style={{textAlign: "center", marginTop: "90px", paddingTop: "50px"}}>
      <Box
        sx={{
          borderRadius: "20px",
          width: "70%",
          height: "auto",
          paddingTop: "20px",
          paddingBottom: "20px",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: ""
        }}> 
        
        <span>jorge.ortiz.c97@gmail.com</span>
        <br/>
        <span>AtomoEstable97</span>
        
        <h1 style={{fontSize: "50px"}}>Log In</h1>
        <div style={{marginBottom: "10px"}}>
            <TextField 
                style={{
                  width: "60%"
                }}
                id="outlined-basic" 
                label="Email" 
                variant="outlined"
                type="text"
                value={values.emailText}
                onChange={(e) => handleChange(e, "emailText")}
                onKeyUp={(e) => {
                  if(e.code === 'Enter') {
                    handleLogin(e);
                  }
                }}  
             />
        </div>
        <div style={{width: "60%", margin: "auto", marginBottom: "10px"}}>
          {values.emailError ? <Alert severity="error">Please type valid email address</Alert> : null}
        </div>
        <div>
            <FormControl sx={{ m: 1, width: '60%' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={(e) => handleChange(e, 'password')}
                onKeyUp={(e) => {
                  if(e.code === 'Enter') {
                    handleLogin(e);
                  }
                }}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => handleMouseDownPassword(e)}
                      edge="end">
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
                label="Password"
            />
            </FormControl>
        </div>
        <div style={{width: "60%", margin: "auto", marginBottom: "5px"}}>
          {values.passwordError ? <Alert severity="error">Please type your password correctly</Alert> : null}
        </div>
        <div style={{display: busyProps.progressVisibility}}>
          <CircularProgress />
        </div>
        <div 
          style={{color: busyProps.responseMsgTextColor, 
                  display: busyProps.responseTextMessage ? "block" : "none",
                  width: "60%", 
                  margin: "auto", 
                  marginBottom: "5px"}}>
          {busyProps.responseTextMessage ? 
            (
              <Alert 
                  severity={(busyProps.responseTextMessage === "Succesfully authenticated") ? "success" : "error"}>
                    {busyProps.responseTextMessage}
              </Alert>
            ) : null}
        </div>
        <div style={{marginBottom: "15px"}}>
            <Button 
              disabled={busyProps.disabledButton} 
              sx={{
                width: "40%",
                borderRadius: "20px",
                backgroundColor: "#54008c"
              }}
              onClick={(e) => handleLogin(e)} 
              variant="contained">
                Log In
              </Button>
        </div>
        <a href="#">Forgot password?</a>
      </Box>
    </div>
  );
}
