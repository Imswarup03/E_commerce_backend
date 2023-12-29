const express = require('express')
const router = express.Router()

const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')


const {createCategory,getAllCategories,getACategory,deleteCategory,updateCategory}= require('../controller/prodCategoryCtrl')


router.post('/create-category',authMiddleware,isAdmin,createCategory)

router.put('/update-category/:id',authMiddleware,isAdmin,updateCategory)

router.delete('/delete-category/:id',authMiddleware,isAdmin,deleteCategory)

router.get('/get-category/:id',authMiddleware,getACategory)

router.get('/all-categories',authMiddleware,getAllCategories)






module.exports = router