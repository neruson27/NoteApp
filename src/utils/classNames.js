/**
 * Function to join multiple classes
 * 
 * @param  {...any} classes String
 * @returns String
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default classNames;