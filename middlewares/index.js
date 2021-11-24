/**
 * se pone ../middleware en la ruta, ya que el archivo se manda llamar desde usuarios y esta en otro directorio.
 */
const hasErrors = require('../middlewares/hasErrors');
const validateJWT = require('../middlewares/ValidateJWT');
const validateRole = require('../middlewares/ValidateRole')

/**
 * el operador ...exporta todo lo que contiene el archivo
 */
module.exports = {
    ...hasErrors,
    ...validateJWT,
    ...validateRole
}