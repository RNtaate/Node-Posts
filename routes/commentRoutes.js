const express = require("express");

const router = express.Router();

const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

router.post("/comments", async (req, res) => {
  try{
    let commentedOnPost = await Post.findById(req.body.postid);
    if(commentedOnPost) {
      let newComment = new Comment({...req.body, postId: commentedOnPost._id});
      await newComment.save();
      res.redirect(`/posts/${commentedOnPost._id}`);
    }else {
      throw new Error();
    }
  }catch(e){
    console.error(e)
  }
})

module.exports = router;