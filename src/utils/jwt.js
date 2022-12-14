import jwt_decode from 'jwt-decode';

/**
 * Function to decode a jwt
 * 
 * @param {*} token String
 * @returns Object
 */
function decodeJWT(token) {
  return jwt_decode(token)
}

export {
  decodeJWT
}