
const { response } = require('express');
var bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../helpers/generate-token');
const { verifyGoogleToken } = require('../helpers/verify-google-sign-ing');


const login = async (req, res = response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ "msg": "El email no se encuentra en la base de datos" })
    }

    if (!user.state) {
        return res.status(401).json({ 'msg': 'El usuario no esta activo' });
    }
    const validPassword = bcrypt.compareSync(String(password), user.password);
    if (!validPassword) {
        return res.status(401).json({ "msg": 'Contraseña invalida' });
    }
    try {

        const token = await generateToken(user._id)
        return res.json({
            token,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error,
            'msg': 'No se pudo crear el token'
        })
    }
    return res.json({ "msg": 'ok' })
}

const googleSignIn = async (req, res = response) => {
    const token_id = req.body.token_id;
    try {
        const { name, picture, email } = await verifyGoogleToken(token_id)
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ image: picture, email, google: true, password: ':P', role: 'USER_ROLE' });
            user.save();
        }
        if (!user.state) {
            return res.json(401).json({ msg: 'usuario bloqueado' });
        }
        const token = await generateToken(user.uid)

        return res.json({
            token,
            user
        })

    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            'msg': 'El token de google no es valido'
        })
    }
}

const renewToken = async(req,res) => {

    const currentUser = req.currentUser;
    const token = await generateToken(currentUser._id)
    res.json({
        currentUser,
        token
    })
}
module.exports = { login, googleSignIn,renewToken }