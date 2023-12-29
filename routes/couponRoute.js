const express = require('express')
const router= express.Router()

const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')

const {createCoupon,getAllCoupons,getACoupon} = require('../controller/couponCtrl')


router.post('/create-coupon',authMiddleware,isAdmin,createCoupon)

router.get('/get-all-coupons',authMiddleware,getAllCoupons)

router.get('/get-coupon/:id',authMiddleware,getACoupon)

router.delete('/delete-coupon/:id',authMiddleware,isAdmin)

router.put('/edit-coupon/:id',authMiddleware,isAdmin)


module.exports = router

