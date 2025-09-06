// server.js
const mysql = require('mysql');


//object
const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'nodeuser',
  password: 'NodePassword123',
  database: 'university'
});

module.exports = con;
