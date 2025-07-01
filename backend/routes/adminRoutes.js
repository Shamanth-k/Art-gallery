const express = require("express")
const router = express.Router()
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const { addArtistController, getArtistsController } = require("../controllers/artistController")

// All admin routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// POST route to add a new artist
router.post("/add", addArtistController)

// GET route to fetch all artists
router.get("/", getArtistsController)

// Export the router
module.exports = router
