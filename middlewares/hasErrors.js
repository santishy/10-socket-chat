const { validationResult } = require("express-validator");

const hasErrors = (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(422).json({errors})
    }

    next();
}

const validateImage = (name) => {
    return (req,res,next) => {
        if(!req.files || !Object.values(req.files).length || !req.files[name]){
            return res.status(400).json({msg:'No enviaste archivo'})
        }
        next();
    }
}
module.exports = {hasErrors,validateImage}