// const express = require("express");
// const multer = require("multer");
// const Post = require('../models/post')
// const router = express.Router();

// const MIME_TYPE_MAP = {
//   'image/png':'png',
//   'image/jpeg':'jpg',
//   'image/jpg':'jpg',

// }

// const storage = multer.diskStorage({
//   destination : (req,file,cb) =>{
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if(isValid){
//       error=null;
//     }
//     cb(error, "backend/images");
//   },
//   filename : (req, file, cb) =>{
//     const name = file.originalname.toLowerCase().split(' ').join('-');
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name +'-'+Date.now()+'.'+ext);
//   }
// });

// //POST
// router.post('', multer({storage:storage}).single("image"), (req,res,next)=>{
//     //const post = req.body;
//     const url = req.protocol+ "://"+req.get("host");
//     console.log("Req is :"+req);
//     const post =new Post({          //Here new Post will create object of type Post schema we have declared in post.js
//       title : req.body.title,
//       content :req.body.content,
//       imagePath : url
//     });
//     console.log("Post is "+ post);
//     post.save().then(createdPost => {		  
//       res.status(201).json({		  
//         message: "Post added successfully",		  
//         postId: {
//           ...createdPost,                 //Create a copy of posts and edits id on it.
//           id : createdPost._id,
//         }		  
//       });		
//     }); 
//   })
  
  
//   //GET
//   // app.use('/api/posts',(req,res,next)=>{
  
//   //   // const posts =[
//   //   //   {id:'11',title:"Java",content:"Coffee"},
//   //   //   {id:'22',title:"Ionic",content:"Cake"},
//   //   //   {id:'33',title:"Ruby",content:"Gem"},
//   //   //   {id:'44',title:"Go",content:"Lang"},
//   //   // ]
  
//   //   Post.find().then(doc =>{
//   //     console.log("Documents is : "+doc);
//   //     //Should be in then as its a sync call.
//   //     return res.status(200).json({
//   //       message:"Posts fetched successfully",
//   //       posts: doc
//   //     })
//   //   });
//   // })
//   router.get("", (req, res, next) => {	
//     const pageSize = +req.query.pageSize; //Makes string as numeric
//     const currentPage = +req.query.page;
//     const postQuery = Post.find();

//     if(pageSize && currentPage){
//       postQuery.skip(pageSize * (currentPage - 1))
//       .limit(pageSize)
//     }

//     Post.find().then(documents => {		    
//       res.status(200).json({		    
//         message: "Posts fetched successfully!",		    
//         posts: documents		      
//       });		      
//       })
//     });		  
  
//     router.get("/:id", (req,res,next) =>{
//       Post.findById(req.params.id).then(post =>{
//         if(post){
//           res.status(200).json(post);
//         }
//         else{
//           res.status(404).json({message:"Post not found!"});
//         }
//       })
//     })
  
//     router.delete("/:id", (req,res,next) =>{
//       Post.deleteOne({_id: req.params.id}).then(result =>{
//         console.log(result);
//         res.status(200).json({message:"Post deleted"});
//       })
//     })
    
//     router.put("/:id",multer({storage:storage}).single("image"),(req,res,next)=>{
//       console.log(req.file);
//       let imagePath = req.body.imagePath;
//       if(req.file){
//         const url = req.protocol+ "://"+req.get("host");
//         imagePath = url + "/images/" + req.file.filename;
//       }
//       const post = new Post({
//         _id : req.body.id,
//         title : req.body.title,
//         content : req.body.content,
//         imagePath :imagePath
//       })
//       console.log(post);
//       Post.updateOne({_id: req.params.id},post).then(result => {
//         console.log(result);
//         res.status(200).json({message:"Update Successful!"});
//       })
//     })

//     module.exports = router;


const express = require("express");
const multer = require("multer");
const Post = require('../models/post')
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg',

}

const storage = multer.diskStorage({
  destination : (req,file,cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error=null;
    }
    cb(error, "backend/images");
  },
  filename : (req, file, cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name +'-'+Date.now()+'.'+ext);
  }
});

//POST
router.post('', multer({storage:storage}).single("image"), (req,res,next)=>{
    //const post = req.body;
    const url = req.protocol+ "://"+req.get("host");
    console.log("Req is :"+req);
    const post =new Post({          //Here new Post will create object of type Post schema we have declared in post.js
      title : req.body.title,
      content :req.body.content,
      imagePath : url + "/images/" + req.file.filename
    });
    console.log("Post is "+ post);
    post.save().then(createdPost => {		  
      res.status(201).json({		  
        message: "Post added successfully",		  
        postId: {
          ...createdPost,                 //Create a copy of posts and edits id on it.
          id : createdPost._id,
        }		  
      });		
    }); 
  })
  

    
    router.put("/:id",multer({storage:storage}).single("image"),(req,res,next)=>{
      console.log(req.file);
      let imagePath = req.body.imagePath;
      if(req.file){
        const url = req.protocol+ "://"+req.get("host");
        imagePath = url + "/images/" + req.file.filename;
      }
      const post = new Post({
        _id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        imagePath :imagePath
      })
      console.log(post);
      Post.updateOne({_id: req.params.id},post).then(result => {
        console.log(result);
        res.status(200).json({message:"Update Successful!"});
      })
    })


  router.get("", (req, res, next) => {	
    const pageSize = +req.query.pageSize; //Makes string as numeric
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
      postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize)
    }
 postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
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

    module.exports = router;