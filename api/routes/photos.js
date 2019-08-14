const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Photos = require("../models/photo");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //cb(null,false); to reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Accepts only jpeg/png type"), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  Photos.find()
    .select("photo _id")
    .exec()
    .then(docs => {
      const response = {
        photos: docs.map(doc => {
          return {
            _id: docs._id,
            Photo: docs.Photo,
            request: {
              type: "GET",
              url: "http://localhost:3000/photos/" + docs._id
            }
          };
        })
      };
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post("/", upload.single("photo"), (req, res, next) => {
  console.log(req.file);
  const photo = new Photos({
    _id: mongoose.Types.ObjectId,
    photo: req.file.path
  });
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
