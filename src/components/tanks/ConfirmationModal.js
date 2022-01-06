import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ConfirmationModal(props) {
    const { 
		open, 
		tankSelected, 
		handleClose, 
		handleDelete, 
		deleteIsBusy,
		deleteModalMsg 
	} = props;
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby='responsive-dialog-title'>
				<DialogTitle id='responsive-dialog-title'>
					{`Tank ${tankSelected} will be deleted`}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
                    Are you sure?. This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				{deleteModalMsg ? (
					<div 
						style={{
							marginLeft: "auto",
							marginRight: "auto"
						}}>
							{deleteModalMsg}
					</div>
				) : null}
				<div style={{display: (deleteIsBusy ? "block" : "none"), marginLeft: "auto", marginRight: "auto"}}>
					<CircularProgress />
				</div>
				<DialogActions>
					<Button autoFocus onClick={() => handleClose()}>
						Cancel
					</Button>
					<Button onClick={() => handleDelete()} autoFocus>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
