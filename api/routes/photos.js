const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Displaying the photos"
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Posting the photos"
  });
});

router.get("/:photoId", (req, res, next) => {
  res.status(200).json({
    message: "Getting one particular photo"
  });
});

router.delete("/:photoId", (req, res, next) => {
  res.status(200).json({
    message: "Deleting one particular photo"
  });
});

module.exports = router;
