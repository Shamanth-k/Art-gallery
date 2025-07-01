// artistController.js

const db = require("../database/db"); // Your database connection

// Add a new artist
const addArtistController = (req, res) => {
  const { name, country, biography, date_of_birth, date_of_death, art_piece } =
    req.body;

  const query = `INSERT INTO artists (name, country, biography, date_of_birth, date_of_death, art_piece) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [name, country, biography, date_of_birth, date_of_death, art_piece],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error adding artist", error: err });
      }
      return res.status(200).json({
        message: "Artist added successfully",
        artistId: result.insertId,
      });
    }
  );
};
// Function to delete an artist by ID
const deleteArtist = (req, res) => {
  const { id } = req.params;
  console.log("Attempting to delete artist with ID:", id); // Log the ID for debugging

  const query = `DELETE FROM artists WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ message: "Error deleting artist", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.status(200).json({ message: "Artist deleted successfully" });
  });
};

// Fetch all artists
const getArtistsController = (req, res) => {
  const query = "SELECT * FROM artists";

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error fetching artists", error: err });
    }
    return res.status(200).json(results);
  });
};

module.exports = { addArtistController, getArtistsController, deleteArtist };
