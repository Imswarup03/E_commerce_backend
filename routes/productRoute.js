const express = require('express')

const router = express.Router()

const {uploadPhoto, productImgResize} = require('../middleware/uploadImages')
    
const {createProduct,
    getAproduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    ratings,
    uploadImages
    }= require('../controller/productCtrl')
const { isAdmin ,authMiddleware} = require('../middleware/authMiddleware')
router.post('/create-product',authMiddleware,isAdmin,createProduct)
router.get('/get-product/:id',authMiddleware,isAdmin,getAproduct)
router.get('/get-all-products',authMiddleware,isAdmin,getAllProduct)
router.put('/update-product/:id',authMiddleware,isAdmin,updateProduct)
router.delete('/delete-product/:id',authMiddleware,isAdmin,authMiddleware,deleteProduct)

router.put('/wishlist',authMiddleware,addToWishList)

router.put('/ratings',authMiddleware,ratings)

router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)


module.exports= router

