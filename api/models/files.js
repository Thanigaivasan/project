const mongoose = require("mongoose");

const filesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  file: { type: String, required: true }
});

module.exports = mongoose.model("Files", filesSchema);
