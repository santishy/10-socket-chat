var jwt = require('jsonwebtoken');
const { user:User } = require('../models');

const generateToken = async (uid) => {
    const payload = { uid }
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, process.env.SECRETOPRIVATEJWT, { 'expiresIn': '4h' }, (err, token) => {
            if (err) {
                console.log(err)
                return reject('Ocurrio un error consulte con el desarrollador')
            }
            return resolve(token);
        })
    })
}
const checkToken = async(token) => {
    try {
        const {uid} = jwt.verify(token,process.env.SECRETOPRIVATEJWT);

        const user = await User.findById(uid);
        if(user && user.state){
            return user;
        }
        return null;
    }
    catch (e) {
        console.log(e)
        return null;
    }
    
}
module.exports = { generateToken,checkToken }