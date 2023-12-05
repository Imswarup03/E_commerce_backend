// we will verify the JWT token 
// check user is Admin or not 

const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')





const authMiddleware = asyncHandler(async(req,res,next)=>{
    let token

    if (req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        try{
            if (token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
                // console.log(decoded)
                const user = await User.findById(decoded?.id); // get the user
                req.user = user; // set the user
                next(); //move to next step
            }
        }
        catch(error){
            throw new Error("There is no token present in the header")
        }
        
    }
    else{
        throw new Error("There is no token present in the header")
    }
})

const isAdmin = asyncHandler(async(req,res,next)=>{
    if (req.user.role === 'admin'){
        next();
    }
    else{
        throw new Error("You are not authorized to access this route")
    }
})


module.exports = {authMiddleware,isAdmin}