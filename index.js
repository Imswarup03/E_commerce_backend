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


dbConnect(process.env.DATABASE_URI)


app.use(morgan('dev'))
app.use(bodyParser.json())



app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());


app.use('/api/user',authRouter);
app.use('/api/product',productRouter);


app.use(notFound)

app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});

