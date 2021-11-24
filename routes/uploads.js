const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile,updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { validateAllowedCollection } = require('../helpers');

const { hasErrors,validateImage } = require('../middlewares/hasErrors');


const router = Router();
/*
* Se usa post, ya que estas creando un recurso nuevo
*/
router.post('/',uploadFile);

router.put('/:collection/:id',[
    check('id','El id, debe ser un id valido de mongodb').isMongoId(),
    check('collection').custom( (c) => validateAllowedCollection(c,['users','products'])),
    validateImage('image'),
    hasErrors
],updateImageCloudinary)

router.get('/:collection/:id',[
    check('id','El id, debe ser un id valido de mongodb').isMongoId(),
    check('collection').custom( (c) => validateAllowedCollection(c,['users','products'])),
    hasErrors
],showImage)

module.exports = router;