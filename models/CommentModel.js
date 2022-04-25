const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  post_foreign_id: {
    type: String,
    required: true
  },
  commentbody: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;