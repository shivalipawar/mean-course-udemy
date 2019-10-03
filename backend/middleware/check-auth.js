const jwt = require("jsonwebtoken");
//Middleware is nothing but a function we want to execute for a incoming request
module.exports = (req,res,next) =>{
    const token = req.query.authentication.split(" ");
}