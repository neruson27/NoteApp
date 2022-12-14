/**
 * Function to parse error messages from api
 * 
 * @param {*} error String
 * @returns String
 */
function errorParse (error) {
  switch(error) {
    case 'USER EXIST':
      return 'El usuario ya existe';
    case 'USER NOT EXIST':
      return 'El usuario no existe';
    case 'PASSWORD INVALID':
      return 'La contraseña no es valida';
    default:
      return 'ha ocurrido un error';
  }
}

export default errorParse;