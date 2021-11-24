const path = require('path');
const fs = require('fs');
const { uploadFiles } = require('../helpers');
const { user, Product } = require('../models');
var cloudinary = require('cloudinary').v2

const uploadFile = async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
        res.status(400).json({ 'msg': 'No files were uploaded.' });
        return;
    }

    try {
        const name = await uploadFiles(req.files, undefined, 'imagenes');
        return res.json({ name })
    } catch (err) {
        return res.json({
            error: err
        })
    }

}

const updateImage = async (req, res) => {
    const { id, collection } = req.params;

    let model;
    switch (collection) {
        case 'users':
            model = await user.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No hay un id en ${collection} con ese id: ${id} ` });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No hay un id en ${collection} con ese id: ${id} ` });
            }
            break;
        default:
            return res.status(500).json({ msg: `La collecion ${collection} no a sido implementada` })
    }

    if (model.image) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.image);
        console.log(pathImage)
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }

    const name = await uploadFiles(req.files, undefined, collection);

    model.image = name;

    await model.save();

    return res.json(model)
}
const updateImageCloudinary = async (req, res) => {
    const { id, collection } = req.params;

    let model;
    switch (collection) {
        case 'users':
            model = await user.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No hay un id en ${collection} con ese id: ${id} ` });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No hay un id en ${collection} con ese id: ${id} ` });
            }
            break;
        default:
            return res.status(500).json({ msg: `La collecion ${collection} no a sido implementada` })
    }

    if (model.image) {
        const arrayName = model.image.split('/');
        const name = arrayName[arrayName.length -1];
        const [ public_id ] = name.split('.'); // desesctructura [public,null]
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.image;
    try {
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        model.image = secure_url;
        model.save();
        return res.json(model)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }

    // model.image = name;

    // await model.save();

    
}
const showImage = async (req, res) => {
    const { id, collection } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await user.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `el id: ${id} no existe en la collecion ${collection}`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `el id: ${id} no existe en la collecion ${collection}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: `no se a implementado el metodo para la collecion: ${collection}`
            })
    }

    if (model.image) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    }

    const pathImage = path.join(__dirname, '../assets', 'no-image.jpg');
    if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage)
    }
    return res.json({
        msg: 'No hay imagen para mostrar'
    })
}
module.exports = { uploadFile, updateImage, showImage, updateImageCloudinary }