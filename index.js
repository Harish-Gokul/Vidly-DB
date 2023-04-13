const express = require("express");
const geners = require("./rotues/geners")
const customersRoutes = require("./rotues/customers")
const moviesRoutes = require("./rotues/movies");
const app = express(); 
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/VidlyDB")
.then( ()=> console.log("Connected Succesfully"))

const lowerCaseConverter = require("./middleware/nameLowerCase")

app.use(express.json())
app.use(lowerCaseConverter)

app.use("/api/genres",geners);
app.use("/api/customers",customersRoutes)
app.use("/api/movies",moviesRoutes);

app.get("/",(req,res)=>{
    res.send("Connection success")
})

const port =  process.env.PORT||3000;
app.listen(port , ()=>{
    console.log("App Working fine in port "+port)
})
