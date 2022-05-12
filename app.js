require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodoverride = require('method-override');
const mongoose = require('mongoose');
const expressLayout = require("express-layout");
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const connectEnsureLoggedIn = require('connect-ensure-login');

const dbConfig = require('./config/database-config');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/UserModel');

const app = express();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('You have successfully connected to the mongoDB');
})
.catch((err) => {
  console.log('CONNECTION TO MONGODB FAILED:', err);
})

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
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", authRoutes);
app.use("/", connectEnsureLoggedIn.ensureLoggedIn("/login"), postRoutes);
app.use("/", connectEnsureLoggedIn.ensureLoggedIn("/login"), commentRoutes);

app.use((req, res) => {
  res.status(404).render("404");
})

app.listen(process.env.PORT, () => {
  console.log("Now listening on port 3000");
});