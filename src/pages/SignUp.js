import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    InputLabel,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../components/Context";

import useFetch from "../hooks/useFetch";
import { apiModes } from "../api/ApiProperties";

/*
//import { useTheme, useThemeUpdate } from "../ThemeContext";
const darkTheme = useTheme();
    const toggleTheme = useThemeUpdate();
    const themeStyles = {
        background: darkTheme? "#333" : "#CCC",
        color: darkTheme? "#CCC" : "#333",
        padding: "2rem",
        margin: "2rem"
    };
*/
export default function SignUpPage() {
    //const {value, setValue} = useContext(UserContext); //getting the data passed from app.js
    const navigate = useNavigate();
    document.title = "Sign Up";

    const [user, setUser, doFetch] = useFetch({
        name: "",
        lastName: "",
        email: "",
        password: "",
        passwordVerify: "",
        company: ""
    })
    const [componentState, setComponentState] = useState({
        showPassword: false,
        showVerifyPassword: false,
        buttonDisabled: false,
        isBusy: "none",
        requestMessage: "",
        requestMsgColor: "#000000",
        passwordVerified: false
    });

    const handleChange = (e, prop) => {
        setUser({
            ...user,
            [prop]: e.target.value
        })
    }
    const handleOnClick = async (e) => {
        try {
            var message = "";
            var fontColor = "";
            var response = null;
            var jsonResponse = null;
            const passwordMatch = (user.password === user.passwordVerify);
            e.preventDefault();
            setComponentState({
                ...componentState,
                isBusy: "block",
                buttonDisabled: true
            });

            if (passwordMatch) {
                jsonResponse = await doFetch("POST", apiModes.SIGNUP, false, user);
                console.log(jsonResponse);
                if (jsonResponse.msg === "User already registered" || jsonResponse.msg === "Succesfully added user") {
                    fontColor = "#03945f";
                }
                else {
                    fontColor = "#940303";
                }
                message = jsonResponse.msg;
            }
            else {
                message = "Passwords do not match";
                fontColor = "#940303";
            }

            setComponentState({
                ...componentState,
                isBusy: "none",
                buttonDisabled: false,
                requestMessage: message,
                requestMsgColor: fontColor
            });

            if (response && response.status === 200) {
                navigate("/log-in");
            }
        }
        catch (error) {
            console.log(typeof (error));
            console.log(typeof (error.message));
            if (error.message === 'Failed to fetch') {
                setComponentState({
                    ...componentState,
                    isBusy: "none",
                    buttonDisabled: false,
                    requestMessage: "Please check your connection and try again",
                    requestMsgColor: "#940303"
                });
            }
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "90px" }}>
            <Box
                sx={{
                    borderRadius: "20px",
                    width: "70%",
                    height: "auto",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    background: "rgba(232, 250, 255, 0)"
                }}>
                <h1>Sign Up</h1>
                <div>
                    <TextField
                        style={{ width: "50%", marginBottom: "15px" }}
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={user.name}
                        onChange={(e) => handleChange(e, 'name')} />
                </div>
                <div>
                    <TextField
                        style={{ width: "50%", marginBottom: "15px" }}
                        id="outlined-basic"
                        label="Last Name"
                        variant="outlined"
                        value={user.lastName}
                        onChange={(e) => handleChange(e, 'lastName')} />
                </div>
                <div>
                    <TextField
                        style={{ width: "50%", marginBottom: "10px" }}
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        value={user.email}
                        onChange={(e) => handleChange(e, 'email')} />
                </div>
                <div>
                    <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={componentState.showPassword ? 'text' : 'password'}
                            value={user.password}
                            onChange={(e) => handleChange(e, 'password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setComponentState({
                                            ...componentState,
                                            showPassword: !componentState.showPassword
                                        })}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {componentState.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                </div>
                <div>
                    <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={componentState.showVerifyPassword ? 'text' : 'password'}
                            value={user.passwordVerify}
                            onChange={(e) => handleChange(e, 'passwordVerify')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setComponentState({
                                            ...componentState,
                                            showVerifyPassword: !componentState.showVerifyPassword
                                        })}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {componentState.showVerifyPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                </div>

                <div style={{ margin: "auto" }}>
                    <TextField
                        type="text"
                        style={{ width: "50%", marginBottom: "10px" }}
                        id="outlined-basic"
                        label="Company"
                        variant="outlined"
                        value={user.company}
                        onChange={(e) => handleChange(e, 'company')} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <CircularProgress
                        style={{ display: componentState.isBusy, margin: "auto" }} />
                </div>
                {componentState.requestMessage ? (
                    <div style={{ marginBottom: "15px", color: componentState.requestMsgColor }}>
                        <Alert
                            style={{ width: "40%", margin: "auto" }}
                            severity={(componentState.requestMsgColor === "#03945f") ? "success" : "error"}>
                            {componentState.requestMessage}
                        </Alert>
                    </div>
                ) : null}
                <Button
                    sx={{
                        width: "40%",
                        borderRadius: "20px",
                        marginBottom: "15px",
                        backgroundColor: "#54008c"
                    }}
                    onClick={(e) => handleOnClick(e)}
                    variant="contained"
                    disabled={componentState.buttonDisabled}>
                    Sign Up
                </Button>
            </Box>
        </div>
    );
}

