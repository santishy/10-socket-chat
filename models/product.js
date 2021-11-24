
const {Schema,model} = require('mongoose');
const user = require('./user');

const productSchema = Schema({
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
    },
    price:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    image:{
        type:String
    }
});

productSchema.methods.toJSON = function(){
    const {__v,_id,status, ...product} = this.toObject();
    product.uid = _id;
    return product;
}

module.exports = model('Product',productSchema);