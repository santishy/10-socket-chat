var jwt = require('jsonwebtoken');
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

module.exports = { generateToken }