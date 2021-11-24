const { Router } = require('express');
const { check,query } = require('express-validator');

const { getUser, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/user');
const { isValidRole, emailExists, userExists } = require('../helpers/db-validators');
/*const { hasErrors } = require('../middlewares/hasErrors');
const { validateJWT } = require('../middlewares/ValidateJWT');
const { isAdmin, hasRole} = require('../middlewares/ValidateRole')*/

/**
 * se llama en automatico el index.js q esta en middlewares
 */
const {hasErrors,validateJWT,isAdmin,hasRole} = require('../middlewares');

const router = Router();

router.get("/",[
    check('limit','limit debe ser numerico').isNumeric(),
    check('from','from debe ser numerico').isNumeric(),
    hasErrors
], getUser);

router.post("/",[
    check('name','El nombre es requerido').not().isEmpty(),
    check('email','El email es incorrecto').isEmail(),
    check('email').custom(emailExists),
    check('password','El password debe contener minimo seis caracteres').isLength({min:6}),
    /*
    *se manda solamente isValidRole, y no isValidRole(arg), ya que en el helper es una funcion
    *-de flecha y en una funcion de flecha (arg) => {} se puede obviar el (arg) si solo se manda ese
    * y ya que custom(arg)  tiene el arg se pasa automaticamente.
    */
    check('role').custom(isValidRole),
    hasErrors
], usuariosPost);

router.put("/:id",[
    
    check('id',['No es un ID valido de mongo']).isMongoId(),
    check('id').custom(userExists),
    check('role').custom(isValidRole),
    hasErrors,
] ,usuariosPut);

router.patch("/", usuariosPatch);

router.delete("/:id",[
    validateJWT,
    //isAdmin, //fuerza a que sea admin para realizar la accion
    hasRole('VENTAS_ROLE','ADMIN_ROLE'),
    check('id',['No es un ID valido de mongo']).isMongoId(),
    check('id').custom(userExists),
    hasErrors
], usuariosDelete);

module.exports = router;