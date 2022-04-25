const express = require('express');

const router = express.Router();
const PostModel = require('../models/PostModel');

router.get('/', async (req, res) => {
  try{
    let posts = await PostModel.find().sort({createdAt: -1});
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
    let newPost = new PostModel(req.body);
    await newPost.save();
    res.redirect('/');
  }catch(e) {
    console.error(e);
  }
})

router.get("/editPost/:id", async (req, res) => {
  try {
    let post = await PostModel.findById(req.params.id);
    console.log(post);
    res.render('editPost', {post});
  }catch(e) {
    console.error(e)
  }
})

router.post("/editPost", async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(req.query.id, req.body);
    res.redirect("/");
  }catch(e) {
    console.error(e);
  }
})

router.delete("/posts/:id", async (req, res) => {
  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.redirect("/");
  }catch(e) {
    console.error(e);
  }
})

module.exports = router;