const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Displaying all the files"
  });
});

router.get("/:fileId", (req, res, next) => {
  const id = req.params.fileId;
  res.status(200).json({
    message: `Displaying the ${id} file`
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    messsage: "Posted a new file"
  });
});

router.delete("/:fileId", (req, res, next) => {
  const id = req.params.fileId;
  res.status(200).json({
    message: `Deleted the ${id} File`
  });
});

module.exports = router;
