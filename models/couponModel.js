const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    expiry:{
        type:Date,
        required:true,
        unique:false,
    },
    discount:{
        type:Number,
        required:true,
        
    }
});




//Export the model
module.exports = mongoose.model('Coupon', couponSchema);