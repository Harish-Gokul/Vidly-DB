const express = require("express")
const { object } = require("joi")
const routes = express.Router()
const Joi = require("joi")

const schema = Joi.object({
    name: Joi.string().min(3).required()
})

let geners = [ {id:1,name:"Romance"},{id:2,name:"Action"}] 

routes.get("/", (req,res)=>{
    res.send(geners)
})

routes.get("/:id",(req,res)=>{
    for(let item of geners ){
        if(item.id == req.params.id) {
            res.send(item);
            return 
        }
    } 

    res.status(404).send({msg:"Item Not Found"})
})

routes.post("/",(req,res)=>{
    let validationStatus = schema.validate(req.body);

    if(validationStatus.error)
    return res.status(400).send({errorMsg:validationStatus.error.details[0].message});

    let isNameExits = isPropertyAndValuePresent("name",req.body.name,geners) 
    if(isNameExits)
    return res.status(400).send({msg:"File Already Exits"})

    let newObj = {id:geners.length+1,name:req.body.name};
    geners.push(newObj)
    res.send(newObj)
})

routes.put("/:id",(req,res)=>{
    let validationStatus = schema.validate(req.body);
    if(validationStatus.error)
    return res.status(400).send({errorMsg:validationStatus.error.details[0].message});
    
    let isNameAlreadyPresent = isPropertyAndValuePresent("name",req.body.name,geners)
    if(isNameAlreadyPresent)
    return res.status(400).send({errorMsg:"File Already Present"})

    for( let object of geners){ 
        if(object.id == req.params.id){
            object.name = req.body.name;
            res.send(object);
            return
        }
    }

    res.status(404).send({errorMsg:"File Not Fount"})
})

routes.delete("/:id",(req,res)=>{
    let targetObj;
     
    for( let index in geners){ 
        if(geners[index].id == req.params.id){
             targetObj = index; 
            break
        }
    } 

    if(targetObj == undefined)
    return res.status(404).send({error:"File Not Fount"});

    geners.splice(targetObj,1);
    res.send({Status:"Deleted Sucessfully"})
    
})


function isPropertyAndValuePresent(property,value,array){
    for(let object of array){
        if(object[property].toLowerCase() == value.toLowerCase()){
            return true;
        } 
    }
    return false;
} 

module.exports = routes;