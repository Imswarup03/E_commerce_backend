const express = require('express')
const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')
const router = express.Router()
const {createBlog,deleteBlog,updateBlog,likeTheBlog,getAllBlogs,disLikeTheBlog,getBlog,uploadImages}= require('../controller/blogCtrl')

const {uploadPhoto,blogImgResize} = require('../middleware/uploadImages')


router.post('/create-blog',authMiddleware,isAdmin,createBlog)

router.delete('/delete-blog/:id',authMiddleware,isAdmin,deleteBlog)


router.put('/update-blog/:id',authMiddleware,isAdmin,updateBlog)

router.get('/get-blog/:id',authMiddleware,getBlog)

router.get('/get-all-blogs',authMiddleware,getAllBlogs)

router.put('/likes',authMiddleware,likeTheBlog)
router.put('/dislikes',authMiddleware,disLikeTheBlog)


router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',2),blogImgResize,uploadImages)



module.exports = router