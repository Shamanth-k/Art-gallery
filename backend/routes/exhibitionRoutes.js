const express = require("express")
const router = express.Router()
const exhibitionController = require("../controllers/exhibitionController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

// Public routes
router.get("/", exhibitionController.getExhibitions)
router.get("/:id", exhibitionController.getExhibitionById)

// Admin only routes
router.post("/add", authenticateToken, requireAdmin, exhibitionController.addExhibition)
router.delete("/:id", authenticateToken, requireAdmin, exhibitionController.deleteExhibition)

module.exports = router
