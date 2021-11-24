const jwt = require('jsonwebtoken')
const User = require('../models/user');

const validateJWT = async (req,res,next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status('400').json({'msg':'No enviaste el token'})
    }
    /*
    * Retorna el payload esta función.
    */
    try
    {
        const {uid} = jwt.verify(token,process.env.SECRETOPRIVATEJWT);
        const currentUser = await User.findById(uid);
        /**
         * validamos que el usuario no haya sido borrado de la bd
         */

        if(!currentUser){
            return res.status(401).json({
                'msg' : 'El usuario no existe en la bd'
            })
        }

        if(!currentUser.state){
            return res.status(401).json({
                'msg' : 'El usuario esta desactivado'
            })
        }

        req.currentUser = currentUser;
        next()
    }
    catch(error)
    {
        console.log(error);
        return res.status(401).json({'msg' : 'usuario no autorizado'})
    }
    

}

module.exports = {
    validateJWT
}