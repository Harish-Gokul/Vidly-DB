function converNameToLowerCase(req,res,next){
    if(req.body.name != undefined){
        req.body.name = req.body.name.toLowerCase();
    }
    next()
}

module.exports = converNameToLowerCase;