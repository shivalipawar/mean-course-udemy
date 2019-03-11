const express = require('express');

const app = express();    //This is executing express() and return as app
//Express app is a chain of middleware which we apply to incoming requests

app.use('/api/posts',(req,res,next)=>{
  const posts =[
    {id:'11',title:"Java",content:"Coffee"},
    {id:'22',title:"Ionic",content:"Cake"},
    {id:'33',title:"Ruby",content:"Gem"},
    {id:'44',title:"Go",content:"Lang"},
  ]
  res.status(200).json({
    message:"Posts fetched successfully",
    posts: posts
  })
})

module.exports = app;
