const InvalidInputError = require('../errors/InvalidInputError');
const taxSlabService = require('./taxSlabService');
const _ = require('lodash');


function getAllTaxesForGrossWithSuperAmount(superPercentage, grossWithSuperAmount, year) {
  const grossAmount = getGrossAmount(superPercentage, grossWithSuperAmount);
  return calculateTaxDataForFinancialYear(superPercentage, grossAmount, year)
    .then((data) => {
      data.gross = grossAmount;
      return data;
    });
}

function getAllTaxesForGrossAmount(superPercentage, gross, year) {
  return calculateTaxDataForFinancialYear(superPercentage, gross, year)
    .then((data) => {
      data.grossWithSuper = calculateGrossWithSuper(superPercentage, gross);
      return data;
    });
}

function getGrossAmount(superPercentage, grossWithSuperAmount) {
  const superAnnuationAmount = (grossWithSuperAmount * superPercentage) / 100;
  return grossWithSuperAmount - superAnnuationAmount;
}

function calculateTaxDataForFinancialYear(superPercentage, gross, year) {
  if (superPercentage < 9.5) throw new InvalidInputError('Invalid super amount');
  if (gross <= 0) throw new InvalidInputError('Invalid gross amount');

  return taxSlabService.getTaxSlabsForYear(year)
    .then((taxSlabs) => {
      const taxCriteriaForGross = getTaxSlabForGross(gross, taxSlabs);
      const taxAmount = calculateTaxAmount(gross, taxCriteriaForGross);
      const superannuationAmt = calculateSuper(superPercentage, gross);
      const data = {
        superannuation: superannuationAmt,
        tax: taxAmount,
        net: getNet(gross, taxAmount),
        netWithSuper: getNetWithSuper(gross, taxAmount, superannuationAmt),
      };
      console.log(`Calculated tax: ${JSON.stringify(data)}`);
      return data;
    });
}

function getNet(gross, taxAmount) {
  return gross - taxAmount;
}

function getNetWithSuper(gross, taxAmount, superAnnuationAmt) {
  return superAnnuationAmt + gross - taxAmount;
}

function calculateSuper(superAnnuation, gross) {
  return (superAnnuation * gross) / 100;
}

function calculateGrossWithSuper(superAnnuation, gross) {
  return calculateSuper(superAnnuation, gross) + gross;
}

function getTaxSlabForGross(gross, taxslabs) {
  return _.find(taxslabs, taxSlab => taxSlab.lowerLimit < gross && taxSlab.upperLimit >= gross);
}

function calculateTaxAmount(gross, taxSlabObject) {
  const rangeLowerLimit = taxSlabObject.lowerLimit;
  const taxPerDollar = taxSlabObject.taxPerDollar;
  const minimumInitialTax = taxSlabObject.minimumInitialTax;
  return ((gross - rangeLowerLimit) * taxPerDollar) + minimumInitialTax;
}

module.exports = {
  calculateTaxDataForFinancialYear,
  calculateSuper,
  calculateGrossWithSuper,
  calculateTaxAmount,
  getTaxSlabForGross,
  getNetWithSuper,
  getGrossAmount,
  getAllTaxesForGrossWithSuperAmount,
  getAllTaxesForGrossAmount,
};
