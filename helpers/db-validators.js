const { Category, Product } = require('../models');
const Role = require('../models/role');
const user = require('../models/user');
const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ "name": role });
    if (!roleExists) {
        throw new Error('El role no existe: ' + role);
    }
}

const emailExists = async (email) => {
    const userExists = await user.findOne({ email });
    if (userExists) {
        throw new Error('El email ya existe en la base de datos');
    }
}

const userExists = async (id) => {
    const us = await user.findById(id);
    if (!us) {
        throw new Error('El usuario no existe en la base de datos: ' + id);
    }
}

const categoryExists = async (id = '') => {

    const category = await Category.findById(id);


    if (!category)
        throw new Error('La categoria no existe: ', id);
}

const productExists = async (id) => {
    const product = await Product.findById(id);
    if (!product)
        throw new Error('La categoria no existe: ', id);
}

const productNameExists = async (name) => {
    const product = await Product.findOne({ name });
    if (product) {
        throw new Error('El nombre ya esta tomado por otro producto');
    }
}

const validateAllowedCollection = (collection, allowedCollections = []) => {
    if (!allowedCollections.includes(collection)) {
        throw new Error(`La colleción enviada, no esta dentro de las permitidas ${allowedCollections}`);
    }
    return true;
}
module.exports = {
    isValidRole,
    emailExists,
    userExists,
    categoryExists,
    productNameExists,
    productExists,
    validateAllowedCollection
}