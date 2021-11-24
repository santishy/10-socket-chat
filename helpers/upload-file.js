const path = require('path')
const { v4: uuidv4 } = require('uuid');

const uploadFiles = (files, allowedExtensions = ['JPG', 'JPEG', 'PNG', 'GIF'],folder='') => {
    return new Promise((resolve, reject) => {

        const { image } = files;



        const data = image.name.split('.');

        const ext = data[data.length - 1]

        if (!allowedExtensions.includes(ext.toUpperCase())) {
            return reject('la extensión no encuentra dentro de las permitidas: ' + allowedExtensions)

        }
        const name = uuidv4();
        uploadPath = path.join(__dirname, '../uploads/',folder, name + '.' + ext);

        image.mv(uploadPath, function (err) {
            if (err) {
                console.log(err)
                reject(err)
            }

            resolve(name + '.' +ext);
        })
    })
}

module.exports = {uploadFiles}