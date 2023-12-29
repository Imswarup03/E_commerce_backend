const User = require('../models/userModel')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const {generateJwtToken} = require('../config/jwtToken')

const validateMongoDbId = require('../utils/validateMongoDbId')
const { generateRefreshToken } = require('../config/refreshToken')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const {sendEmail} = require('./emailCtrl')

// Create User
const createUser= asyncHandler(async(req,res)=>{
    const email= req.body.email;
    const password= req.body.password;
    const confirmPassword= req.body.confirmPassword
    if (password!==confirmPassword){
        throw new Error('Passwords do not match')
    }
    const findUser= await User.findOne({"email":email})
    
    if (!findUser){
        // create a new user
        const newUser= await User.create(req.body)
        res.status(201).json({
            message:"User created successfully",
            success: true
        })}
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
            token:generateJwtToken(findUser?._id)

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
        email:req?.body?.email,
        
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
            message:"User blocked successfully"
        })

    }
    catch(error){
        throw new Error(error.message)
    }
})

const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {password}= req.body;

    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if (password){
        user.password = password
        console.log("User",user)
        const updatePassword = await user.save()
        if (updatePassword){
            res.json({
                message:updatePassword,
            })
        }
        }else{
            res.json({
                message:"Please provide password",
            })
        }
}
)

const forgotPasswordToken= asyncHandler(async(req,res)=>{
     const {email} = req.body;
     const user = await User.findOne({email:email}).select('-password')
     if(!user){
        throw new Error("User not found with this email")
     }else{
        try{
            const userName = user.firstname;
            const token = await user.createPasswordResetToken()
            console.log("token",token)
            await user.save()
            const resetUrl= `Hi${userName}, Please follow this link to reset your password, This link is valid for 30 minutes from now. <a href="http://localhost:4000/api/user/reset-password/${token}">Click Here</a>`
            const data = {
                to : email,
                text:"Reset your password",
                subject : "Forgot password link",
                html: resetUrl
            }
            await sendEmail(data)
            res.status(200).json({
                message: "Email has been sent to your email address",
                token:token
            })

            }catch(error){
                // throw new Error(error)
                res.status(500).json({
                    "message":error.message||"Something went wrong"
                })
                
        }
     }
})

const resetPassword = asyncHandler(async(req,res)=>{
    const {password,confirmPassword} =req.body
    if (password !== confirmPassword){
        console.log("===========================")
        throw new Error("Password does not match")
    }
    const {token} = req.params
    
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    console.log("hashedToken====",hashedToken)
    const user = await User.findOne({passwordResetToken:hashedToken,
    passwordResetExpires:{$gt:Date.now()}})
    if (!user){
        throw new Error("Token is invalid or has expired.Please try again")
    }
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json({
        user
    })
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
    logOut,
    updatePassword,
    forgotPasswordToken,
    resetPassword
 }


 