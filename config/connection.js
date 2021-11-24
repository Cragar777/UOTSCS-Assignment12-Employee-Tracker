const mysql = require("mysql2");

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PW,
    database: "employeetrackerdb"
  },
  console.log("Connected to the employee tracker db database.")
);

module.exports = db;