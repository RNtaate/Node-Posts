const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  postbody: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;