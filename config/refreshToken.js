const jwt = require('jsonwebtoken');

const generateRefreshToken = async (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}


module.exports = { generateRefreshToken }