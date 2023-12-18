const mongoose = require('mongoose')

// declare the schema of Blog

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    Likes:[
        {
        type:mongoose.Schema.Types.ObjectId
    }
    ],
    disLikes:[
        {
            type:mongoose.Schema.Types.ObjectId
        }
    ],
    image:{
        type:String,
        defalut:null
    },
    author:{
        type:String,
        default:"Admin"
    }
},
    {
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    }

)

module.exports = mongoose.model('Blog', blogSchema);