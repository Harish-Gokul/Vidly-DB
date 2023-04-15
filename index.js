const express = require("express");
const config = require("config")
const geners = require("./rotues/geners")
const customersRoutes = require("./rotues/customers")
const moviesRoutes = require("./rotues/movies");
const rentalRoutes = require("./rotues/rentals")
const usersRoutes = require("./rotues/users") 
const authRoutes = require("./rotues/auth")
const app = express(); 
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/VidlyDB")
.then( ()=> console.log("Connected Succesfully"))

const lowerCaseConverter = require("./middleware/nameLowerCase")

if(!config.get("jwtPrivateKey")){
    console.error("Jwt private key is not defined");
    process.exit(1)
}


app.use(express.json())
app.use(lowerCaseConverter)

app.use("/api/genres",geners);
app.use("/api/customers",customersRoutes)
app.use("/api/movies",moviesRoutes);
app.use("/api/rentals",rentalRoutes);
app.use("/api/users",usersRoutes)
app.use("/api/auth",authRoutes)
app.get("/",(req,res)=>{
    res.send("Connection success")
})

const port =  process.env.PORT||3000;
app.listen(port , ()=>{
    console.log("App Working fine in port "+port)
})
