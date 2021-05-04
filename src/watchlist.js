import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Paper, Grid, ButtonBase } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root1: {
		flexGrow: 1,
	},
	header: {
		backgroundColor: 'black',
		color: 'white',
		boxShadow: '0px 0px 0px 0px',
	},

	toolbarLink: {
		padding: theme.spacing(1),
		flexShrink: 0,
		color: 'white',
	},

	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		marginTop: 20,
		maxWidth: 500,
	},
	image: {
		width: 128,
		height: 128,
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
	},
}));

const Watchlist = ({ getIfsc }) => {
	const classes = useStyles();
	const [data, setData] = useState(JSON.parse(localStorage.getItem('ifsc')));

	return (
		<div>
			<div className={classes.root1}>
				<AppBar position="static" className={classes.header}>
					<Toolbar>
						<Link to="/" edge="start" className={classes.toolbarLink} color="inherit" noWrap>
							<IconButton edge="start" color="inherit" aria-label="menu">
								<ArrowBackIcon />
							</IconButton>
						</Link>

						<Typography variant="h6" className={classes.title}>
							Your Watchlist
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
			<div>
				{data.map((items) => (
					<Paper className={classes.paper}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm container>
								<Grid item xs container direction="column" spacing={2}>
									<Grid item xs>
										<Typography gutterBottom variant="subtitle1">
											Branch: {JSON.parse(localStorage.getItem(items)).branch}
											<strong>({JSON.parse(localStorage.getItem(items)).bank_name}) in </strong>
											{JSON.parse(localStorage.getItem(items)).city}
										</Typography>
										<Typography variant="body2" gutterBottom>
											<strong>IFSC:</strong> {JSON.parse(localStorage.getItem(items)).ifsc}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											<strong>Address: </strong>
											{JSON.parse(localStorage.getItem(items)).address}
										</Typography>
										<Typography variant="body2">
											bank id: {JSON.parse(localStorage.getItem(items)).bank_id}
										</Typography>
									</Grid>
								</Grid>
								<Grid item>
									<IconButton
										onClick={async () => {
											var del = JSON.parse(localStorage.getItem('ifsc')).filter(
												(x) => x !== JSON.parse(localStorage.getItem(items)).ifsc
											);

											await localStorage.setItem('ifsc', JSON.stringify(del));
											localStorage.removeItem(JSON.parse(localStorage.getItem(items)).ifsc);
											setData(JSON.parse(localStorage.getItem('ifsc')));
											getIfsc();
										}}
									>
										<DeleteOutlineIcon />
									</IconButton>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				))}
			</div>
		</div>
	);
};

export default Watchlist;
