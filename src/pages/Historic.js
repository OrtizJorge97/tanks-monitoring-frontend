import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DateAdapter from "@mui/lab/AdapterDateFns";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import socketIOClient from "socket.io-client";

import HistoricalChart from "../components/historical/HistoricalChart";
import { Line } from "react-chartjs-2";
import { UserContext, NavigationContext } from "../components/Context";
import { socketApiRoute } from "../api/ApiProperties";
import { apiModes } from "../api/ApiProperties";
import useFetch from "../hooks/useFetch";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const tankSelectedDummy = "MT002";

export default function Historic() {
  const { user, setUser } = useContext(UserContext);
  const {navigation, setNavigation} = React.useContext(NavigationContext);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [datesRange, setDatesRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [tanks, setTanks] = useState([]); //data for the select control which comes from backend to display all tanks available
  const [tank, setTank] = useState(null); //tankSelected
  const [data, setData, doFetch] = useFetch([]);
  const [componentState, setComponentState] = useState({
    notificationMessage: "",
    notificationType: "",
  });
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const stablishSocketConnection = async (jsonData) => {
    let socket = socketIOClient(socketApiRoute);
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Successfully connected to socket!");
      socket.emit("join_user_sessionid", {
        email: localStorage.getItem("email"),
        company: localStorage.getItem("company"),
      });
      setOpen(true);
      setComponentState({
        notificationMessage: "Successfully connected",
        notificationType: "success",
      });
    });
    socket.on("success_joinning", (msj) => {
      console.log("message from server conection: " + msj.message);
    });
    socket.on("get_historic_data", (historicData) => {
      //setSocketData(historicData);
      updateHistoricData(historicData);
    });
    socket.on("connect_error", (err) =>
      console.log("connect_error: " + err.message)
    );
    socket.on("connect_failed", (err) =>
      console.log("connect_failed: " + err.message)
    );
    socket.on("disconnect", (err) => {
      setOpen(true);
      setComponentState({
        notificationMessage: "Connection lost :(",
        notificationType: "error",
      });
    });
    return socket;
  };
  const selectedTankHandle = (e) => {
	  setTank(e.target.value);
  }
  const handleDateRangeChange = (e, prop) => {
    let value = e.target.value;
    let property = prop;

    setDatesRange(oldDatesRanges => {
      let newDatesRanges = {};
      let errorMessage = ""
      if(property === 'startDate' && value > oldDatesRanges.endDate) {
        errorMessage = 'Start Date cannot be greater than End Date.';
        newDatesRanges = {
          ...oldDatesRanges,
          [property]: oldDatesRanges.startDate
        };
      }
      else if(property === 'endDate' && value < oldDatesRanges.startDate) {
        errorMessage = 'End Date cannot be smaller than Start Date.';
        newDatesRanges = {
          ...oldDatesRanges,
          [property]: oldDatesRanges.endDate
        };
      }
      else {
        newDatesRanges = {
          ...oldDatesRanges,
          [property]: value
        };
      }
      if(errorMessage) {
        alert(errorMessage);
      }
      return newDatesRanges
      
    })
  }

  const updateHistoricData = async (paramData) => {
    console.log("------HISTORIC DATA FROM SERVER-------");
    console.log(paramData);
    /*
			OxygenPercentage: (3) [66, 27, 58]
			Ph: (3) [8, 1, 5]
			WtrLvl: (3) [103, 86, 133]
			id: (3) ['MT001', 'MT002', 'MT003']
			timestamp: (3) [1644342022, 1644342022, 1644342022]
			[[Prototype]]: Object
		*/
    setData(oldData => {
      let newData = [];
      oldData.forEach(element => {
        let tankNameStringIndex = paramData.id.indexOf(element.tank_name); //gets the string name tank index from new data from server
        let tankDataObject = {
          tank_name: element.tank_name,
          WtrLvlValues: [...element.WtrLvlValues, paramData.WtrLvl[tankNameStringIndex]],
          OxygenPercentageValues: [...element.OxygenPercentageValues, paramData.OxygenPercentage[tankNameStringIndex]],
          PhValues: [...element.PhValues, paramData.Ph[tankNameStringIndex]],
          timestamp: [...element.timestamp, paramData.timestamp[tankNameStringIndex]]
        };
        newData.push(tankDataObject);
      });

      return newData;
    });
    
  };

  async function processRequestedHistoric(paramData) {
    let tankNames = paramData.map(element => {
      return element.tank_name;
    });
    setTank(tankNames[0])
    setTanks(tankNames);
    setData(paramData);
  }

  useEffect(() => {
    setNavigation({
      ...navigation,
      currentPage: "Historic Visualization"
    });
    var socket = null;
    const stablishConnection = async () => {
      try {
        const jsonData = await doFetch("GET", apiModes.FETCHHISTORIC, true, {
          accessToken: localStorage.getItem("accessToken"),
          company: localStorage.getItem("company"),
        });
        if (jsonData.msg === "Token has expired") {
          setUser({
            name: "",
            lastName: "",
            email: "",
            company: "",
            access_token: "",
          });
          navigate("/log-in");
        } else if (jsonData.msg === "Successfully fetched") {
          socket = await stablishSocketConnection(jsonData);
          processRequestedHistoric(jsonData.data);
        }
      } catch (error) {}
    };
    if (!socket) {
      stablishConnection();
    }
    return () => {
      console.log(socket);
      if (socket) {
        socket.close();
      }
    };
  }, []);
  return (
    <Box
      component="form"
      noValidate
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "100px",
        padding: "10px",
        width: "50%",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255, 0.8)",
        borderRadius: "15px",
        textAlign: "center",
      }}
      autoComplete="off"
    >
      <h1 style={{ color: "black", fontWeight: 600 }}>Historic Data</h1>
      {tank ? (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Tank</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={tank}
            label="Select Tank"
            onChange={selectedTankHandle}
          >
            {tanks.map((tankString) => {
              return <MenuItem key={tankString} value={tankString}>{tankString}</MenuItem>;
            })}
          </Select>
        </FormControl>
      ) : null}
      <div style={{marginTop: "20px", marginBottom: "20px"}}>
        <TextField
          id="date"
          label="Start Date"
          type="date"
          defaultValue="2022/02/03"
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={datesRange.startDate}
          onChange={e => handleDateRangeChange(e, 'startDate')}
        />
        <TextField
          id="date"
          label="End Date"
          type="date"
          defaultValue="2022/02/03"
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={datesRange.endDate}
          onChange={e => handleDateRangeChange(e, 'endDate')}
        />
      </div>
      <HistoricalChart data={data} tankSelected={tank} datesRange={datesRange}/>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={(event, reason) => handleClose(event, reason)}
      >
        {componentState.notificationType ? (
          <Alert
            onClose={(event, reason) => handleClose(event, reason)}
            severity={componentState.notificationType}
            sx={{ width: "100%" }}
          >
            {componentState.notificationMessage}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
}
