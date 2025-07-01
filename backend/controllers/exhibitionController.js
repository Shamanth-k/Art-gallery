const db = require("../database/db")

const addExhibition = (req, res) => {
  const { name, start_date, end_date, location, ticket_price, ticket_limit, description } = req.body

  // Validation
  if (!name || !start_date || !end_date || !location || !ticket_price || !ticket_limit || !description) {
    return res.status(400).json({ message: "All fields are required" })
  }

  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({ message: "End date must be after start date" })
  }

  if (ticket_price < 0 || ticket_limit < 1) {
    return res.status(400).json({ message: "Invalid ticket price or limit" })
  }

  const query = `
    INSERT INTO exhibitions (name, start_date, end_date, location, ticket_price, ticket_limit, description, ticket_sold) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `

  db.query(query, [name, start_date, end_date, location, ticket_price, ticket_limit, description], (err, result) => {
    if (err) {
      console.error("Error adding exhibition:", err)
      return res.status(500).json({
        message: "Error adding exhibition",
        error: process.env.NODE_ENV === "development" ? err.message : "Database error",
      })
    }
    return res.status(201).json({
      message: "Exhibition added successfully",
      exhibitionId: result.insertId,
    })
  })
}

// Get all exhibitions
const getExhibitions = (req, res) => {
  const query = "SELECT * FROM exhibitions ORDER BY start_date DESC"

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching exhibitions:", err)
      return res.status(500).json({
        message: "Database error",
        error: process.env.NODE_ENV === "development" ? err.message : "Failed to fetch exhibitions",
      })
    }
    res.status(200).json({ exhibitions: results })
  })
}

// Get single exhibition by ID
const getExhibitionById = (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Valid exhibition ID is required" })
  }

  const query = "SELECT * FROM exhibitions WHERE id = ?"

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching exhibition:", err)
      return res.status(500).json({ message: "Database error" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Exhibition not found" })
    }

    res.status(200).json({ exhibition: results[0] })
  })
}

const deleteExhibition = (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Valid exhibition ID is required" })
  }

  // Check if exhibition exists and get its details
  const checkQuery = "SELECT ticket_sold, end_date FROM exhibitions WHERE id = ?"

  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error("Error checking exhibition:", err)
      return res.status(500).json({ message: "Database error" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Exhibition not found" })
    }

    const exhibition = results[0]
    const ticketsSold = exhibition.ticket_sold || 0
    const endDate = new Date(exhibition.end_date)
    const now = new Date()

    // Allow deletion if:
    // 1. No tickets have been sold, OR
    // 2. The exhibition has ended
    const canDelete = ticketsSold === 0 || now > endDate

    if (!canDelete) {
      return res.status(400).json({
        message: "Cannot delete active exhibition with sold tickets. Exhibition must be ended or have no ticket sales.",
      })
    }

    // Start transaction to delete related records
    db.beginTransaction((transErr) => {
      if (transErr) {
        console.error("Transaction error:", transErr)
        return res.status(500).json({ message: "Transaction failed" })
      }

      // Delete related payments first
      const deletePaymentsQuery = "DELETE FROM payments WHERE exhibition_id = ?"
      db.query(deletePaymentsQuery, [id], (paymentErr) => {
        if (paymentErr) {
          return db.rollback(() => {
            console.error("Error deleting payments:", paymentErr)
            res.status(500).json({ message: "Failed to delete related payments" })
          })
        }

        // Delete related tickets
        const deleteTicketsQuery = "DELETE FROM tickets WHERE exhibition_id = ?"
        db.query(deleteTicketsQuery, [id], (ticketErr) => {
          if (ticketErr) {
            return db.rollback(() => {
              console.error("Error deleting tickets:", ticketErr)
              res.status(500).json({ message: "Failed to delete related tickets" })
            })
          }

          // Finally delete the exhibition
          const deleteExhibitionQuery = "DELETE FROM exhibitions WHERE id = ?"
          db.query(deleteExhibitionQuery, [id], (deleteErr) => {
            if (deleteErr) {
              return db.rollback(() => {
                console.error("Error deleting exhibition:", deleteErr)
                res.status(500).json({ message: "Failed to delete exhibition" })
              })
            }

            // Commit the transaction
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  console.error("Commit error:", commitErr)
                  res.status(500).json({ message: "Failed to commit deletion" })
                })
              }

              res.status(200).json({
                message: "Exhibition and all related data deleted successfully",
                deletedTickets:
                  ticketsSold > 0 ? "Related tickets and payments were also removed" : "No related data to remove",
              })
            })
          })
        })
      })
    })
  })
}

module.exports = {
  addExhibition,
  getExhibitions,
  getExhibitionById,
  deleteExhibition,
}
