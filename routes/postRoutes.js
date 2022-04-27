const express = require('express');

const router = express.Router();
const Post = require('../models/PostModel');
const Comment = require("../models/CommentModel");

router.get('/', async (req, res) => {
  try{
    let posts = await Post.find().sort({createdAt: -1});
    res.render('home', {posts});
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
    let singlePost = await Post.findById(req.params.id).populate('Comment');
    // let comments = await Comment.find({post_foreign_id: req.params.id}).sort({createdAt: -1});
    // res.render("showPost", {post: singlePost, comments});
    console.log(singlePost);
    res.redirect("/");
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