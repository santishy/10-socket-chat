const User = require('../models/user');
const bycript = require('bcryptjs');

const getUser = async(req, res) => {
    const {limit = 5,from = 0} = req.query;

    const query = {state:true}

    /**
     * [arg,arg1] asi se desesctructura un array, y promise.all() ejecuta varias promesas al mismo tiempo
    * asi se de esta forma al ejecutar las promesas juntas se ahorra hasta la mitad de tiempo
     */
    const [total,users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))]
    )
    res.json({
        users,
        total
    });
}

const usuariosPost = async (req, res) => {

    //validacion 
    /**va via middleware */


    const { name, email, password, role } = req.body;



    const user = new User({ name, email, password, role });


    //encriptar la contraseña
    const salt = bycript.genSaltSync(10);
    user.password = bycript.hashSync(password, salt)
    user.save();
    res.json({
        user
    });
}
const usuariosPut =async (req, res) => {
    const { id } = req.params;
    const {email,_id,password,google,...rest} = req.body;

    if(password){
        const salt = bycript.genSaltSync(10);
        //como es un object se le añade la propiedad password
        rest.password = bycript.hashSync(password, salt)
    }

    const usuario = await User.findByIdAndUpdate(id,rest);

    res.json({
        msg: 'put method',
        usuario
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch method'
    });
}

const usuariosDelete = async(req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,{'state':false});

    res.json({
        user,
        "authenticated_user":req.currentUser
    });
}

module.exports = {
    getUser,
    usuariosDelete,
    usuariosPut,
    usuariosPatch,
    usuariosPost
};