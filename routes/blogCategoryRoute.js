const express = require('express')
const router = express.Router()

const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')

const {createCategory,deleteCategory,getACategory,getAllCategory,updateCategory}= require('../controller/blogCategoryCtrl')


router.post('/create-blog-category',authMiddleware,isAdmin,createCategory)

router.delete('/delete-blog-category/:id',authMiddleware,isAdmin,deleteCategory)

router.get('/get-blog-category/:id',getACategory)

router.get('/get-all-blog-category',getAllCategory)

router.put('/update-blog-category/:id',authMiddleware,isAdmin,updateCategory)


module.exports = router