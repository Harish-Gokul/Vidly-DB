const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
    name :{
        type : String,
        minLength :3,
        maxLength : 30,
        required : true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        minLength: 5,
        maxLength : 255,
        required:true
    }
    
})

const userJoiSchema = Joi.object({
    name : Joi.string().min(3).max(30).required(),
    email : Joi.string().required(),
    password : Joi.string().min(5).max(30).required()
})

exports.userSchema = userSchema;
exports.userJoiSchema = userJoiSchema;