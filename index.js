const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbConnect')
const {notFound,errorHandler} = require('./middleware/errorHandler')

const authRouter= require('./routes/authRoutes');


dbConnect(process.env.DATABASE_URI)


app.use(bodyParser.json())



app.use(bodyParser.urlencoded({extended:true}))

app.use('/api/user',authRouter)



app.use(notFound)

app.use(errorHandler)



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});