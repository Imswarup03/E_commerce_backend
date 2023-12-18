const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const dotenv= require('dotenv')
dotenv.config()



const sendEmail = asyncHandler(async(data,req,res,) => {
    let transporter =   nodemailer.createTransport({
        host:process.env.EMAIL_HOST ,
        port:process.env.EMAIL_PORT ,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    
// send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to:data.to,
        text: data.text,
        subject: data.subject,
        html: data.html
    
    })
    console.log("Message Sent:%s",info.messageId);
    console.log("Preview URL:%s",nodemailer.getTestMessageUrl(info));
    // return true

})



module.exports = { sendEmail }