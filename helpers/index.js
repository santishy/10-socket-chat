const dbValidator = require('./db-validators');
const generateToken = require('./generate-token');
const verifyGoogleToken = require('./verify-google-sign-ing');
const uploadFile = require ('./upload-file');

module.exports = {
    ...dbValidator,
    ...generateToken,
    ...verifyGoogleToken,
    ...uploadFile
}