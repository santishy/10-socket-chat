const isAdmin = (req,res,next) => {
    if(!req.currentUser){
        return res.status(500).json({'msg' : 'Debe obternese el usuario y el token para verificar el role'})
    }
    if(req.currentUser.role != 'ADMIN_ROLE'){
        return res.status(401).json({'msg':`el usuario ${req.currentUser.name} no es administrador` })
    }
    next()
}

const hasRole = (...rest) => {

    return (req,res,next) => {
        /**verificar si se mando llamar el middleware que obtiene el usuario atravez del payload del jwt */
        if(!req.currentUser){
            return res.status(500).json({'msg' : 'Debe obternese el usuario y el token para verificar el role'})
        }
        if(!rest.includes(req.currentUser.role))
            return res.status(401).json({'msg':`No tienes los roles: ${rest} para realizar esta acción`})
        next();
    }
}
module.exports = {isAdmin,hasRole}