const express = require('express')

const router = express.Router()

    
    const {createProduct,
        getAproduct,
        getAllProduct,
        updateProduct,
        deleteProduct
    }= require('../controller/productCtrl')
const { isAdmin ,authMiddleware} = require('../middleware/authMiddleware')

router.post('/create-product',authMiddleware,isAdmin,createProduct)
router.get('/get-product/:id',authMiddleware,isAdmin,getAproduct)
router.get('/get-all-products',authMiddleware,isAdmin,getAllProduct)
router.put('/update-product/:id',authMiddleware,isAdmin,updateProduct)
router.delete('/delete-product/:id',authMiddleware,isAdmin,authMiddleware,deleteProduct)





module.exports= router

