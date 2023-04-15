const _ = require("lodash")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const express = require("express");
const routes = express.Router();
const {userSchema} = require("../models/user");
const config = require("config")

const Users = mongoose.model("users",userSchema);
 
routes.post("/", async (req,res)=>{
try{
    
    let {error} = userJoiSchema.validate(req.body);
    if(error) return res.status(400).send({errorMsg:error});

   let user  = await Users.findOne({email:req.body.email});
   if(!user)  return res.status(400).send({message:"Invalid email or password"}) 
   
   const validPassword = await bcrypt.compare(req.body.password,user.password)
   if(!validPassword)  return res.status(400).send({message:"Invalid email or password"}) 
   
   const token = jwt.sign(_.pick(user,["_id"]),config.get("jwtPrivateKey"))

   res.send(token)
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})
 
const userJoiSchema = Joi.object({
    email : Joi.string().required(),
    password : Joi.string().min(5).max(30).required()
})


 

module.exports = routes ;