const {mongoose} = require('mongoose')




const dbConnect = async(DATABASE_URI) =>{
    try{
        const DB_OPTIONS={
            dbName:"e_commerce"
        }
        const conn =await mongoose.connect(DATABASE_URI);
        console.log("Mongo DB connected succesfully")
    }
    catch (error){
        // console.log({"error":error});
        throw new Error(error)


    }
}

module.exports = dbConnect;