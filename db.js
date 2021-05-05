const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'puqfkmniinrmnj',
	password: '75774f25aad2d9e1f85b5f0e3e8ac95e84582ce9a394b90580fb49c08872d1ec',
	host: 'ec2-34-200-94-86.compute-1.amazonaws.com',
	port: 5432,
	database: 'dl06ua7md94sj',
	ssl: {
		rejectUnauthorized: false,
	},
});

module.exports = pool;
