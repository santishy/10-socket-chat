const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn,renewToken } = require('../controllers/auth');
const { hasErrors } = require('../middlewares/hasErrors');
const { validateRole,validateJWT } = require('../middlewares');

const router = Router();

router.post('/login', [

    check('email', 'El email es requerido').isEmail(),
    check('password', 'El password es requerido').notEmpty(),
    hasErrors
], login);

router.post('/google', [
    check('token_id', 'El token_id es requerido').notEmpty(),
    hasErrors
], googleSignIn);

router.get('/',[validateJWT],renewToken);

module.exports = router;