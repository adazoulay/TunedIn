const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  contentUrl: {
    type: String,
    default: "",
  },
  contentType: {
    type: String,
    defualt: "",
  },
  fileName: {
    type: String,
    default: "",
  },
  metadata: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Content", ContentSchema);
