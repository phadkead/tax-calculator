const taxCalculatorHelper = require('./taxCalculatorHelper');
const InvalidInputError = require('../errors/InvalidInputError');
const TaxCalculationModel = require('../models/taxCalculationModel');

function saveTaxCalculationData(reqData) {
  return getAllTaxData(reqData)
    .then((taxCalculation) => {
      const taxCalcInstance = new TaxCalculationModel(taxCalculation);
      return taxCalcInstance.save();
    });
}

function getAllTaxData(reqData) {
  if (reqData.gross) {
    return getAllTaxesForGrossAmount(reqData.superAnnuation, reqData.gross, reqData.finyear);
  } else if (reqData.grossWithSuper) {
    return getAllTaxesForGrossWithSuperAmount(reqData.superAnnuation, reqData.grossWithSuper, reqData.finyear);
  }
  throw new InvalidInputError('gross or gross with super amount not present');
}

function getAllTaxesForGrossWithSuperAmount(superPercentage, grossWithSuperAmount, year) {
  const grossAmount = taxCalculatorHelper.getGrossAmount(superPercentage, grossWithSuperAmount);
  return taxCalculatorHelper.calculateTaxDataForFinancialYear(superPercentage, grossAmount, year)
    .then((data) => {
      data.gross = grossAmount;
      return Promise.resolve(data);
    });
}

function getAllTaxesForGrossAmount(superPercentage, gross, year) {
  return taxCalculatorHelper.calculateTaxDataForFinancialYear(superPercentage, gross, year)
    .then((data) => {
      data.grossWithSuper = taxCalculatorHelper.calculateGrossWithSuper(superPercentage, gross);
      return Promise.resolve(data);
    });
}

module.exports = {
  getAllTaxesForGrossWithSuperAmount,
  getAllTaxesForGrossAmount,
  saveTaxCalculationData,
};
