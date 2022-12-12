const transforDate = (date) => new Date(date).toLocaleString("en-US").replace(',', '');

export {
  transforDate
}