const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.url)
    cb(null, path.join( __dirname,"../public/temp"));
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
    fileFilter: multerFilter,
    limits:{fieldSize:2000000}

})
// console.log(uploadPhoto)


const productImgResize = async (req,res,next)=>{
  if(!req.files) return next()
  try{
      for(const file of req.files){
        console.log(file)
          await sharp(file.path)
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`public/temp/products/${file.filename}`)
            fs.unlinkSync(`public/temp/products/${file.filename}`)
      }
  
    console.log("process done")
    next()
        }catch (err) {
      console.error('Error occurred during image processing:', err);
      next(err); 
}
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  try {
    for (const file of req.files) {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/temp/blogs/${file.filename}`);
      // console.log(file.path)
      fs.unlinkSync(`public/temp/blogs/${file.filename}`);
    }
    next();
  } catch (err) {
    // Handle errors
    console.error('Error occurred during image processing:', err);
    next(err);
  }
};







module.exports ={ uploadPhoto,productImgResize,blogImgResize}









