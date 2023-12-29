const User= require('../models/userModel')
const Coupon = require('../models/couponModel')
const asyncHandler= require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoDbId')

const createCoupon = asyncHandler(async(req,res)=>{
    try{
        const newCoupon= await Coupon.create(req.body)
        res.json({
            newCoupon
        })
    }catch(error){
            
            throw new Error(error.message)
    }
})


const getAllCoupons = asyncHandler(async(req,res)=>{
    try{
        const coupons = await Coupon.find()
        res.json({
            coupons
        })
    }catch(error){
        throw new Error(error.message)
    }
})

const getACoupon = asyncHandler(async(req,res)=>{
    const {id}= req.params
    try{
        validateMongoDbId(id)
        const coupon = await Coupon.findOne({"_id":req.params.id|| req.body.name})
        res.json(coupon)
    }catch(error){
        throw new Error(error)
    }
})


const deleteCoupon= asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        validateMongoDbId(id)
        const deleteCoupon = await Coupon.findByIdAndDelete({_id:id})
        res.json(deleteCoupon)
    }
    catch(error){
        throw new Error(error.message)
    }
})

const updateCoupon = asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        validateMongoDbId(id)
        const updateCoupon = await Coupon.findByIdAndUpdate({_id:id},req.body,
            {
                new:true
            })
        res.json(updateCoupon)
    }
    catch(error){
        throw new Error(error.message)
    }
})








module.exports = 
{createCoupon,getAllCoupons,getACoupon,deleteCoupon,updateCoupon}


