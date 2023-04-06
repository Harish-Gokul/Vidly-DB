const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose"); 
const {customerSchema,customerJoiSchema} = require("../models/customer")
const CustomerCollections = mongoose.model("Customers",customerSchema)

routes.get("/",async(req,res)=>{
    let allCustomers = await CustomerCollections.find();
    res.send(allCustomers)
})

routes.get("/:id",async(req,res)=>{
    try{
        const customer = await CustomerCollections.findById(req.params.id)
        if(!customer)
        return res.status(404).send({errorMsg:"File Not Found"})
        res.send(customer)
    }
    catch (ex){
        res.status(400).send({errorMsg:ex.toString()})
    }
})

routes.post("/",async(req,res)=>{
    const joiValidation = customerJoiSchema.validate(req.body)
    if(joiValidation.error){
        return res.status(400).send({errorMsg:joiValidation.error})
    }
    try{
        let customerWithExistingPh = await CustomerCollections.find({phone:req.body.phone})
        if(customerWithExistingPh.length >0){
            return res.status(400).send({errorMsg:"Phone Number already Exitss"})
        }
        let newCustomer = createCustomer(req.body.name,req.body.phone,req.body.isGold)
         newCustomer = await newCustomer.save()
        res.send(newCustomer)
    }
    catch(ex){
        res.status(400).send(ex.toString())
    }
})

routes.put("/:id",async(req,res)=>{
    const joiValidation = customerJoiSchema.validate(req.body)
    if(joiValidation.error) return res.status(400).send({errorMsg:joiValidation.error})
    
try{
    let customer = await CustomerCollections.findById(req.params.id)
    if(!customer) return res.status(404).send({errorMsg:"Customer Not Found"})

    customer.set({
        name : req.body.name,
        isGold : req.body.isGold,
        phone:req.body.phone
    })

     let result = await customer.save()
     res.send(result)

}
catch (ex){
    res.status(400).send({errorMsg:ex.toString()})
}    
})
routes.delete("/:id",async (req,res)=>{
try{
    let customer = await CustomerCollections.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(404).send({errorMsg:"Id Not Found"})
    res.send({msg:"Deleted sucessfully"})
}
catch (ex){
    res.status(400).send({errorMsg:ex.toString()})
}
})
 function createCustomer(name,phone,gold){
    const newCustomer  = new CustomerCollections({
        name:name,
        phone:phone,
        isGold:gold
    })
    return newCustomer
}
module.exports = routes;