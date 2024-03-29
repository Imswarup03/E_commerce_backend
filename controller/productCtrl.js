const asyncHandler = require('express-async-handler')

const Product = require('../models/productModel')
const slugify = require('slugify')
const User = require('../models/userModel')
const validateMongoDbId = require('../utils/validateMongoDbId')
const { cloudinaryUploading } = require('../utils/cloudinary')
const fs = require("fs")
const path = require('path')



const createProduct = asyncHandler(async(req,res)=>{
    try{
        if (req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }
    catch(error){
        console.log(error)
        throw new Error(error)
    }
})

const getAproduct = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
        const findProduct = await Product.findById({_id:id})
        res.status(200).json({
            findProduct
        })
    }catch(error){
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async(req,res)=>{
    try{
        // Filtering
        const queryObj = {...req.query};
        const excludeFields= ['page','sort','limit','fields'];
        excludeFields.forEach((el)=>{
            delete queryObj[el];
        })
        // console.log(queryObj,req.query)

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr))
        let query= Product.find(JSON.parse(queryStr)) 
        // console.log(query)
        // const allProduct = await Product.find()

        // Sorting 
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ")
            // const sortingCriteria ={};
            // sortingCriteria[sortBy] = -1
            // console.log("sortingCriteria",sortingCriteria)
            // console.log("sortBy",sortBy)
            query = query.sort(sortBy)
        }else{

            query = query.sort("-createdAt")
        }

        // Field Limiting
        if (req.query.fields){
            const fields = req.query.fields.split(',').join(" ")
            query = query.select(fields)
        }else{
            query = query.select('-__v') // it wil not select __v
        }
        // New feature added
        // Pagination
        const page =  parseInt(req.query.page, 10);
        const limit =  parseInt(req.query.limit,10 )
        const skip = (page-1)*limit
        query = query.skip(skip).limit(limit)
        console.log("page",typeof(page),typeof(limit),typeof(skip))
        // console.log("Query",query)

        
        if (req.query.page){
            const numProducts = await Product.countDocuments();
            console.log("numProducts",numProducts)
            if (skip>=numProducts) throw new Error("This page does not exist")
        }
        
        const allProduct = await query;
        // const allProduct = await Product.where({brand:req.query?.brand}).where({category:req.query?.category}).where({color:req.query?.color})
        res.json(allProduct);
    }
    catch(error){
        throw new Error(error)
    }
})


const updateProduct = asyncHandler(async(req,res)=>{
    const id = req.params.id
    try{
        if (req.body.title){
            req.body.slug=slugify(req.body.title)

        }
        const updateproduct = await Product.findOneAndUpdate({_id:id},
            req.body,
            {new:true}
        )
        if (updateproduct){
            res.status(200).json({
                "message":"product updated successfully"
            })
        }else{
            res.status(404).json({
                "message":"product not found"
            })
        }
        // res.json(updateproduct)
        
    }catch(error){
        throw new Error(error.message)
    }
})


const deleteProduct= asyncHandler(async(req,res)=>{
    const id = req.params.id
    try{
        if(id){
            const deleteProduct = await Product.findByIdAndDelete({_id:id})
            console.log(deleteProduct)
            if (deleteProduct){
                res.status(200).json({
                    "message":"product deleted successfully"
                })
            }else{
                res.status(404).json({
                    "message":"product not found"
                })
            }

        }
    }catch(error){
        throw new Error(error.message) 
}
}
)

const addToWishList = asyncHandler(async(req,res)=>{
    // console.log('req',req.user)
    const {_id}= req?.user;
    const {prodId}= req?.body
    try{
        const user = await User.findById({_id:_id})
        const alreadyAdded = user.wishlist.find((id)=>id.toString()===prodId)
        if (alreadyAdded){
            let user = await User.findByIdAndUpdate(
                {_id:_id},
                {
                $pull:{wishlist:prodId}
                },
                {
                    new:true
                }
            )
            res.json({
                "user":user
            })
        }
        else{
            let user = await User.findByIdAndUpdate(
                {_id:_id},
                {
                $push:{wishlist:prodId}
                },
                {
                    new:true
                }
            )
            res.json({
                "user":user
            })
        }
    }catch(error){
        throw new Error(error)
    }
})

const ratings = asyncHandler(async(req,res)=>{
    try{
        const {_id}=req.user;
        const {star,prodId,comment}=req.body;
        const product = await Product.findById(prodId)
        let alreadyRated = product.ratings.find((userId)=>userId.postedby.toString()===_id.toString())
        if (alreadyRated){
            const updateRating = await Product.updateOne(
            {
                ratings:{ $elemMatch:alreadyRated },
            },
            {
                $set:{"ratings.$.star":star,"ratings.$.comment":comment},
            },
            {new:true}
            )
            res.json({
                updateRating
            })
        }else{
            const rateProduct = await Product.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                        star:star,
                        comment:comment,
                        postedby:_id
                    },
                },
            },
            {new:true})
        }
        const getAllRatings = await Product.findById(prodId);
        let totalRatings = getAllRatings.ratings.length;
        let ratingSum = getAllRatings.ratings
        .map((item)=> item.star)
        .reduce((prev,curr)=>prev+curr,0);
        let actualRating = Math.round(ratingSum/totalRatings);
        let finalProduct = await Product.findByIdAndUpdate(prodId,
            {totalRatings:actualRating},{new:true}
            )
        res.json({ finalProduct });
    }catch(error){
        throw new Error(error.message)
    }
})



const uploadImages = asyncHandler(async(req,res)=>{
    try{
        const {id}= req.params
        validateMongoDbId(id)
        const uploader = (path)=>cloudinaryUploading(path,"images")
        const urls = []
        const files = req.files
        for (const file of files){
            const {path} = file;
            const newPath =  await uploader(path)
            // console.log("console======>",newPath)
            urls.push(newPath)
            console.log("urlsss",urls)
            // fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(id,
            {images:urls.map((file)=>{
                return file;
            })},
            {new: true}
            )
            console.log(findProduct)
            res.json(findProduct)
        
    }catch(error){
        throw new Error(error.message)
    }
})



module.exports = {
    createProduct,
    getAproduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    ratings,
    uploadImages,
    
}
