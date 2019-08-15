const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  notes: String,
  date: Date,
  photoUrl: String
});

module.exports = mongoose.model("Posts", postSchema);
