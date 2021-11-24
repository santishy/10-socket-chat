const {Schema,model} = require('mongoose');

const userSchema = Schema({
    name:{
        type:String,
        required:[,'El nombre es requerido']
    },
    email:{
        type:String,
        required:[true,'El correo es requiredo'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es requiredo'],
    },
    image:{
        type:String,
    },
    role:{
        type:String,
        required:[true,'El rol es requiredo'],
        enum:['ADMIN_ROLE','USER_ROLE']
    },
    state:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    },
})
/**
 * se usa una funcion , para que la palabra reservada this se refiera a la instancia y no a lo que hay fuera por eso no se usa la funcion de flecha
* se esta sobrescribiendo el metodo toJson que trae el Schema por defecto.
 */
userSchema.methods.toJSON = function(){
    const {__v,password,_id,...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('user',userSchema)