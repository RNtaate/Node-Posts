require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const dbConfig = require('./config/database-config');
const PostModel = require('./models/PostModel');

const app = express();

mongoose.connect(dbConfig.database);

const db = mongoose.connection;

db.once('open', () => {
  console.log("You have connected to mongoDB");
})

db.on('error', (err) => {
  console.log("Connection Error: ", err);
})

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'));


app.get('/', async (req, res) => {
  try{
    let posts = await PostModel.find().sort({createdAt: -1});
    res.render('home', {posts});
  }catch(e) {
    console.error("Something is wrong", e);
  }
})

app.get("/home", (req, res) => {
  res.redirect("/");
})

app.post('/posts', async(req, res) => {
  try{
    let newPost = new PostModel(req.body);
    await newPost.save();
    res.redirect('/');
  }catch(e) {
    console.error(e);
  }
})

app.use((req, res) => {
  res.status(404).render("404");
})

app.listen(process.env.PORT);