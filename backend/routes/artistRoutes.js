const express = require("express")
const router = express.Router()
const artistController = require("../controllers/artistController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

// Public routes
router.get("/", artistController.getArtistsController)

// Protected routes (admin only)
router.post("/add", authenticateToken, requireAdmin, artistController.addArtistController)
router.delete("/:id", authenticateToken, requireAdmin, artistController.deleteArtist)

module.exports = router
