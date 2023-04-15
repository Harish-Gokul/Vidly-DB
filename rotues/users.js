const _ = require("lodash")
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken")
const config = require("config")
const routes = express.Router();

const {userJoiSchema,userSchema} = require("../models/user");

const Users = mongoose.model("users",userSchema);

routes.get("/me",auth,async(req,res)=>{
    const user = await Users.findById(req.user._id)
    .select("-password")
    res.send(user)
    
})

routes.get("/",async(req,res)=>{
    let allUsers = await Users.find()
    res.send(allUsers)
})

routes.get("/:id",async (req,res)=>{
try{
    let user = await Users.findById(req.params.id)
    if(!user) return res.status(404).send({errorMsg:"Invalid User Id /  User not found"});
    res.send(user)
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.post("/", async (req,res)=>{
try{
    
    let {error} = userJoiSchema.validate(req.body);
    if(error) return res.status(400).send(_.pick(error,["message"]));
    let user = createUserObj(req.body.name,req.body.email,req.body.password)
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.password,salt)
    let result = await user.save()
    
    const token = jwt.sign(_.pick(user,["_id"]),config.get("jwtPrivateKey"));
    res.header("x-auth-token",token)
    
    res.send(_.pick(result,["_id","name","email"]))   
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.put("/:id", async (req,res)=>{
try{
    let {error} = userJoiSchema.validate(req.body);
    if(error) return res.status(400).send({errorMsg:error});
    let user = await Users.findById(req.params.id)
    if(!user) return res.status(404).send({errorMsg:"user Not found"})
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password,salt)
     user = await Users.findByIdAndUpdate({_id:req.params.id},{
        name:req.body.name,
        email: req.body.email,
        password :password
    }, {
        new:true
    })

    res.send({
        name : user.name,
        email: user.email
    })
}
catch (ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})

routes.delete("/:id",async (req,res)=>{
try{
    let isValid = await Users.findById(req.params.id);
    if(!isValid) return res.status(404).send({errorMsg:"Enter a valid user id"})
    let status = await Users.findByIdAndDelete({_id:req.params.id})
    res.send({message:"User Deleted sucessfully"})
}
catch(ex){
    res.status(400).send(_.pick(ex,["message"]))
}
})



function createUserObj(name,email,password){
    let userObject = new Users({
        name :name,
        email:email,
        password :password
    })
    return userObject
}


module.exports = routes ;