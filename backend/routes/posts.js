const express = require("express");
const Post = require('../models/post')
const router = express.Router();

//POST
router.post('',(req,res,next)=>{
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
  router.get("", (req, res, next) => {		  
    Post.find().then(documents => {		    
      res.status(200).json({		    
        message: "Posts fetched successfully!",		    
        posts: documents		      
      });		      
      })
    });		  
  
    router.get("/:id", (req,res,next) =>{
      Post.findById(req.params.id).then(post =>{
        if(post){
          res.status(200).json(post);
        }
        else{
          res.status(404).json({message:"Post not found!"});
        }
      })
    })
  
    router.delete("/:id", (req,res,next) =>{
      Post.deleteOne({_id: req.params.id}).then(result =>{
        console.log(result);
        res.status(200).json({message:"Post deleted"});
      })
    })
    
    router.put("/:id",(req,res,next)=>{
      const post = new Post({
        _id : req.body.id,
        title : req.body.title,
        content : req.body.content
      })
      Post.updateOne({_id: req.params.id},post).then(result => {
        console.log(result);
        res.status(200).json({message:"Update Successful!"});
      })
    })

    module.exports = router;