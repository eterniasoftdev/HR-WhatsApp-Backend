const express = require("express");
const router = express.Router();
router.post("/", (req, res) => {
  console.log("Request Body...", req);
  res.status(200).send({
    message: "success",
  });
});

module.exports = router;
