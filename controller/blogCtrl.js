
const Blog = require('../models/blogModel')
const validateMongoDbId = require('../utils/validateMongoDbId')

const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const {cloudinaryUploading}= require('../utils/cloudinary')


const createBlog = asyncHandler(async(req,res)=>{
    try{
        const newBlog = await Blog.create(req.body)
        res.status(200).json({
            message:"Success"
        })
    }catch(err){
        throw new Error(err)
    }
})


const deleteBlog = asyncHandler(async(req,res)=>{
    try{
        const {id}= req.params
        validateMongoDbId(id)
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.status(201).json({
            message:"Blog deleted successfully"
        })
}catch(err){
    throw new Error(err.message)
}
})

const updateBlog = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        validateMongoDbId(id)
        const updateBlog = await Blog.findByIdAndUpdate(
            {_id:id},
            req.body,
            {new:true})
        res.status(201).json(updateBlog)
    }catch(err){
        throw new Error(err.message)
    }
})

const getBlog= asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        validateMongoDbId(id)
        const blog = await Blog.findById(id).populate('likes').populate('disLikes')
        const updateViews= await Blog.findByIdAndUpdate(
            {_id:id},
            {
                $inc:{numViews:1}
            },
            {new:true}
            )
        res.status(201).json(blog)
    }catch(err){
        throw new Error(err.message)
    }
})

const getAllBlogs = asyncHandler(async(req,res)=>{
    try{
        const blog = await Blog.find()
        res.status(201).json(blog)
    }catch(err){
        throw new Error(err.message)
    }
})

const likeTheBlog = asyncHandler(async(req,res)=>{
    try{
        const {blogId} = req.body
        validateMongoDbId(blogId)
        // find the blog which you want to be liked
        const blog = await Blog.findById(blogId)
        // find the user that is liking the blog
        const loginUserId = req?.user?.id
        // find if the user has liked the blog
        const isLiked= blog?.isLiked
        console.log("isLiked",isLiked)
        // find if the user has already disliked the blog 
        const alreadyDisliked = blog?.disLikes.find((userId)=>
            userId?.toString()===loginUserId?.toString()
        )
        if (alreadyDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{disLikes:loginUserId}, // FROM DISLIKES I NEED TO PULL LOGIN USER ID
                isDisliked:false
            },
            {new:true}
            )
        res.json(blog)
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{likes:loginUserId},
                isLiked:false
            },
            {new:true}
            )
        res.json(blog)
        }
        else{

            const blog = await Blog.findByIdAndUpdate(blogId,{
                $push:{likes:loginUserId},
                isLiked:true
            },
            {new:true}
            )
            res.json(blog)
        }

    }catch(err){
    throw new Error(err.message)
}
})

const disLikeTheBlog = asyncHandler(async(req,res)=>{
    try{
        const {blogId}= req.body
        validateMongoDbId(blogId)
        const blog = await Blog.findById(blogId)
        const loginUserId = req?.user?.id
        const isDisliked = blog?.isDisliked
        const alreadyLiked = blog?.likes.find((userId)=>userId?.toString()===loginUserId.toString())

        if (alreadyLiked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{likes:loginUserId},
                isLiked:false
            },{new:true})
        }

        if (isDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{disLikes:loginUserId},
                isDisliked:false
            },{new:true})
        }
        else{
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $push:{disLikes:loginUserId},
                isDisliked:true
            },{new:true})
        }
        res.json(blog)
    }catch(error){
        throw new Error(error.message)
    }
})



const uploadImages = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const uploader= (path)=> cloudinaryUploading(path,'images');
        const urls =[];
        const files = req.files;
        for (const file of files){
            const {path}=file;
            const newPath= await uploader(path);
            urls.push(newPath);
            console.log(urls)
            // fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(id,
            {images:urls.map((file)=>{
                return file;
            })},
            {new: true}
            )
            res.json(findBlog)
    }catch(error){
        throw new Error(error)
    }
})


module.exports = {
    createBlog,
    deleteBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    likeTheBlog,
    disLikeTheBlog,
    uploadImages
}