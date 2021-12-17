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

import {isValidEmail, isValidPassword} from '../utility/Accounts';
import {POST} from "../api/Post";
import { apiModes } from '../api/ApiProperties';
import { UserContext } from '../components/Context';


export default function LogInPage() {
  const {user, setUser} = React.useContext(UserContext);

  const navigate = useNavigate();
  document.title = "Log In";
  const [values, setValues] = React.useState({
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
        response = await POST(apiModes.LOGIN,
                              {email: values.emailText, 
                              password: values.password});
        const jsonData = await response.json();
        console.log(jsonData);
        //check if server responded and if status was successful
        if(response && response.status === 200) {
          if(jsonData.message === "Succesfully authenticated") {
            responseMsgTextColor = "#03945f";
            userAuthenticated = true;
          }
          else if(jsonData.message === "Password incorect") {
            responseMsgTextColor = "#940303";
          }
        }
        if(response && response.status === 404) {
          responseMsgTextColor = "#940303";
        }
        responseTextMessage = jsonData.message;
          
        setBusyProps({
          progressVisibility: "none",
          disabledButton: false,
          responseTextMessage: responseTextMessage,
          responseMsgTextColor: responseMsgTextColor
        });

        if(userAuthenticated) {
          localStorage.setItem("accessToken", jsonData.access_token);
          localStorage.setItem("refreshToken", jsonData.refresh_token);
          localStorage.setItem("name", jsonData.user.name);
          localStorage.setItem("lastName", jsonData.user.last_name);
          localStorage.setItem("company", jsonData.user.company);

          setUser({
            ...user,
            access_token: localStorage.getItem("accessToken")
          })
          setBusyProps({
            progressVisibility: "none",
            disabledButton: false
          }); 
          navigate("/bar-chart");
        }

        if(!userAuthenticated) {
          setBusyProps({
            progressVisibility: "none",
            disabledButton: false
          }); 
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
      console.log(typeof(error));
      console.log(error.message);
      if(error.message === 'Failed to fetch') {
        setBusyProps({
          progressVisibility: "none",
          disabledButton: false,
          responseTextMessage: "Please check your internet connection and try again",
          responseMsgTextColor: ""
        })
      }
    }

  };

  return (
    <div style={{textAlign: "center", marginTop: "90px"}}> 
        <h1>Log In jorge.ortiz.c97@gmail.com</h1>
        <h1>AtomoEstable97</h1>
        <div style={{marginBottom: "10px"}}>
            <TextField 
                style={{width: "60%"}}
                id="outlined-basic" 
                label="Email" 
                variant="outlined"
                type="text"
                value={values.emailText}
                onChange={(e) => handleChange(e, "emailText")}
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
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={(e) => handleMouseDownPassword(e)}
                    edge="end"
                    >
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
              style={{width: "40%"}} 
              onClick={(e) => handleLogin(e)} 
              variant="contained">
                Log In
              </Button>
        </div>
        <a href="#">Forgot password?</a>

    </div>
  );
}
