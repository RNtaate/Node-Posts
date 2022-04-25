const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.render('home');
})

app.listen(3000);