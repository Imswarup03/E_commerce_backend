const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join( "D://public//temp"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random()* 1E9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});




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
    storage: storage,
    fileFilter:multerFilter,
    limits:{fieldSize:2000000}

})

const productImgResize = async(req,res,next)=>{
    if(!req.files) return next()
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path)
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`D://public//temp//products//${file.filename}`)
        fs.unlinkSync(`D://public//temp//products//${file.filename}`);
        })
        );
        next()
}

const blogImgResize = async(req,res,next)=>{
    if(!req.files) return next()
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path)
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`C://public//temp//blogs//${file.filename}`)
        fs.unlinkSync(`C://public//temp//blogs//${file.filename}`);
        })
        );
        next()

}

module.exports ={ uploadPhoto, productImgResize,blogImgResize};