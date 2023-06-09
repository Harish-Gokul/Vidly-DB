const jwt = require("jsonwebtoken")
const config =require("config")
function auth (req,res,next){
try{
    const token = req.header("x-auth-token")
    if(!token)return res.status(401).send("Access denied. no token provided")
    const decoded = jwt.verify(token,config.get("jwtPrivateKey"));
    req.user= decoded;
    next()
}
catch (ex){
    res.status(400).send({errorMsg:"Invalid token"})
}
}

module.exports = auth;