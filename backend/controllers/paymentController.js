const db = require("../database/db") // Ensure this points to your DB connection module

// Function to handle payment processing
const processPayment = (req, res) => {
  const { payment_id, user_id, exhibition_id, tickets, payment_method, total_amount } = req.body

  // Validate input fields
  if (!payment_id || !user_id || !exhibition_id || !tickets || !payment_method || !total_amount) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  // Start a transaction to ensure data consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err)
      return res.status(500).json({ message: "Transaction failed", error: err })
    }

    // Step 1: Check ticket availability
    const checkQuery = "SELECT ticket_limit, ticket_sold FROM exhibitions WHERE id = ?"
    db.query(checkQuery, [exhibition_id], (checkErr, checkResults) => {
      if (checkErr) {
        return db.rollback(() => {
          console.error("Error checking availability:", checkErr)
          res.status(500).json({ message: "Error checking availability", error: checkErr })
        })
      }

      if (checkResults.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: "Exhibition not found" })
        })
      }

      const { ticket_limit, ticket_sold } = checkResults[0]
      const ticketsRemaining = ticket_limit - (ticket_sold || 0)

      if (ticketsRemaining < tickets) {
        return db.rollback(() => {
          res.status(400).json({ message: "Not enough tickets available" })
        })
      }

      // Step 2: Insert payment details into the 'payments' table
      const insertPaymentQuery = `
        INSERT INTO payments (payment_id, user_id, exhibition_id, tickets, payment_method, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, 'completed')
      `

      db.query(
        insertPaymentQuery,
        [payment_id, user_id, exhibition_id, tickets, payment_method, total_amount],
        (paymentErr) => {
          if (paymentErr) {
            return db.rollback(() => {
              console.error("Error saving payment:", paymentErr)
              res.status(500).json({
                message: "Error saving payment information",
                error: paymentErr,
              })
            })
          }

          // Step 3: Insert ticket purchase into the 'tickets' table
          const insertTicketQuery = `
            INSERT INTO tickets (exhibition_id, user_id, tickets_purchased, purchase_date)
            VALUES (?, ?, ?, NOW())
          `

          db.query(insertTicketQuery, [exhibition_id, user_id, tickets], (ticketErr) => {
            if (ticketErr) {
              return db.rollback(() => {
                console.error("Error saving ticket:", ticketErr)
                res.status(500).json({
                  message: "Error saving ticket information",
                  error: ticketErr,
                })
              })
            }

            // Step 4: Update ticket sold count in the 'exhibitions' table
            const updateQuery = `
              UPDATE exhibitions
              SET ticket_sold = ticket_sold + ?
              WHERE id = ?
            `

            db.query(updateQuery, [tickets, exhibition_id], (updateErr) => {
              if (updateErr) {
                return db.rollback(() => {
                  console.error("Error updating ticket count:", updateErr)
                  res.status(500).json({
                    message: "Error updating ticket count",
                    error: updateErr,
                  })
                })
              }

              // Commit the transaction
              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    console.error("Transaction commit failed:", commitErr)
                    res.status(500).json({
                      message: "Transaction commit failed",
                      error: commitErr,
                    })
                  })
                }

                console.log("Payment and ticket purchase successful")
                res.status(200).json({
                  message: "Payment successful!",
                  payment_id: payment_id,
                  tickets_purchased: tickets,
                })
              })
            })
          })
        },
      )
    })
  })
}

module.exports = { processPayment }
