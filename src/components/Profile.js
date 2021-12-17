import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import BusinessIcon from '@mui/icons-material/Business';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

import { UserContext } from "./Context";
import { GET } from "../api/Get";
import { apiModes } from "../api/ApiProperties";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    width: "100%",
    color: theme.palette.text.secondary,
  }));

const skelethonStyle = {
    margin: "auto"
}; 

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        margin: "auto",
        width: 150,
        height: 150,
        fontSize: "70px"
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

export default function Profile() {
    const {user, setUser} = React.useContext(UserContext);
    const navigate = useNavigate();
    document.title = "User";
    const [localUser, setLocalUser] = useState({
        name: "",
        email: "",
        role: "",
        company: ""
    });

    useEffect(() => {
        async function getUser() {
            const response = await GET(apiModes.GETUSER, true, {accessToken: localStorage.getItem("accessToken")});
            const jsonData = await response.json();
            console.log(response.status);
            console.log(jsonData.msg);

            if(jsonData.msg === 'Succesfully authenticated') {
                setLocalUser({
                    name: jsonData.name,
                    email: jsonData.email,
                    role: jsonData.role,
                    company: jsonData.company
                })
            }
            else if(jsonData.msg === 'Token has expired') {
                localStorage.setItem("accessToken", "");
                localStorage.setItem("refreshToken", "");
                setUser({
                    name: "",
                    lastName: "",
                    email: "",
                    company: "",
                    access_token: ""
                });
                navigate("/log-in");
            }
            
        }
        getUser();
    }, []);

    return(
        <div style={{padding: "5px"}}>
            <div 
                style={{
                    marginTop: "100px",
                    width: "100%"
                }}>
            <Avatar {...stringAvatar("Jorge Ortiz")} />
            </div>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                justifyContent="space-evenly"
                alignItems="center"
                mt={2}>
                <Item>
                    <div>
                        {localUser.name ? (<h1>Name: {localUser.name}</h1>) : 
                        (<Skeleton
                            style={skelethonStyle}
                            width={"50%"}
                            height={50} />
                        )}
                        {localUser.email ? (<h1>Email: {localUser.email}</h1>) : 
                        (<Skeleton
                            style={skelethonStyle}
                            width={"50%"}
                            height={50} />
                        )}
                        {localUser.role ? (<h1>Role: {localUser.role}</h1>) : 
                        (<Skeleton
                            style={skelethonStyle}
                            width={"50%"}
                            height={50} />
                        )}
                        {localUser.company ? (<h1>Works at: {localUser.company}</h1>) : 
                        (<Skeleton
                            style={skelethonStyle}
                            width={"50%"}
                            height={50} />
                        )}
                    </div>
                </Item>
            </Stack>
        </div>
    );
}