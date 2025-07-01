const mysql = require("mysql2")
require("dotenv").config()

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "sk1992004",
  database: process.env.DB_NAME || "art__gallery",
})

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err)
    throw err
  }
  console.log("Connected to MySQL database.")
})

// Handle connection errors
db.on("error", (err) => {
  console.error("Database error:", err)
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Attempting to reconnect...")
    // Implement reconnection logic if needed
  } else {
    throw err
  }
})

module.exports = db
