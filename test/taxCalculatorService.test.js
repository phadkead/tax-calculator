const { expect } = require('chai');
const sinon = require('sinon');

const taxCalculatorService = require('../service/taxCalculatorService');
const taxSlabService = require('../service/taxSlabService');

const taxData = require('../service/mockData');

describe('Testing calculated data for gross + super ', () => {
  beforeEach(() => {
    taxSlabService.getTaxSlabsForYear = sinon.mock().resolves(JSON.parse(taxData));
  });

  it('should return object with correct tax calculations', () => {
    const expectedTaxData = {
      superannuation: 2000,
      gross: 20000,
      tax: 342,
      net: 19658,
      netWithSuper: 21658,
    };

    return taxCalculatorService.getAllTaxesForGrossWithSuperAmount(10, 22000, '2016-17')
      .then((allTaxes) => {
        expect(expectedTaxData).to.deep.equal(allTaxes);
      });
  });
});

describe('Testing calculated data for gross ', () => {

  beforeEach(() => {
    taxSlabService.getTaxSlabsForYear = sinon.mock().resolves(JSON.parse(taxData));
  });

  it('should return object with correct tax calculations', () => {
    const expectedTaxData = {
      grossWithSuper: 24200,
      net: 21278,
      netWithSuper: 23478,
      superannuation: 2200,
      tax: 722,
    };

    return taxCalculatorService.getAllTaxesForGrossAmount(10, 22000, '2016-17')
      .then((allTaxes) => {
        expect(allTaxes).to.deep.equal(expectedTaxData);
      });
  });
});

