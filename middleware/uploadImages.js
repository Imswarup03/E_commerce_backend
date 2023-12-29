const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const multerStorage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,path.join("./public/temp"))
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now()+'-'+Math.random()*1E9
        cb(null,file.fieldname+ '-'+uniqueSuffix+".jpeg");
    },
})

const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb({
            message:"Unsupported file format"
        },false)
    }
}


const uploadPhoto = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
    limits:{fieldSize:2000000}

})

// const productImgResize = async(req,res,next)=>{
//     if(!req.files) return next()
//     // await Promise.all(

//     for (const file of req.files) {
//             await sharp(file.path)
//             .resize(300,300)
//             .toFormat('jpeg')
//             .jpeg({quality:90})
//             .toFile(`public/temp/products/${file.filename}`)
//         fs.unlinkSync(`public/temp/products/${file.filename}`);
//         }
//         ;
//         next()
// }

const productImgResize = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        for (const file of req.files) {
            sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/temp/products/${file.filename}`);
            fs.unlink(file.path);
            // Delete the original file after processing
            
        }
        next();
    } catch (err) {
        // Handle errors
        console.error('Error occurred during image processing:', err);
        next(err); // Pass the error to Express error handling middleware
    }
};

// const blogImgResize = async(req,res,next)=>{
//     if(!req.files) return next()
//     await Promise.all(
//         req.files.map(async(file)=>{
//             await sharp(file.path)
//             .resize(300,300)
//             .toFormat('jpeg')
//             .jpeg({quality:90})
//             .toFile(`public/temp/blogs/${file.filename}`)
//         // fs.unlinkSync(`public/temp/blogs/${file.filename}`);
//         })
//                 );
//         next()
// }

module.exports ={ uploadPhoto,};