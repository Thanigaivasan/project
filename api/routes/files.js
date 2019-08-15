const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");

const Files = require("../models/files");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./files/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.path.extension(file.originalname) === "/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf files allowed"));
  }
};

const upload = multer({
  storage: storage
  //fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  Files.find()
    .exec()
    .then(doc => {
      const response = {
        Files: doc.map(docs => {
          return {
            _id: docs._id,
            File: docs.file,
            request: {
              _id: docs._id,
              url: "http://localhost:3000/" + docs.file
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:fileId", (req, res, next) => {
  const id = req.params.fileId;
  Files.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        const response = {
          _id: doc._id,
          url: "http://localhost:3000/" + doc.file
        };
        res.status(201).json(response);
      } else {
        res.status(400).json({
          message: "File not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single("file"), (req, res, next) => {
  console.log(req.file);
  const File = new Files({
    _id: new mongoose.Types.ObjectId(),
    file: req.file.path
  });
  File.save()
    .then(result => {
      res.status(200).json({
        message: "File uploaded"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:fileId", (req, res, next) => {
  const id = req.params.fileId;
  Files.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(201).json({
        message: "File deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
