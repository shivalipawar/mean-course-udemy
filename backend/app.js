const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post')

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

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS");
  next();
})

console.log("Going towards the http methods now");
//POST
app.post('/api/posts',(req,res,next)=>{
  //const post = req.body;
  console.log("Req is :"+req);
  const post =new Post({          //Here new Post will create object of type Post schema we have declared in post.js
    title : req.body.title,
    content :req.body.content
  });
  console.log("Post is "+ post);
  post.save().then(createdPost => {		  
    res.status(201).json({		  
      message: "Post added successfully",		  
      postId: createdPost._id		  
    });		
  }); 
})


//GET
// app.use('/api/posts',(req,res,next)=>{

//   // const posts =[
//   //   {id:'11',title:"Java",content:"Coffee"},
//   //   {id:'22',title:"Ionic",content:"Cake"},
//   //   {id:'33',title:"Ruby",content:"Gem"},
//   //   {id:'44',title:"Go",content:"Lang"},
//   // ]

//   Post.find().then(doc =>{
//     console.log("Documents is : "+doc);
//     //Should be in then as its a sync call.
//     return res.status(200).json({
//       message:"Posts fetched successfully",
//       posts: doc
//     })
//   });
// })
app.get("/api/posts", (req, res, next) => {		  
  Post.find().then(documents => {		    
    res.status(200).json({		    
      message: "Posts fetched successfully!",		    
      posts: documents		      
    });		      
    })
  });		  


module.exports = app;
