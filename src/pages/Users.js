import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

import useFetch from "../hooks/useFetch";
import { apiModes } from "../api/ApiProperties";
import { UserContext, NavigationContext } from "../components/Context";
import ConfirmationModalUsers from "../components/users/ConfirmationModalUsers";

export default function Users() {
	const {navigation, setNavigation} = React.useContext(NavigationContext);
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [componentState, setComponentState] = useState({
		userSelected: "",
		deleteIsBusy: false,
		deleteModalMsg: ""
	});
	const [users, setUsers, doFetch] = useFetch([]);

	const columns = [
		//{ field: "id", headerName: "ID", width: 70 },
		{ field: "name", headerName: "User Name", width: 100 },
		{ field: "lastName", headerName: "Last Name", width: 130, hide: false },
		{
			field: "fullName",
			headerName: "Full name",
			description: "This column has a value getter and is not sortable.",
			sortable: false,
			width: 160,
			hide: true,
			valueGetter: (params) =>
				`${params.getValue(params.id, "firstName") || ""} ${params.getValue(params.id, "lastName") || ""
				}`,
		},
		{ field: "email", headerName: "Email", width: 200 },
		{ field: "role", headerName: "Role", width: 130 },
		{
			field: "action",
			headerName: "Options",
			description: "This column is for action buttons like edit or delete",
			sortable: false,
			width: 160,
			renderCell: (params) => {
				const renderForAdminRole = !(localStorage.getItem("role") === "Administrator" && params.row.role === 'Supervisor')
				return (
					<div style={{ margin: "auto" }}>
						{renderForAdminRole ?
							<React.Fragment>
								<IconButton
									onClick={() => {
										console.log("Passed parameter: " + String(params.row.email));

										navigate("/update-user", {
											replace: false,
											state: {
												email: params.row.email,
											},
										});
									}}>
									<Tooltip title='Edit' placement='left'>
										<EditIcon />
									</Tooltip>
								</IconButton>
								<IconButton onClick={() => {
									setComponentState({
										deleteModalMsg: ""
									});
									setOpen(true);
									setComponentState({
										...componentState,
										userSelected: params.row.email
									});
								}}>
									<Tooltip title='Delete' placement='right-end'>
										<DeleteIcon />
									</Tooltip>
								</IconButton>
							</React.Fragment>
							: null}
					</div>
				);
			},
		},
	];
	const handleDelete = async () => {
		try {
			setComponentState({
				deleteIsBusy: true,
				deleteModalMsg: ""
			});
			console.log("pressed deleting user " + String(componentState.userSelected));
			const jsonData = await doFetch("DELETE", apiModes.DELETEUSER, true, {
				email: componentState.userSelected,
				accessToken: localStorage.getItem("accessToken"),
			});
			console.log(jsonData);
			if (jsonData.msg === "Token has expired") {
				navigate("/log-in");
			}
			if (jsonData.msg === "Operation Succeded") {
				fetchUsers();
				setOpen(false);
				setComponentState({
					deleteIsBusy: false,
					deleteModalMsg: jsonData.msg
				});
			}
		}
		catch (error) {

		}
	};
	const fetchUsers = async () => {
		try {
			const jsonData = await doFetch("GET", apiModes.FETCHUSERS, true, {
				accessToken: localStorage.getItem("accessToken"),
				company: localStorage.getItem("company"),
			});
			console.log(jsonData);
			if (jsonData.msg === "Token has expired") {
				navigate("/log-in");
			}
			if (jsonData.msg === "Success Fetching") {
				setUsers(jsonData.users);
			}
		} catch (error) { }
	};
	useEffect(() => {
		setNavigation({
			...navigation,
			currentPage: "Users"
		});
		fetchUsers();
	}, []);
	return (
		<div
			style={{
				height: 400,
				width: "80%",
				marginLeft: "auto",
				marginRight: "auto",
				marginTop: "100px",
				padding: "15px",
				borderRadius: "10px",
				backgroundColor: "rgba(0, 0, 0, 0)",
			}}>
			<h1 style={{ textAlign: "center", fontWeight: 600 }}>Users</h1>

			<DataGrid
				rows={users.map((item, index) => {
					return {
						id: index + 1,
						name: item.name,
						lastName: item.lastName,
						email: item.email,
						role: item.role,
					};
				})}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				sx={{}}
			/>
			<ConfirmationModalUsers
				open={open}
				userSelected={componentState.userSelected}
				setOpen={setOpen}
				handleDelete={handleDelete}
				deleteIsBusy={componentState.deleteIsBusy}
				deleteModalMsg={componentState.deleteModalMsg}
			/>
		</div>
	);
}
