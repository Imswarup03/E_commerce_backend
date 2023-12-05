const User = require('../models/userModel')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const {generateJwtToken} = require('../config/jwtToken')

// Create User
const createUser= asyncHandler(async(req,res)=>{
    const email= req.body.email;
    const findUser= await User.findOne({"email":email})

    if (!findUser){
        // create a new user
        const newUser= User.create(req.body)
        res.status(201).json({
            message:"User created successfully",
            success: true
        })
    }
    else{
        // console.log(findUser)
        throw new Error('Email id already exists. Use a different email address to signup')
    }
});


//login User
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}= req.body;
    // check if user exists or not 

    const findUser = await User.findOne({"email":email});
    if (findUser && (await findUser.isPasswordMatched(password))){
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateJwtToken(findUser?._id)
        })
    }else{
        throw new Error("Invalid Credentials")
    }
})


// Get all Users
const getAllUsers = asyncHandler(async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json({
            users
        })

    }
    catch(error){
        throw new Error(error.message)
    }
})

// Get a single User

const getUser = asyncHandler(async(req,res)=>{
    // console.log("req",req)
    const {id } = req.params
    // console.log(id)
    try{
    const user = await User.findById({"_id":id})
    res.status(200).json({user})
}
catch(error){
    throw new Error(error.message)
}
})

const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.params
    if (id){
        const user = await User.findByIdAndDelete({"_id":id})
        res.status(200).json({
            message:"User deleted successfully",
            success: true
        })
    }
    
})

// Update a User 

const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
        const user = await User.findByIdAndUpdate({"_id":id},
        {firstname:req?.body?.firstname,
        lastname:req?.body?.lastname,
        mobile:req?.body?.mobile,
        email:req?.body?.email
    },
    {
        new:true
    }
    )
        res.status(200).json({
            message:"User updated successfully",
        })
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
})


module.exports = { 
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser
 }