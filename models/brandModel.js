const mongoose = require('mongoose')

var brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true
    },

    
})

module.exports = new mongoose.model('Brand',brandSchema)