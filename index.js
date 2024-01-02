const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbConnect')
const {notFound,errorHandler} = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')


const authRouter= require('./routes/authRoutes');
const productRouter= require('./routes/productRoute');
const blogRouter= require('./routes/blogRoute');
const productCategoryRouter = require('./routes/productCategoryRoute');
const blogCategoryRouter= require('./routes/blogCategoryRoute')
const brandRouter = require('./routes/brandRoute')

const couponRoute = require('./routes/couponRoute')


dbConnect(process.env.DATABASE_URI)


app.use(morgan('dev'))
app.use(bodyParser.json())



app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());


app.use('/api/user',authRouter);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/category',productCategoryRouter);
app.use('/api/blog-category',blogCategoryRouter);
app.use('/api/brand',brandRouter)
app.use('/api/coupon',couponRoute)

app.use(notFound)

app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});

