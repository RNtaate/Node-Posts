require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const dbConfig = require('./config/database-config');

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

app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.render('home');
})

app.listen(process.env.PORT);