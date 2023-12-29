const ProdCategory = require('../models/prodCategoryModel')
const validateMongoDbId = require('../utils/validateMongoDbId')

const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')



const createCategory = asyncHandler(async(req,res)=>{
    try{
        const newCategory = await ProdCategory.create(req.body)
        res.status(200).json({
            message:"Success",
            "newCategory":newCategory
        })

    }catch(error){
        throw new Error(error.message)
    }
})

const getAllCategories = asyncHandler(async(req,res)=>{
    try{
        const categories = await ProdCategory.find({})

        res.json({
            "categories":categories
        })
    }catch(error){
        throw new Error(error.message)
    }
})


const getACategory = asyncHandler(async(req,res)=>{
    try{
        const {id}= req.params
        validateMongoDbId(id)
        if (id){
            const category = await ProdCategory.findById({_id:id})
            res.json({
                "category":category
            })
        }
    }catch(error){
        throw new Error(error.message)
    }
})


const deleteCategory = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        validateMongoDbId(id)
        if (id){
            const deleteCategory = await ProdCategory.findByIdAndDelete({_id:id})
            res.json({
                "message":"Category deleted successfully"
            })
        }
    }catch(error){
        throw new Error(error.message)
    }
})

const updateCategory= asyncHandler(async(req,res)=>{
    try{
        const {id}= req.params
        validateMongoDbId(id)
        if (id){
            const updateCategory = await ProdCategory.findByIdAndUpdate({_id:id},req.body,{
                new:true
            })
            // console.log("updateCategory",updateCategory)
            res.status(200).json({
                message:"category updated successfully",
                updateCategory:updateCategory
            })
        }
        
    }catch(error){
        throw new Error(error.message)
    }
})






module.exports = {createCategory,getAllCategories,getACategory,updateCategory,deleteCategory}

