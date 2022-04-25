const express = require("express");

const router = express.Router();

const Comment = require("../models/CommentModel");

router.post("/comments", async (req, res) => {
  try{
    let newComment = new Comment(req.body);
    await newComment.save();
    res.redirect(`/posts/${req.body.post_foreign_id}`);
  }catch(e){
    console.error(e)
  }
})

module.exports = router;