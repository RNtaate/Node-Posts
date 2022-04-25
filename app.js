const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.sendFile("./views/home.html", {root: __dirname});
})

app.listen(3000);