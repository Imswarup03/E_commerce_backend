const Brand = require('../models/brandModel')
const validateMongoDbId = require('../utils/validateMongoDbId')

const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')



const createBrand = asyncHandler(async(req,res)=>{
    try{
        const newBrand = await Brand.create(req.body)
        res.status(200).json({
            message:"Success",
            "newBrand":newBrand
        })

    }catch(error){
        throw new Error(error.message)
    }
})

const getAllBrand = asyncHandler(async(req,res)=>{
    try{
        const brand = await Brand.find()
        // console.log('Brand',brand)
        res.json({
            "Brands":brand
        })
    }catch(error){
        throw new Error(error.message)
    }
})


const getABrand = asyncHandler(async(req,res)=>{
    try{
        const {id}= req.params
        validateMongoDbId(id)
        if (id){
            const brand = await Brand.findById({_id:id})
            res.json({
                "Brand":brand
            })
        }
    }catch(error){
        throw new Error(error.message)
    }
})


const deleteBrand = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        validateMongoDbId(id)
        if (id){
            const deleteBrand = await Brand.findByIdAndDelete({_id:id})
            res.json({
                "message":"Brand deleted successfully"
            })
        }
    }catch(error){
        throw new Error(error.message)
    }
})

const updateBrand= asyncHandler(async(req,res)=>{
    try{
        const {id}= req.params
        validateMongoDbId(id)
        if (id){
            const updateBrand = await Brand.findByIdAndUpdate({_id:id},req.body,{
                new:true
            })
            // console.log("updateBrand",updateBrand)
            res.status(200).json({
                message:"Brand updated successfully",
                updateBrand:updateBrand
            })
        }
        
    }catch(error){
        throw new Error(error.message)
    }
})






module.exports = {createBrand,getAllBrand,getABrand,updateBrand,deleteBrand}

