const mongoose = require("mongoose");
const {genreSchema} = require("./genre")
const Joi = require("joi");
const GenresModel = mongoose.model("genrescollections",genreSchema)
const moviesSchema = mongoose.Schema({
    title :{
        type : String,
        minLength :3,
        maxLength :30,
        required :true
    },
    genre : {
      type:  mongoose.Schema.Types.ObjectId,
      ref :"genrescollections",
      required : true
    },
    numberInStock : {
        type:Number,
        min:0,
        max:255
    },
    dailyRentalRate : Number
})


const movieJOIschema = Joi.object({
    title : Joi.string().min(3).required(),
    genreId : Joi.string().required(),
    numberInStock : Joi.number(),
    dailyRentalRate :Joi.number()
})
 

exports.moviesSchema = moviesSchema;
exports.movieJOIschema = movieJOIschema;