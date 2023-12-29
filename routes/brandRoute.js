const express = require('express')
const router = express.Router()

const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')

const {createBrand,getAllBrand,getABrand,updateBrand,deleteBrand}= require('../controller/brandCtrl')


router.post('/create-brand',authMiddleware,isAdmin,createBrand)

router.delete('/delete-brand/:id',authMiddleware,isAdmin,deleteBrand)

router.get('/get-brand/:id',getABrand)

router.get('/get-all-brands',getAllBrand)

router.put('/update-brand/:id',authMiddleware,isAdmin,updateBrand)


module.exports = router