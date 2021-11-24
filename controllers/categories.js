const { Category } = require('../models');


const createCategories = async (req, res) => {
    const name = req.body.name.toUpperCase();
    let category = await Category.findOne({ name });

    if (category) {
        return res.status(400).json({ 'msg': 'La categoría existe' });
    }
    const data = {
        name,
        user: req.currentUser._id
    }
    category = new Category(data);

    await category.save();

    res.status(201).json({
        category,
        user: req.currentUser
    })
}

const getCategories = async (req, res) => {
    const { from = 0, limit = 5 } = req.params;

    const [total, categories] = await Promise.all([
        Category.countDocuments({status:true}),// esto ya es una promesa .. 
        Category.find({ status: true }).populate('user')
            .skip(from)
            .limit(limit)
    ])

    return res.json({
        categories,
        total
    })
}

const updateCategories = async(req, res) => 
{
    const name = req.body.name.toUpperCase();
    const id = req.params.id;
    const categoryNameExists = await Category.findOne({name,_id:{$ne:id}});

    if(categoryNameExists){
        return res.status(400).json({
            'msg': `El nombre ${name} ya existe en la base de datos`
        })
    }
    const user = req.currentUser._id;
    const category = await Category.findByIdAndUpdate(id,{name,user},{new:true});

    return res.json({
        category
    })
}



const deleteCategories = async(req, res) => {

    const {id} = req.params;

    let category = await Category.findByIdAndUpdate(id,{status:false},{new:true});

    return res.json({
        category
    })


}

const showCategories = async(req, res) => 
{
    const {id} = req.params;

    const category = await Category.findById(id).populate('user');

    res.json({
        category
    })
}

module.exports = {
    showCategories,
    createCategories,
    deleteCategories,
    updateCategories,
    getCategories
}