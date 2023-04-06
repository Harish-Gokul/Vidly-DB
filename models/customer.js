const mongoose = require("mongoose")
const Joi = require("joi");
const customerSchema = mongoose.Schema({
    name : {
        type:String,
        minLength:3,
        required:true
    },
    phone : {
        type: String,
        maxLength:11,
         require:true
        },
    isGold: {
        type:Boolean,
        default:false}
    })

    const customerJoiSchema =  Joi.object({
        name : Joi.string().min(3).required(),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        isGold : Joi.boolean().required()
    }) 
    
module.exports.customerSchema = customerSchema;
module.exports.customerJoiSchema = customerJoiSchema