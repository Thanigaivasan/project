const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  notes: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("Posts", postSchema);
