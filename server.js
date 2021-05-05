const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json()); //req.body

app.get('/api/branches/autocomplete/q=:name%26limit=:lim%26offset=:off', async (req, res) => {
	try {
		const { name, lim, off } = req.params;
		const todo = await pool.query(`SELECT * FROM banks WHERE branch ILIKE '${name}%' OFFSET ${off} LIMIT ${lim}`);
		res.json(todo.rows);
	} catch (err) {
		console.error(err.message);
	}
});
app.get('/api/branches/q=:name%26limit=:lim%26offset=:off', async (req, res) => {
	try {
		const { lim, off, name } = req.params;
		const allTodos = await pool.query(`SELECT * FROM banks WHERE city ILIKE '${name}%' OFFSET ${off} LIMIT ${lim}`);
		res.json(allTodos.rows);
	} catch (err) {
		console.error(err.message);
	}
});

app.listen(process.env.PORT || 5000, () => {
	console.log('server has started on port 5000');
});
