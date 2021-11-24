const { Product } = require('../models');
const getProducts = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;

    try {

        const [total, products] = await Promise.all(
            [
                Product.countDocuments({ 'status': true }),
                Product.find({ 'status': true })
                    .populate('user', 'name')
                    .populate('category', 'name')
                    .skip(from)
                    .limit(limit)
            ]
        );

        return res.json({
            total,
            products
        })
    } catch (error) {

        console.log(error);
        res.status(500).json({
            'msg': 'Ocurrio un error consulte con el administrador.'
        });
    }
}

const createProduct = async (req, res) => {
    try {
        /**
         * si mandan otro usuario se ignora para tener integridad de quien creo el producto
         */
        const { status, user, ...body } = req.body;
        body.name = body.name.toUpperCase();
        const data = {
            ...body,
            user: req.currentUser._id,
        }
        const product = new Product(data);
        await product.save();
        return res.status(201).json({
            product
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrio un error consulte con el administrador'
        })
    }
}

const updateProduct = async (req, res) => {
    const { status, user, ...body } = req.body;
    const id = req.params.id;
    try {
        if(body.name){
            body.name = body.name.toUpperCase();
        }
        const data = {
            ...body,
            user:req.currentUser._id,

        }
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        return res.json({
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Consulte con el administrador'
        });
    }

}

const showProduct = async(req,res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById(id).populate('category').populate('user')
        return res.json({
            product
        })
    }catch(error)
    {
        console.log(error);
        res.json({msg:'Consulte con el admin'})
    }
}

const deleteProduct = async (req,res) => {
    try{
        const {id} = req.params;
        const product =await Product.findByIdAndUpdate(id,{status:false},{new:true})
        res.json({
            product
        })
    }catch(error){
        console.log(error)
    }
}
module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    showProduct,
    deleteProduct
}