const {model,Schema} = require('mongoose');

const roleSchema = Schema({
    'name':{
        type:String,
        required:[true,'El nombre del rol es requerido']
    }
});

module.exports = model('role',roleSchema);