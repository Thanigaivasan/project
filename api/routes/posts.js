const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Posts = require("../models/post");

router.get("/", (req, res, next) => {
  Posts.find()
    .select("notes date")
    .exec()
    .then(docs => {
      const response = {
        //count: docs.length,
        post: docs.map(docs => {
          return {
            notes: docs.notes,
            date: docs.date,
            _id: docs._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/posts/" + docs._id
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

router.post("/", (req, res, next) => {
  const post = new Posts({
    _id: new mongoose.Types.ObjectId(),
    notes: req.body.notes,
    date: req.body.date
  });
  post
    .save()
    .then(result => {
      console.log("Done saving");
      res.status(201).json({
        message: "Created new post",
        newPost: {
          notes: result.notes,
          date: result.date,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/posts/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:postId", (req, res, next) => {
  const id = req.params.postId;
  Posts.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No matching notes found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:postId", (req, res, next) => {
  const id = req.params.postId;
  Posts.update({ _id: id }, { $set: { notes: req.body.notes } })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({ messgae: " Notes updated" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:postId", (req, res, next) => {
  const id = req.params.postId;
  Posts.remove({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Notes deleted" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
