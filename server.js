// server.js
// where your node app starts

// init project
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const path  = require('path');
const ejs = require('ejs');
const route = require('./routes/glitch');

require("dotenv").config();

app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(bodyParser.json());
app.use(morgan());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'));

app.use('/', route);

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
