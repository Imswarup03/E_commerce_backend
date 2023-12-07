const User = require('../models/userModel')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const {generateJwtToken} = require('../config/jwtToken')

const validateMongoDbId = require('../utils/validateMongoDbId')
const { generateRefreshToken } = require('../config/refreshToken')
const jwt = require('jsonwebtoken')

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
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser= await User.findByIdAndUpdate(findUser?._id,{refreshToken:refreshToken},{new:true})
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateJwtToken(findUser?._id),

        })
    }else{
        throw new Error("Invalid Credentials")
    }
})

// handle refresh token

const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies
    console.log(cookie)

    if (!cookie?.refreshToken) throw new Error('No refresh token in cookie')

    const refreshToken = cookie.refreshToken

    const user = await User.findOne({refreshToken:refreshToken})

    if (!user) throw new Error('No refresh token present in db or user not found')
    // console.log("jwt",jwt)
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if (err || user.id !== decoded.id){
            throw new Error('There is something wrong with refresh token')
        }
        else{
            const accessToken = generateJwtToken(user?._id)
            res.json({accessToken})
        }
    })
})


// Logout of User

const logOut = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken:refreshToken})
    
    if (!user){
        res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken:refreshToken},{
        refreshToken:""
    })
    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204);

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
    const {id } = req.user
    validateMongoDbId(id)
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
    const {id} = req.user
    validateMongoDbId(id)
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
    const {id} = req.user
    validateMongoDbId(id)
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


const unBlockUser= asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    
    try{
        const block = await User.findByIdAndUpdate({"_id":id},
        {
            isBlocked:false
        },
        {
            new:true
        }
        );
    
        res.status(200).json({
            "message":"User unblocked successfully"
        })

    }
    catch(error){
        throw new Error(error.message)
    }

})

const blockUser = asyncHandler(async(req,res)=>{
    const { id } =req.params
    validateMongoDbId(id)
    // console.log({"User":req.params})
    try{
        const block = await User.findByIdAndUpdate({"_id":id},
        {
            isBlocked:true
        },
        {
            new:true
        }
        );
        res.status(200).json({
            "message":"User blocked successfully"
        })

    }
    catch(error){
        throw new Error(error.message)
    }
})


module.exports = { 
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    unBlockUser,
    blockUser,
    handleRefreshToken,
    logOut
 }