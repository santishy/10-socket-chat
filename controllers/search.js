var ObjectId = require('mongoose').Types.ObjectId;
const { user, Category, Product } = require('../models')
const allowedCollection = ['products', 'roles', 'users', 'categories'];

const searchUsers = async (term, res) => {

    if (ObjectId.isValid(term)) {
        const userFound = await user.findById(term)
        return res.json({
            results: userFound ? [userFound] : []
        })
    }
    const regex = new RegExp(term, 'i');

    const users = await user.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    })

    return res.json({
        results: users
    })
}

const searchProducts = async (term,res) => {

    if(ObjectId.isValid(term)){
        const product = await Product.findById(term).populate('category','name');
        return res.json({
            results: product ? [product] : []
        });
    }
    const regexp = new RegExp(term,'i');

    const products = await Product.find({
        $or:[{name:regexp},{description:regexp}],
        $and:[{status:true}]
    }).populate('category','name')

    return res.json({
        results:products
    })
}

const searchCategories = async (term,res) => {
    if(ObjectId.isValid(term)){
        const category = await Category.findById(term);
        return res.json({
            results: category ? [category] : []
        });
    }
    const regexp = new RegExp(term,'i');

    const categories = await Category.find({
        name:regexp,
        $and:[{status:true}]
    })

    return res.json({
        results:categories
    })
}
const search = async (req, res) => {
    const { collection, term } = req.params;


    if (!allowedCollection.includes(collection)) {
        return res.status(400).json({
            msg: 'La colleción enviada no es permitida enla busqueda'
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);

            break;
        case 'products':
            searchProducts(term,res)
            break;
        case 'categories':
            searchCategories(term,res)
            break;
        default:
            res.json({ msg: 'La coleccion no esta disponible, no a sido implementada' })

    }
}

module.exports = { search }