const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT, hasErrors, isAdmin } = require('../middlewares');
const { getCategories,
    createCategories, showCategories,
    deleteCategories, updateCategories } = require('../controllers/categories');
const { categoryExists } = require('../helpers/db-validators');

const router = Router();

router.get('/',[
    // validateJWT,
    check('from').notEmpty(),
    hasErrors
], getCategories);

router.get('/:id',[
    // validateJWT,
    check('id').isMongoId(),
    check('id').custom(categoryExists),
    hasErrors
], showCategories);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es requerido').notEmpty(),
    hasErrors,
], createCategories);

router.put('/:id',[
    validateJWT,
    check('id',['El id no es valido']).isMongoId(),
    check('id').custom(categoryExists),
    check('name','El nombre es requerido').notEmpty(),
    hasErrors
], updateCategories);

router.delete('/:id',[
    validateJWT,
    isAdmin,
    check('id').isMongoId(),
    check('id').custom(categoryExists),
    hasErrors
] ,deleteCategories);

module.exports = router;
