// Not Found

const notFound= async (req,res,next)=>{
    const error = new Error(`Not Found- ${req.originalUrl}`)
    res.status(404)
    next(error)
};


// Error Handler 

const errorHandler=  (err,req,res,next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode);
    res.json({
        status:"failed",
        message:err?.message,
        stack:err?.stack
    })
    next(err)
};


module.exports = {notFound,errorHandler}