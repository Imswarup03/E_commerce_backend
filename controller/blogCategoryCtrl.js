const BlogCategory = require('../models/blogCategoryModel')

const validateMongoDbId = require('../utils/validateMongoDbId')

const asyncHandler = require('express-async-handler')



const createCategory = asyncHandler(async(req,res)=>{
    try{
        const newCategory = await BlogCategory.create(req.body)
        res.status(200).json({
            message:"Success",
            newCategory:newCategory
        })

    }catch(error){
        throw new Error(error.message)
    }
})


const deleteCategory = asyncHandler(async(req,res)=>{
    try{
        const {id} = req?.params
        if (id){
            validateMongoDbId(IdleDeadline)
            const deleteCategory = await BlogCategory.findByIdAndDelete({_id:id})
            res.status(200).json({
                message:"Category deleted successfully"
            })
        }
    }catch(error){
        throw new Error(error.message)
    }
})


const getACategory = asyncHandler(async(req,res)=>{
    try{
        const{id}=req?.params
        if (id){
            validateMongoDbId(id)
            const category = await BlogCategory.findById({_id:id})
            res.status(200).json({
                category
            })
        }

    }catch(error){
        throw new Error(error.message)
    }
})

const getAllCategory = asyncHandler(async(req,res)=>{
    try{
        
        const category = await BlogCategory.find()
        res.status(200).json({
            category
        })
        }catch(error){
        throw new Error(error.message)
    }
})

const updateCategory = asyncHandler(async(req,res)=>{
    try{
        const {id}= req?.params
        if(id){
            validateMongoDbId(id)
            const updateCategory = await BlogCategory.findByIdAndUpdate(
                {_id:id},
                req.body,
                {new:true}
                )
                res.status(200).json({
                    updateCategory
                    
                })

        }
    }catch(error){
        throw new Error(error.message)
    }
})


module.exports = {createCategory,deleteCategory,getACategory,getAllCategory,updateCategory}