import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableContainer,
	TableRow,
	TablePagination,
	Select,
	MenuItem,
	FormControl,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Watchlist from './watchlist';
import useSWR, { SWRConfig } from 'swr';
import axios from 'axios';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	header: {
		backgroundColor: 'black',
		color: 'white',
		boxShadow: '0px 0px 0px 0px',
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
		marginTop: 8,
	},
	table: {
		minWidth: 700,
	},
	formControl: {
		margin: 'auto',
		marginBottom: theme.spacing(2),
		minWidth: 120,
		backgroundColor: 'white',
	},
	toolbarLink: {
		marginLeft: theme.spacing(2),
		flexShrink: 0,
		color: 'white',
	},
}));

function App() {
	const classes = useStyles();
	const matches = useMediaQuery('(max-width:450px)');

	const [row, setRow] = useState();
	const [city, setCity] = useState('VISNAGAR');
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('');
	const [ifsc, setIfsc] = useState([]);
	const [coord, setCoord] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleChange = (event) => {
		setCity(event.target.value);
	};

	const fetcher = (...args) => axios.get(...args).then((res) => res.data);
	const { data } = useSWR(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`, fetcher);

	const getData = () => {
		if (!data) {
			setLoading(true);
		} else {
			setRow(data);
			console.log(data);
			setLoading(false);
		}
	};
	const getCity = () => {
		axios
			.get(
				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coord[0]} &longitude=${coord[1]} &localityLanguage=en`
			)
			.then((res) => setCity(res.data.localityInfo.administrative[3].name.split(' ')[0].toUpperCase()));
	};

	useEffect(() => {
		if (JSON.parse(localStorage.getItem('ifsc')) != null) {
			console.log('pass2');
		} else {
			window.localStorage.setItem('ifsc', JSON.stringify([]));
		}
	}, []);

	const getIfsc = () => {
		function getUnique(array) {
			var uniqueArray = [];
			for (var i = 0; i < array.length; i++) {
				if (uniqueArray.indexOf(array[i]) === -1) {
					uniqueArray.push(array[i]);
				}
			}
			return uniqueArray;
		}

		setIfsc(getUnique(JSON.parse(localStorage.getItem('ifsc'))));
		console.log(ifsc);
	};

	useEffect(() => {
		getData();
	}, [city, data]);
	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) =>
			setCoord([position.coords.latitude, position.coords.longitude])
		);
		console.log(coord);
	}, [city]);
	return (
		<div>
			<Router>
				<Switch>
					<Route path="/watchlist">
						<React.Fragment>
							<Watchlist getIfsc={getIfsc} />
						</React.Fragment>
					</Route>
					<Route path="/">
						<React.Fragment>
							{matches ? (
								<div className={classes.root}>
									<AppBar position="static" className={classes.header}>
										<Toolbar style={{ display: 'flex', flexDirection: 'column' }}>
											<div style={{ display: 'flex', flexDirection: 'row' }}>
												<IconButton
													edge="start"
													className={classes.menuButton}
													color="inherit"
													aria-label="menu"
												>
													<AccountBalanceIcon />
												</IconButton>
												<Typography variant="h6" className={classes.title}>
													Search your nearby banks
												</Typography>
												<Link
													to="/watchlist"
													className={classes.toolbarLink}
													color="inherit"
													noWrap
												>
													<IconButton edge="start" color="inherit" aria-label="menu">
														<TurnedInNotIcon />
													</IconButton>
												</Link>
											</div>
											<div style={{ display: 'flex', flexDirection: 'row' }}>
												<input
													type="text"
													style={{ marginRight: 20, height: 27 }}
													placeholder="search by bank name"
													value={filter}
													onChange={(e) => setFilter(e.target.value)}
												/>

												<FormControl className={classes.formControl}>
													<Select
														labelId="demo-simple-select-label"
														color="secondary"
														id="demo-simple-select"
														value={city}
														onChange={handleChange}
													>
														<MenuItem onClick={getCity}>current location</MenuItem>
														<MenuItem value={'VISNAGAR'}>Visnagar</MenuItem>
														<MenuItem value={'AHMEDABAD'}>Ahmedabad</MenuItem>
														<MenuItem value={'MAHESANA'}>Mahesana</MenuItem>
														<MenuItem value={'PUNE'}>Pune</MenuItem>
														<MenuItem value={'MUMBAI'}>Mumbai</MenuItem>
													</Select>
												</FormControl>
											</div>
										</Toolbar>
									</AppBar>
								</div>
							) : (
								<div className={classes.root}>
									<AppBar position="static" className={classes.header}>
										<Toolbar>
											<IconButton
												edge="start"
												className={classes.menuButton}
												color="inherit"
												aria-label="menu"
											>
												<AccountBalanceIcon />
											</IconButton>
											<Typography variant="h6" className={classes.title}>
												Search your nearby banks
											</Typography>

											<input
												type="text"
												style={{ marginRight: 20, height: 27 }}
												placeholder="search by bank name"
												value={filter}
												onChange={(e) => setFilter(e.target.value)}
											/>

											<FormControl className={classes.formControl}>
												<Select
													labelId="demo-simple-select-label"
													color="secondary"
													id="demo-simple-select"
													value={city}
													onChange={handleChange}
												>
													<MenuItem onClick={getCity}>current location</MenuItem>
													<MenuItem value={'VISNAGAR'}>Visnagar</MenuItem>
													<MenuItem value={'AHMEDABAD'}>Ahmedabad</MenuItem>
													<MenuItem value={'MAHESANA'}>Mahesana</MenuItem>
													<MenuItem value={'PUNE'}>Pune</MenuItem>
													<MenuItem value={'MUMBAI'}>Mumbai</MenuItem>
												</Select>
											</FormControl>
											<Link
												to="/watchlist"
												className={classes.toolbarLink}
												color="inherit"
												noWrap
											>
												<IconButton edge="start" color="inherit" aria-label="menu">
													<TurnedInNotIcon />
												</IconButton>
											</Link>
										</Toolbar>
									</AppBar>
								</div>
							)}
							<div>
								<SWRConfig
									value={{
										fetcher,
									}}
								>
									{loading ? (
										<h1>Loading...</h1>
									) : (
										<div>
											<TableContainer>
												<Table className={classes.table} aria-label="customized table">
													<TableHead>
														<TableRow>
															<StyledTableCell>watchlist</StyledTableCell>
															<StyledTableCell>ifsc</StyledTableCell>
															<StyledTableCell>bank_id</StyledTableCell>
															<StyledTableCell>branch</StyledTableCell>
															<StyledTableCell>address</StyledTableCell>
															<StyledTableCell>city</StyledTableCell>
															<StyledTableCell>district</StyledTableCell>
															<StyledTableCell>state</StyledTableCell>
															<StyledTableCell>bank_name</StyledTableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{row
															.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
															.filter((item) =>
																item.bank_name.includes(filter.toUpperCase())
															)
															.map((rows) => (
																<StyledTableRow key={rows.name}>
																	<StyledTableCell component="th" scope="row">
																		{JSON.parse(
																			localStorage.getItem('ifsc')
																		).includes(rows.ifsc) ? (
																			<IconButton
																				type="submit"
																				aria-label="search"
																				onClick={() => {
																					localStorage.removeItem(rows.ifsc);
																					var del = JSON.parse(
																						localStorage.getItem('ifsc')
																					).filter(
																						(item) => item !== rows.ifsc
																					);
																					window.localStorage.setItem(
																						'ifsc',
																						JSON.stringify(del)
																					);

																					getIfsc();
																				}}
																			>
																				<TurnedInIcon />
																			</IconButton>
																		) : (
																			<IconButton
																				type="submit"
																				aria-label="search"
																				onClick={() => {
																					if (
																						JSON.parse(
																							localStorage.getItem('ifsc')
																						) != null
																					) {
																						ifsc = JSON.parse(
																							localStorage.getItem('ifsc')
																						);

																						ifsc.push(rows.ifsc);
																						window.localStorage.setItem(
																							'ifsc',
																							JSON.stringify(ifsc)
																						);
																					} else {
																						var ifsc = [];
																						window.localStorage.setItem(
																							'ifsc',
																							JSON.stringify(ifsc)
																						);
																						ifsc = JSON.parse(
																							localStorage.getItem('ifsc')
																						);
																						ifsc.push(rows.ifsc);
																						window.localStorage.setItem(
																							'ifsc',
																							JSON.stringify(ifsc)
																						);
																					}

																					window.localStorage.setItem(
																						rows.ifsc,
																						JSON.stringify({
																							ifsc: rows.ifsc,
																							bank_id: rows.bank_id,
																							branch: rows.branch,
																							address: rows.address,
																							city: rows.city,
																							district: rows.district,
																							state: rows.state,
																							bank_name: rows.bank_name,
																						})
																					);
																					getIfsc();
																				}}
																			>
																				<TurnedInNotIcon />
																			</IconButton>
																		)}
																	</StyledTableCell>
																	<StyledTableCell>{rows.ifsc}</StyledTableCell>

																	<StyledTableCell>{rows.bank_id}</StyledTableCell>
																	<StyledTableCell>{rows.branch}</StyledTableCell>
																	<StyledTableCell>{rows.address}</StyledTableCell>
																	<StyledTableCell>{rows.city}</StyledTableCell>
																	<StyledTableCell>{rows.district}</StyledTableCell>
																	<StyledTableCell>{rows.state}</StyledTableCell>
																	<StyledTableCell>{rows.bank_name}</StyledTableCell>
																</StyledTableRow>
															))}
													</TableBody>
												</Table>
											</TableContainer>
											<TablePagination
												rowsPerPageOptions={[10, 25, 100]}
												component="div"
												count={row.length}
												rowsPerPage={rowsPerPage}
												page={page}
												onChangePage={handleChangePage}
												onChangeRowsPerPage={handleChangeRowsPerPage}
											/>
										</div>
									)}
								</SWRConfig>
							</div>
						</React.Fragment>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
