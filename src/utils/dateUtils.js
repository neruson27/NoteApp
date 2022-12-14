/**
 * Function to transform a date to local and delete coma
 * 
 * @param {*} date Date | String
 * @returns String
 */
const transforDate = (date) => new Date(date).toLocaleString("en-US").replace(',', '');

export {
  transforDate
}