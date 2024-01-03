//  cloudinary is a cloud database where we can store our files, texts and multimedia files 

const cloudinary = require('cloudinary')


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

const cloudinaryUploading = async (fileToUpload)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload,(result)=>{
            resolve(
            {
                url:result.secure_url,
            },
            {
                resource_type:"auto",
            }
            );
        })
    })
  }

// const cloudinaryUploading = async (fileToUpload) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(fileToUpload, (error, result) => {
//             if (error) {
//                 reject(error); // Reject the promise in case of an error
//             } else {
//                 resolve({
//                     url: result.secure_url,
//                     // Other properties you might want to return
//                 });
//             }
//         }, {
//             resource_type: "auto",
//         });
//     });
// };


module.exports = { cloudinaryUploading }