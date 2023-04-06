const mongoose = require("mongoose")
const Joi = require("joi")
const genreSchema = mongoose.Schema({
    name: {
        type:String,
        minlength: 3,
        required:true,
        lowercase : true
    }
})

const schema = Joi.object({
    name: Joi.string().min(3).required()
})

module.exports.genreSchema = genreSchema;
module.exports.joiSchema = schema;