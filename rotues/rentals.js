const mongoose = require("mongoose")
const express = require("express");
const routes = express.Router();
const {rentalSchema,rentalJOIschema} = require("../models/rental")
const {moviesSchema} = require("../models/movie")
const {customerSchema} = require("../models/customer")

const Rentals = mongoose.model("rentals",rentalSchema)
const Movies = mongoose.model("movies",moviesSchema)
const Customers = mongoose.model("customers",customerSchema)

routes.get("/",async (req,res)=>{
    let allRentals = await Rentals.find()
    .populate("customer movie","-_id name phone title genre");
    res.send(allRentals)
})

routes.get("/:id", async (req,res)=>{
try{
    let rental = await Rentals.findById(req.params.id)
    .populate("customer movie");
    if(!rental) return res.status(404).send({errorMsg:"Rental Not Fount"})
    res.send(rental)
}
catch (ex){
    res.status(400).send({errorMsg:ex})
}
})

routes.post("/", async (req,res)=>{
try{
    let {error} = rentalJOIschema.validate(req.body)
    if(error) return res.status(404).send({errorMsg: error})

    let movie = await Movies.findById(req.body.movieId)
    if(!movie) return res.status(404).send({errorMsg:"Movie Not Found"})
    if(movie.numberInStock ==0) return res.status(400).send({errorMsg:"Movie out Of Stock"})
    let customer = await Customers.findById(req.body.customerId)
    if(!customer) return res.status(404).send({errorMsg:"Customer Not Found"})

    let rental = createRental(req.body.customerId,req.body.movieId,req.body.dateReturned,req.body.rentalFee)
    movie.numberInStock--;
    let movieRes = await movie.save()
    let result = await rental.save();
    let newRentalDetails = await Rentals.findById(rental.id).populate("customer movie")
    res.send(newRentalDetails);
}
catch (ex){
    res.status(400).send({errorMsg:ex})
}
})

routes.put("/:id", async (req,res)=>{
try{
    let rental = await Rentals.findById(req.params.id);
    if(!rental) return res.status(404).send({errorMsg:"Rental Not Found"});

    let {error} = rentalJOIschema.validate(req.body)
    if(error) return res.status(404).send({errorMsg: error})

    let movie = await Movies.findById(req.body.movieId)
    if(!movie) return res.status(404).send({errorMsg:"Movie Not Found"})
    
    let customer = await Customers.findById(req.body.customerId)
    if(!customer) return res.status(404).send({errorMsg:"Customer Not Found"})
   
    let updatedRental = await Rentals.findByIdAndUpdate({_id:req.params.id},{
        customer: req.body.customerId,
        movie: req.body.movieId,
       
        dateReturned : req.body.dateReturned,
        rentalFee : req.body.rentalFee
    },{
        new: true,
      })
    let updatedRentalDetails = await Rentals.findById(updatedRental.id).populate("customer movie");
    res.send(updatedRentalDetails)


}
catch(ex){
    res.status(400).send({errorMsg:ex});
    
}
})

routes.delete("/:id", async (req,res)=>{
    let rental = await Rentals.findByIdAndDelete(req.params.id)
    if(!rental) return res.status(404).send({errorMsg:"Rental Not Found"});
    res.send({message:"Deleted Sucessfully"})
})
let createRental = (customerId,movieId,dateReturned,rentalFee)=>{
    let rental = new Rentals({
        customer : customerId,
        movie : movieId,
        
        dateReturned : dateReturned,
        rentalFee :rentalFee
    })
    return rental
}


module.exports = routes;