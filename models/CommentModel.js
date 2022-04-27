const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  commentbody: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;