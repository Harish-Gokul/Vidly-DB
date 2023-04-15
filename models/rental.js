const mongoose = require("mongoose");
const Joi = require("joi")
const {moviesSchema} = require("./movie");
const {customerSchema} = require("./customer");

const MoviesModel = mongoose.model("movies",moviesSchema);
const CustomerModel = mongoose.model("customers",customerSchema)

const rentalSchema = mongoose.Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"customers",
        required: true
    },
    movie :{
        type :mongoose.Schema.Types.ObjectId,
        ref:"movies",
        required : true
    },
    dateOut:{
        type : Date,
        required : true,
        default : Date.now
    },
    dateReturned :{
        type : Date
    },
    rentalFee:{
        type: Number,
        min :0
    }
})

let rentalJOIschema = Joi.object({
    customerId : Joi.string().required(),
    movieId : Joi.string().required(),
    dateReturned :Joi.date(),
    rentalFee : Joi.number()
})

module.exports.rentalSchema = rentalSchema;
module.exports.rentalJOIschema = rentalJOIschema;