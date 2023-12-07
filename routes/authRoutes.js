const express = require("express")
const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')


const router= express.Router()

const {createUser,loginUser,getAllUsers,getUser,deleteUser,updateUser,blockUser,unBlockUser, handleRefreshToken,logOut}= require('../controller/userCtrl')


router.post('/register',createUser);

router.post('/login',loginUser)

router.get('/get-all-users',authMiddleware,isAdmin,getAllUsers)

router.get('/get-user',authMiddleware,getUser)

router.delete('/delete-user/:id',authMiddleware,deleteUser)

router.put('/edit-user',authMiddleware,updateUser)

router.put('/block-user/:id',authMiddleware,isAdmin,blockUser)

router.put('/unblock-user/:id',authMiddleware,isAdmin,unBlockUser)

router.get('/refresh',handleRefreshToken)

router.post('/logout',authMiddleware,logOut)

module.exports= router



