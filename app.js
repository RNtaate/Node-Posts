require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodoverride = require('method-override');
const mongoose = require('mongoose');
const expressLayout = require("express-layout");

const dbConfig = require('./config/database-config');
const PostModel = require('./models/PostModel');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

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
app.set("layouts", path.join(__dirname, "/views/layouts"));

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(methodoverride('_method'));
app.use(expressLayout());


app.use("/", postRoutes);
app.use("/", commentRoutes);

app.use((req, res) => {
  res.status(404).render("404");
})

app.listen(process.env.PORT);