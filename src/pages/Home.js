import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@material-ui/core/Typography';
import HistoricImage from "../images/historicchart.PNG"

export default function Home() {
    const [dimensions, setDimensions] = useState({
        historicPictureHeight: 500,
        historicPictureWidht: 750
    })

    return(
        <Box
            sx={{
            borderRadius: "20px",
            width: "70%",
            height: "auto",
            paddingTop: "70px",
            paddingBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: ""
            }}> 
            <div>
            <Box
                component="img"
                sx={{
                height: dimensions.historicPictureHeight,
                width: dimensions.historicPictureWidht,
                //maxHeight: { xs: 233, md: 167 },
                //maxWidth: { xs: 350, md: 250 },
                }}
                alt="Historic Chart Image"
                src={HistoricImage}
            />
            </div>
            <Typography variant='h6'>
                Home
            </Typography>
        </Box>
    )
}