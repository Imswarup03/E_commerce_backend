//  cloudinary is a cloud database where we can store our files, texts and multimedia files 

const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  const cloudinaryUploading = async(fileToUpload)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload,(result)=>{
            resolve({
                url:result.secure_url,
            },
            {
                resource_type:"auto",
            }
            );
        })
    })
  }

module.exports = {cloudinaryUploading}