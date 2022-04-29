require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodoverride = require('method-override');
const mongoose = require('mongoose');
const expressLayout = require("express-layout");
const flash = require('express-flash');
const session = require('express-session');

const dbConfig = require('./config/database-config');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

mongoose.connect(dbConfig.database)
.then(() => console.log('You have successfully connected to mongoDB'))
.catch( err => console.error("CONNECTION FAILED: ", err));

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set("layouts", path.join(__dirname, "/views/layouts"));

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(methodoverride('_method'));
app.use(expressLayout());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use("/", authRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);

app.use((req, res) => {
  res.status(404).render("404");
})

app.listen(process.env.PORT);