import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';


import { UserContext, NavigationContext, TankContext } from '../components/Context';
import { GET } from '../api/Get';
import { apiModes } from '../api/ApiProperties';

const rowsDummy = [
	{ id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
	{ id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
	{ id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
	{ id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
	{ id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
	{ id: 6, lastName: "Melisandre", firstName: null, age: 150 },
	{ id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
	{ id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
	{ id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function Tanks() {
    const navigate = useNavigate();
    const {user, setUser} = React.useContext(UserContext);
    const {tankContextData, setTankContextData} = React.useContext(TankContext);
    const [rows, setRows] = useState(rowsDummy);
    const [componentState, setComponentState] = useState({
        isBusy: false,
        
    });
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "tankId", headerName: "Tank ID", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130, hide: true },
        {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 160,
            hide: true,
            valueGetter: (params) =>
                `${params.getValue(params.id, "firstName") || ""} ${
                    params.getValue(params.id, "lastName") || ""
                }`,
        },
        {
            field: "action",
            headerName: "Options",
            description: "This column is for action buttons like edit or delete",
            sortable: false,
            width: 160,
            renderCell: (params) =>{
                return(
                    <div style={{margin: "auto"}}>
                        <IconButton onClick={() => {
                            console.log("Passed parameter: " + String(params.row.tankId));
                            setTankContextData({
                                tankSelected: params.row.tankId
                            });
                            navigate('/details-tank');
                         }}>
                            <Tooltip  title="Details" placement="left-start">
                                <VisibilityIcon/>
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => {
                            console.log("Passed parameter: " + String(params.row.tankId));
                            setTankContextData({
                                tankSelected: params.row.tankId
                            });
                            navigate('/modify-tank');
                        }}>
                            <Tooltip  title="Edit" placement="top">
                                <EditIcon/>
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => console.log("delete button")}>
                            <Tooltip title="Delete" placement="right-end">
                                <DeleteIcon/>
                            </Tooltip>
                        </IconButton>
                    </div>
                );
            }
        }
    ];

    useEffect(() => {
        async function fetchTanks() {
            try {
                const response = await GET(apiModes.FETCHTANKS, true, {
                    accessToken: localStorage.getItem("accessToken"),
                });
                
                const jsonData = await response.json();
                console.log(jsonData);
                if(jsonData.msg === 'Success fetching') {
                    console.log(jsonData.tanks);
                    if(!jsonData.tanks.length){console.log("no data ")}
                    setRows(jsonData.tanks);
                }
                else if(jsonData.msg === 'Token has expired') {
                    setUser({
                        name: "",
                        lastName: "",
                        email: "",
                        company: "",
                        access_token: ""
                    });
                    navigate('/log-in');
                }
            }
            catch(error) {
                console.log(error.message);
            }
        }
        fetchTanks();
    }, [])

	return (
        <div 
            style={{ 
                height: 400, 
                width: '60%',
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "100px",
                padding: "15px",
                borderRadius: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.9)"
            }}>
            <h1 style={{textAlign: "center"}}>{user.company} Tanks</h1>
            <div>
                <Button 
                    sx={{borderRadius: "10px"}} 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/add-tank')}>
                    Add
                </Button>
            </div>
            <DataGrid
                rows={
                    rows.map((item, index) => {
                        return {
                            id: (index+1),
                            tankId: item
                        }
                    })
                }
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                sx={{
                }}
            />
        </div>
	);
}
