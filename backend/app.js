const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();    //This is executing express() and return as app
//Express app is a chain of middleware which we apply to incoming requests

mongoose.connect("mongodb+srv://shivali:lQF9ciO6oEVQq9tK@cluster0-z0r7w.mongodb.net/node-angular?retryWrites=true",{ useNewUrlParser: true })
.then(()=>{
  console.log("Connection successful to database");
})
.catch(()=>{
  console.log("Connection failed!")
})

app.use(bodyParser.json());         //return middleware to parse json data.
app.use(bodyParser.urlencoded({extended:false}))    //return middleware to parse urlencoded data.
app.use("/images", express.static(path.join("backend/images")));  //we can have express.static for static middleware but wont work as images is under backend.

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
})
app.use(cors());

app.use("/api/posts",postRoutes);    //To make express aware of the routes and redirect only when api/posts
app.use("/api/user",userRoutes);    //To make express aware of the routes and redirect only when api/posts

console.log("Going towards the http methods now");


module.exports = app;
