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
    .select("_id photo")
    .exec()
    .then(docs => {
      const response = {
        photos: docs.map(doc => {
          return {
            _id: doc._id,
            Photo: doc.photo,
            request: {
              type: "GET",
              url: "http://localhost:3000/photos/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post("/", upload.single("photo"), (req, res, next) => {
  console.log(req.file);
  const photo = new Photos({
    _id: new mongoose.Types.ObjectId(),
    photo: req.file.path
  });
  photo
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Photo posted succesfully"
      });
    })
    .catch(err => {
      res.status(404).json({
        error: err
      });
    });
});

router.get("/:photoId", (req, res, next) => {
  const photoId = req.params.photoId;
  Photos.findById(photoId)
    .exec()
    .then(doc => {
      if (doc) {
        const response = {
          _id: doc._id,
          url: "http://localhost:3000/" + doc.photo
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Requested photo not available"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:photoId", (req, res, next) => {
  const photoId = req.params.photoId;
  Photos.remove({ _id: photoId })
    .exec()
    .then(result => {
      res.status(201).json({
        message: "Deleted succesfully"
      });
    })
    .catch(err => {
      res.status(404).json({
        error: err
      });
    });
});

module.exports = router;
