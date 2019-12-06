const express = require("express");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users")
const router = express.Router();

router.post('/signup',(req,res,next)=>{
    bycrypt.hash(req.body.password,10)
    .then(hash =>{
        const user = new User({
            email : req.body.email,
            password :hash
        });

        user.save()
        .then( result =>{
            res.status(201).json({
                message : 'User Created',
                result : result
            })
            console.log("new user is "+ JSON.stringify(result));
        })
        .catch(err =>{
            res.status(500).json({
                error:err
            })
        })
    })
});

router.post("/login",(req,res, err) =>{
    let fetchedUser;
    User.findOne({email : req.body.email}).then( user =>{
        if(!user){
            res.status(401).json({
                message : "Auth Failed"
            })
        }
        fetchedUser = user;
        console.log("user found is "+fetchedUser);
        console.log("equal or not "+(req.body.password === user.password)+" "+req.body.password+" "+user.password);
        return bycrypt.compare(req,body.password, user.password)
    })
    .then(result =>{
        console.log("res"+result);
        if(!result){
            console.log("User not found "+result)
            res.status(401).json({
                message : "Auth Failed"
            })
        }
        const token = jwt.sign(
            {email : fetchedUser.email,
            userId :fetchedUser._id},
            "secret_to_be_longer",
            {expiresIn : "1h" }
            )

            console.log("token "+token);
        res.status(200).json({
            token:token,
            expiresIn : 3600
        })
    })
    .catch(err =>{
        console.log("Err "+JSON.stringify(err))
        return res.status(401).json({
            message : "Auth Failed"
        })
    })
})


module.exports = router;
