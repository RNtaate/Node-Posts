const express = require('express');
const mongoose = require("mongoose");

const router = express.Router();
const Post = require('../models/PostModel');
const Comment = require("../models/CommentModel");

router.get('/', async (req, res) => {
  try{
    let posts = await Post.find().sort({createdAt: -1});
    console.log(req.user);
    res.render('home', {posts, user: req.user});
  }catch(e) {
    console.error("Something is wrong", e);
  }
})

router.get("/home", (req, res) => {
  res.redirect("/");
})

router.post('/posts', async(req, res) => {
  try{
    let newPost = new Post(req.body);
    await newPost.save();
    res.redirect('/');
  }catch(e) {
    console.error(e);
  }
})

router.get("/editPost/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    console.log(post);
    res.render('editPost', {post});
  }catch(e) {
    console.error(e)
  }
})

router.post("/editPost", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.query.id, req.body);
    res.redirect("/");
  }catch(e) {
    console.error(e);
  }
})

router.get("/posts/:id", async (req, res) => {
  try {
    let singlePost = await Post.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments"
        }
      }
    ])
    if(singlePost.length > 0) {
      singlePost[0].comments = singlePost[0].comments.reverse();
      res.render("showPost", {post: singlePost[0], user: req.user});
    }else {
      throw new Error();
    }
  }catch(e) {
    console.error(e);
  }
})

router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  }catch(e) {
    console.error(e);
  }
})

module.exports = router;