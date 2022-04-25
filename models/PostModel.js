const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: {
    type: String,
    required: true
  }
}, {timestamps: true})

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;