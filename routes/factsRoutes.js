const express = require("express");
const factsController = require("../controllers/factsController");

const router = express.Router();

// Facts routes
router.post("/", factsController.createFact); // Create new fact
router.get("/", factsController.getAllFacts); // Get all facts
router.put("/deactivate/:id", factsController.deactivateFact); // Deactivate fact
router.put("/activate/:id", factsController.activateFact); // Activate fact
router.patch("/positions", factsController.updateMultipleFacts);
router.put("/:id", factsController.updateFactById);
module.exports = router;
