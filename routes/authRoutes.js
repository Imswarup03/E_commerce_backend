const express = require("express")
const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')


const router= express.Router()

const {createUser,loginUser,getAllUsers,getUser,deleteUser,updateUser,blockUser,unBlockUser, handleRefreshToken,logOut,updatePassword,forgotPasswordToken,
resetPassword,loginAdmin,
getWishList,saveAddress,
userCart
}= require('../controller/userCtrl')

router.post('/register',createUser);

router.post('/login',loginUser)

router.post('/login-admin',loginAdmin)

router.get('/get-all-users',authMiddleware,isAdmin,getAllUsers)

router.get('/get-user',authMiddleware,getUser)

router.get('/get-wishlist',authMiddleware,getWishList)

router.delete('/delete-user/:id',authMiddleware,deleteUser)

router.put('/edit-user',authMiddleware,updateUser)

router.put('/block-user/:id',authMiddleware,isAdmin,blockUser)

router.put('/unblock-user/:id',authMiddleware,isAdmin,unBlockUser)

router.get('/refresh',handleRefreshToken)

router.post('/logout',authMiddleware,logOut)

router.put('/update-password',authMiddleware,updatePassword)

router.post('/forgot-password',forgotPasswordToken)

router.put('/reset-password/:token',resetPassword)

router.put('/update-address',authMiddleware,saveAddress)

router.put ('/cart',authMiddleware,userCart)


module.exports= router



