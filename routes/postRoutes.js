const express = require('express');
const mongoose = require("mongoose");

const router = express.Router();
const Post = require('../models/PostModel');
const Comment = require("../models/CommentModel");
const User = require('../models/UserModel');
const multerUpload = require('../config/multer-config');

router.get('/', async (req, res) => {
  try{
    let posts = await Post.find().sort({createdAt: -1});

    let userids = [];
    for(let post of posts){
      if (!(userids.includes(post.userId))){
        userids.push(post.userId);
      }
    }

    let postUsers = await User.find({ _id: { $in: userids } });
    let usersWithPosts = {};

    for(let everyUser of postUsers) {
      usersWithPosts[`${everyUser._id}`] = everyUser;
    }

    res.render('home', {posts, user: req.user, usersWithPosts});
  }catch(e) {
    console.error("Something is wrong", e);
  }
})

router.get("/home", (req, res) => {
  res.redirect("/");
})

router.post('/posts', (req, res) => {
  multerUpload(req, res,  async (err) => {
    if(err){
      console.log(err)
      req.flash('error', err);
      res.redirect('/');
    }else{
      try{
        postObj = {...req.body, userId: req.user._id, postimage: req.file ? req.file.filename : ""}
        console.log(postObj);
        let newPost = new Post(postObj);
        await newPost.save();
        res.redirect('/');
      }catch(e) {
        console.error(e);
      }
    }
  })

})

router.get("/editPost/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if(post.userId != req.user.id) {
      throw new Error();
    }
    
    console.log(post);
    res.render('editPost', {post, user: req.user});
  }catch(e) {
    console.error("Something terrible happened here ", e);
    req.flash("error", "You are NOT authorized to edit this post")
    res.redirect("/");
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
      let userids = [singlePost[0].userId];
      singlePost[0].comments.forEach( comm => {
        if(!(userids.includes(comm.userId))){
          userids.push(comm.userId);
        }
      })

      let commUsers = await User.find({ _id: {$in: userids} });
      let commentsUsers = {};
      commUsers.forEach( user => {
        commentsUsers[`${user._id}`] = user;
      })

      singlePost[0].comments = singlePost[0].comments.reverse();
      res.render("showPost", {post: singlePost[0], user: req.user, commentsUsers});
    }else {
      throw new Error();
    }
  }catch(e) {
    console.error(e);
  }
})

router.delete("/posts/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if(post.userId != req.user.id) {
      throw new Error();
    }

    await Comment.deleteMany({postId: req.params.id})
    await Post.findByIdAndDelete(req.params.id);
    req.flash("success", "Post deleted successfully!")
    res.redirect("/");
  }catch(e) {
    console.error(e);
    req.flash("error", "You CANNOT delete that post");
    res.redirect('/');
  }
})

module.exports = router;