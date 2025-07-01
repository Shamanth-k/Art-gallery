const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../database/db")

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey"

// Login User
const loginUser = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  const query = "SELECT * FROM users WHERE email = ?"

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err)
      return res.status(500).json({ message: "Database error" })
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" })
    }

    const user = results[0]

    try {
      // Compare hashed password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password" })
      }

      // Create JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

      // Send response with user and token (exclude password)
      const { password: _, ...userWithoutPassword } = user

      return res.status(200).json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      })
    } catch (error) {
      console.error("Password comparison error:", error)
      return res.status(500).json({ message: "Authentication error" })
    }
  })
}

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" })
  }

  try {
    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"

    db.query(query, [name, email, hashedPassword, "user"], (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" })
        }
        console.error("Database error:", err)
        return res.status(500).json({ message: "Database error" })
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: results.insertId,
      })
    })
  } catch (error) {
    console.error("Password hashing error:", error)
    return res.status(500).json({ message: "Registration error" })
  }
}

module.exports = { loginUser, registerUser }
