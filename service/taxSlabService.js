const taxData = require('../service/mockData');

function getTaxSlabsForYear(year) {
  return Promise.resolve(JSON.parse(taxData));
}


module.exports = {
  getTaxSlabsForYear,
};