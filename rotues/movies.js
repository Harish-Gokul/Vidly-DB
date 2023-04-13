const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");

const {genreSchema,joiSchema} = require("../models/genre")
const {moviesSchema,movieJOIschema} = require("../models/movie");

const GenresCollections = mongoose.model("GenresCollection",genreSchema);
const Movies = mongoose.model("movies",moviesSchema);

routes.get("/", async(req,res)=>{
    let allMovies = await Movies.find()
    .populate("genre")
    res.send(allMovies)
})

routes.get("/:id", async (req,res)=>{
try{
    let movie = await Movies.findById(req.params.id)
    .populate("genre")
    if(!movie) return res.status(404).send({errorMsg: "Movie Not Found"})
    res.send(movie)
}
catch (ex){
    res.status(400).send({errorMsg:ex})
}
})

routes.post("/",async (req,res)=>{
try{
    let {error} =  movieJOIschema.validate(req.body);
    if(error) return res.status(400).send({errorMsg: error})
    let genre = await GenresCollections.findById(req.body.genreId);
    if(!genre) return res.status(400).send({errorMsg: "Enter Valid Genre ID"});
    let movie = createMovieObj(req.body.title,req.body.genreId,req.body.numberInStock,req.body.dailyRentalRate)

    let result = await movie.save();
    res.send(result);
}
catch (ex){
    res.status(500).send({errorMsg:ex})
}
})

routes.put("/:id", async (req,res)=>{
try{
    let movie = await Movies.findById(req.params.id);
    if(!movie) return res.status(404).send({errorMsg:"Movie Not Fine"});
    let {error} = movieJOIschema.validate(req.body);
    let genre = await GenresCollections.findById(req.body.genreId);
    if(!genre) return res.status(400).send({errorMsg: "Enter Valid Genre ID"});
    if(error) return res.status(400).send({errorMsg:error});
    movie.title = req.body.title;
    movie.genre = req.body.genreId;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    let result = await movie.save()
    res.send(result)

}
catch (ex){
    res.status(400).send({errorMsg: ex})
}
})

routes.delete("/:id", async(req,res)=>{
    let movie = await Movies.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send({errorMsg:"Movie Not Found"})
  
    res.send({message:"Deleted Successfully"})
})

let createMovieObj = (title,genreId,stock,rent)=>{
    let movie = new Movies({
        title:title,
        genre:genreId,
        numberInStock :stock,
        dailyRentalRate : rent
    })
    return movie
}


module.exports = routes;