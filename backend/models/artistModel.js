const db = require("../database/db");

// Function to add a new artist
const addArtist = (artistData, callback) => {
  const { name, country, biography, date_of_birth, date_of_death, art_piece } =
    artistData;
  const query = `
    INSERT INTO artists (name, country, biography, date_of_birth, date_of_death, art_piece)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(
    query,
    [name, country, biography, date_of_birth, date_of_death, art_piece],
    (err, results) => {
      if (err) {
        console.error("Error adding artist:", err);
        callback(err);
      } else {
        console.log("Artist added successfully:", results);
        callback(null, results);
      }
    }
  );
};

// Function to get all artists
const getArtists = (callback) => {
  const query = `SELECT * FROM artists;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching artists:", err);
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

// Function to get a single artist by ID
const getArtistById = (id, callback) => {
  const query = `SELECT * FROM artists WHERE id = ?;`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching artist:", err);
      callback(err);
    } else {
      callback(null, results[0]);
    }
  });
};

// Export the functions
module.exports = {
  addArtist,
  getArtists,
  getArtistById,
};
