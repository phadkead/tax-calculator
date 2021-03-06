/* eslint-disable no-mixed-operators */
const InvalidInputError = require('../errors/InvalidInputError');
const taxSlabService = require('./taxSlabService');
const _ = require('lodash');

function calculateTaxDataForFinancialYear(superPercentage, gross, year) {
  if (superPercentage < 9.5) throw new InvalidInputError('Invalid super amount');
  if (gross <= 0) throw new InvalidInputError('Invalid gross amount');
  console.log(`Calculating tax for ${superPercentage} ${gross} ${year}`);
  return taxSlabService.getTaxSlabsForYear(year)
    .then((taxSlabs) => {
      const taxCriteriaForGross = getTaxSlabForGross(gross, taxSlabs);
      const taxAmount = calculateTaxAmount(gross, taxCriteriaForGross);
      const superannuationAmt = calculateSuper(superPercentage, gross);
      const netWithSuper = getNetWithSuper(gross, taxAmount, superannuationAmt);
      const data = {
        superannuation: superannuationAmt,
        tax: taxAmount,
        net: getNet(gross, taxAmount),
        netWithSuper,
      };
      console.log(`Calculated tax: ${JSON.stringify(data)}`);
      return data;
    });
}

function getGrossAmount(superPercentage, grossWithSuperAmount) {
  const superAmount = Math.round(grossWithSuperAmount / (1 + Number(superPercentage)));
  return grossWithSuperAmount - superAmount;
}

function getNet(gross, taxAmount) {
  return gross - taxAmount;
}

function getNetWithSuper(gross, taxAmount, superAnnuationAmt) {
  return (Number(superAnnuationAmt) + Number(gross)) - Number(taxAmount);
}

function calculateSuper(superAnnuation, gross) {
  return (superAnnuation * gross) / 100;
}

function calculateGrossWithSuper(superAnnuation, gross) {
  return Number(calculateSuper(superAnnuation, gross)) + Number(gross);
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
};
