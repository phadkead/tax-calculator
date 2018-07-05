const taxData = require('../service/mockData');

function getTaxSlabsForYear(year) {
  console.log('Mock service to get data for year ', year);
  return Promise.resolve(JSON.parse(taxData));
}


module.exports = {
  getTaxSlabsForYear,
};
