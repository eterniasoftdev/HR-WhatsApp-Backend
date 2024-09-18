const express = require("express");
const factTypeController = require("../controllers/factTypeController");

const router = express.Router();

// Fact Type routes
router.post("/", factTypeController.createFactType);
router.get("/", factTypeController.getAllFactTypes); // Get all fact types
router.put("/deactivate/:id", factTypeController.deactivateFactType);
router.put("/activate/:id", factTypeController.activateFactType);
router.put("/:id", factTypeController.updateFactTypeById);

module.exports = router;
