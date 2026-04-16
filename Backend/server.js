const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const mongoose = require('mongoose');
const app = require('./app');

const CON_STR = process.env.CON_STR;

mongoose.connect(CON_STR)
  .then(con => console.log('MongoDB connection successful'))
  .catch(err => console.log(err.message, "this is the connection error"));


app.listen(8080, 
  () => console.log('Server started on http://127.0.0.1:8080')
);