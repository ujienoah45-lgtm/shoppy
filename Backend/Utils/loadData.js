const mongoose = require('mongoose');
const Product = require('../Models/productModel');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const fs = require('fs');

const CON_STR = process.env.CON_STR;

const dummyData = JSON.parse(fs.readFileSync('./dummydata.json'));

mongoose.connect(CON_STR)
  .then(con => console.log('connection successful'))
  .catch(err => console.log(err.message));


const loadData = async () => {
  console.log('up and runing')
  try {
    const savedProducts = await Product.insertMany(dummyData);
    console.log(savedProducts)
  } catch (error) {
    console.log(error.message);
  }
  process.exit(1);
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Products deleted from data base')
  } catch (error) {
    console.log(error.message)
  }
  process.exit(1);
};

if( process.argv[2] === '-load')  loadData();
if( process.argv[2] === '-delete')  deleteData();
