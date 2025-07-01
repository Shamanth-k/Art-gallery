const db = require("../database/db")

const buyTicketController = (req, res) => {
  const { exhibition_id, tickets_to_buy, user_id, payment_id, payment_method, total_amount } = req.body

  if (!exhibition_id || !tickets_to_buy || !user_id || !payment_id || !payment_method || !total_amount) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction failed", error: err })
    }

    // Step 1: Check ticket availability
    const checkQuery = "SELECT ticket_limit, ticket_sold, status FROM exhibitions WHERE id = ?"
    db.query(checkQuery, [exhibition_id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Error checking availability", error: err })
        })
      }

      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: "Exhibition not found" })
        })
      }

      const { ticket_limit, ticket_sold } = results[0]
      const ticketsRemaining = ticket_limit - (ticket_sold || 0)

      if (ticketsRemaining < tickets_to_buy) {
        return db.rollback(() => {
          res.status(400).json({ message: "Not enough tickets available" })
        })
      }

      // Step 2: Update ticket count in the exhibitions table
      const updateQuery = "UPDATE exhibitions SET ticket_sold = ticket_sold + ? WHERE id = ?"
      db.query(updateQuery, [tickets_to_buy, exhibition_id], (updateErr) => {
        if (updateErr) {
          return db.rollback(() => {
            res.status(500).json({
              message: "Error updating ticket count",
              error: updateErr,
            })
          })
        }

        // Step 3: Insert ticket purchase details into the 'tickets' table
        const insertTicketQuery =
          "INSERT INTO tickets (exhibition_id, user_id, tickets_purchased, purchase_date) VALUES (?, ?, ?, NOW())"
        db.query(insertTicketQuery, [exhibition_id, user_id, tickets_to_buy], (insertErr) => {
          if (insertErr) {
            return db.rollback(() => {
              res.status(500).json({
                message: "Error saving ticket sale",
                error: insertErr,
              })
            })
          }

          // Step 4: Insert payment record into the 'payments' table
          const insertPaymentQuery =
            "INSERT INTO payments (payment_id, user_id, exhibition_id, tickets, payment_method, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'completed', NOW())"
          db.query(
            insertPaymentQuery,
            [payment_id, user_id, exhibition_id, tickets_to_buy, payment_method, total_amount],
            (paymentErr) => {
              if (paymentErr) {
                return db.rollback(() => {
                  res.status(500).json({
                    message: "Error saving payment record",
                    error: paymentErr,
                  })
                })
              }

              // Commit the transaction
              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    res.status(500).json({
                      message: "Transaction commit failed",
                      error: commitErr,
                    })
                  })
                }

                res.status(200).json({
                  message: `Ticket purchase successful!`,
                  tickets_purchased: tickets_to_buy,
                })
              })
            }
          )
        })
      })
    })
  })
}

const cancelTicketController = async (req, res) => {
  const { exhibition_id, tickets_to_cancel } = req.body

  if (!exhibition_id || !tickets_to_cancel) {
    return res.status(400).json({ message: "Missing exhibition_id or tickets_to_cancel" })
  }

  // Call the stored procedure to cancel the tickets
  const cancelTicketQuery = "CALL cancel_ticket(?, ?)"
  db.query(cancelTicketQuery, [exhibition_id, tickets_to_cancel], (err, results) => {
    if (err) {
      console.error("Error canceling ticket:", err)
      return res.status(500).json({ message: "Failed to cancel ticket", error: err.message })
    }

    // Success response
    res.status(200).json({
      message: results[0][0].status, // Assuming the stored procedure returns a status message
    })
  })
}

const getTicketsByUserId = (req, res) => {
  const userId = req.query.user_id

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" })
  }

  const query = `
    SELECT 
      t.id, 
      t.exhibition_id, 
      t.tickets_purchased, 
      t.purchase_date,
      e.name as exhibition_name,
      e.location,
      e.start_date,
      e.end_date,
      e.ticket_price,
      p.payment_id,
      p.status,
      p.payment_method,
      p.total_amount,
      p.created_at as payment_date
    FROM tickets t
    LEFT JOIN exhibitions e ON t.exhibition_id = e.id
    LEFT JOIN payments p ON t.user_id = p.user_id AND t.exhibition_id = p.exhibition_id
    WHERE t.user_id = ?
    ORDER BY t.purchase_date DESC
  `

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching tickets:", err)
      return res.status(500).json({ message: "Failed to fetch tickets", error: err })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No tickets found for this user" })
    }

    res.status(200).json({ tickets: results })
  })
}

module.exports = {
  buyTicketController,
  cancelTicketController,
  getTicketsByUserId,
}
