const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, updateProduct, showProduct, deleteProduct } = require('../controllers/products');
const { productNameExists, categoryExists, productExists } = require('../helpers/db-validators');
const { validateJWT, hasErrors, isAdmin } = require('../middlewares');

const router = Router();

router.get('/', getProducts);

router.post('/', [
    validateJWT,
    check('category', 'Debe ser un id de mongo valido').isMongoId(),
    check('category').custom(categoryExists),
    check('name', 'El nombre del producto es requerido').notEmpty(),
    check('name').custom(productNameExists),
    check('description', 'La descripción es requerida').notEmpty(),
    hasErrors
], createProduct);

router.put('/:id', [
    validateJWT,
    check('id', 'Debe ser un id de mongodb').isMongoId(),
    check('id').custom(productExists),
    //check('category').custom(categoryExists),
    hasErrors
],updateProduct)

router.get('/:id',[
    check('id', 'Debe ser un id de mongodb').isMongoId(),
    check('id').custom(productExists),
    hasErrors
],showProduct);

router.delete('/:id',[
    validateJWT,
    isAdmin,
    check('id','Debe ser un id valido').isMongoId(),
    check('id').custom(productExists),
    hasErrors
],deleteProduct)
module.exports = router;