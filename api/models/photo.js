const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  photo: { type: String, required: true }
});

module.exports = mongoose.model("Photos", photoSchema);
