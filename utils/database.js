const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'mystore',
  port: 3306,
  multipleStatements: true,
});

module.exports = db;
