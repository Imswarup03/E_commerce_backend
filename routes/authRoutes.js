const express = require("express")
const {authMiddleware,isAdmin}= require('../middleware/authMiddleware')


const router= express.Router()

const {createUser,loginUser,getAllUsers,getUser,deleteUser,updateUser}= require('../controller/userCtrl')


router.post('/register',createUser);

router.post('/login',loginUser)

router.get('/get-all-users',authMiddleware,isAdmin,getAllUsers)

router.get('/get-user/:id',authMiddleware,getUser)

router.delete('/delete-user/:id',authMiddleware,deleteUser)

router.put('/update-user/:id',authMiddleware,updateUser)

module.exports= router



