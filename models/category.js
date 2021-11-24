
const {Schema,model} = require('mongoose');
const user = require('./user');

const categorySchema = Schema({
    name:{
        type:String,
        required:true,
        unique:[true,'La categoría debe ser unica en la base de datos.']
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
});

module.exports = model('Category',categorySchema);