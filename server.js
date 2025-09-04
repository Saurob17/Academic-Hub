// server.js
const mysql = require('mysql');


//object
const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1',
  database: 'Department'
});

module.exports = con;
