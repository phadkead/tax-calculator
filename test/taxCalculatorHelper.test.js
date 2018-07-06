const { expect } = require('chai');
const sinon = require('sinon');

const taxCalculatorHelper = require('../service/taxCalculatorHelper');
const taxSlabService = require('../service/taxSlabService');

const taxData = require('../service/mockData');

describe('Find out correct tax slab for gross', () => {

  it('should get correct tax slab for lowerlimit 0,  and upperlimit > 0', () => {
    const expectedTaxSlab = {
      lowerLimit: 0,
      upperLimit: 18200,
      taxPerDollar: 0,
      minimumInitialTax: 0,
    };
    expect(taxCalculatorHelper.getTaxSlabForGross(10, JSON.parse(taxData))).to.deep.equal(expectedTaxSlab);
  });

  it('should get correct tax slab for lowerlimit > 0,  and upperlimit > 0', () => {
    const expectedTaxSlab = {
      lowerLimit: 37000,
      upperLimit: 87000,
      taxPerDollar: 0.325,
      minimumInitialTax: 3572,
    };
    expect(taxCalculatorHelper.getTaxSlabForGross(80000, JSON.parse(taxData))).to.deep.equal(expectedTaxSlab);
  });
});

describe('Testing calculation of super ', () => {
  it('should calculate super amount', () => {
    expect(taxCalculatorHelper.calculateSuper(10, 20000)).to.equal(2000);
  });
});

describe('Testing calculation of gross + super ', () => {
  it('should calculate gross with super amount', () => {
    expect(taxCalculatorHelper.calculateGrossWithSuper(10, 20000)).to.equal(22000);
  });
});

describe('Testing  calculation of net + super ', () => {
  it('should calculate net amount', () => {
    expect(taxCalculatorHelper.getNetWithSuper(20000, 500, 1000)).to.equal(20500);
  });
});

describe('Testing  gross calculation ', () => {
  it('should calculate gross amount out of gross with super amount', () => {
    expect(taxCalculatorHelper.getGrossAmount(10, 22000)).to.equal(19800);
  });
});

describe('Testing calculation of tax data', () => {

  beforeEach(() => {
    taxSlabService.getTaxSlabsForYear = sinon.mock().resolves(JSON.parse(taxData));
  });

  it('should throw error for invalid or less than 9.5% superannuation percentage', () => {
    try {
      const superPercentage = 0;
      taxCalculatorHelper.calculateTaxDataForFinancialYear(superPercentage, 20000, 1999);
    } catch (err) {
      expect(err.message).to.be.equal('Invalid super amount');
    }
  });

  it('should throw error for gross amount <= 0', () => {
    try {
      const superPercentage = 10;
      const gross = 0;
      const expectedTaxData = taxCalculatorHelper.calculateTaxDataForFinancialYear(superPercentage, gross);
      expect(expectedTaxData).to.equal(2000);
    } catch (err) {
      expect(err.message).to.be.equal('Invalid gross amount');
    }
  });

  it('should return object with correct tax calculations', () => {
    const expectedTaxData = {
      superannuation: 2000,
      tax: 342,
      net: 19658,
      netWithSuper: 21658,
    };

    return taxCalculatorHelper.calculateTaxDataForFinancialYear(10, 20000, '2016-17')
      .then((allTaxes) => {
        expect(allTaxes).to.deep.equal(expectedTaxData);
      });
  });
});

describe('Tax calculation', () => {

  it('should calculate tax amount for minimum tax applied 0', () => {
    const taxSlabInput = {
      lowerLimit: 0,
      upperLimit: 18200,
      taxPerDollar: 0,
      minimumInitialTax: 0,
    };
    expect(taxCalculatorHelper.calculateTaxAmount(20000, taxSlabInput)).to.equal(0);
  });

  it('should calculate tax amount for lowerlimit > 0, minimum tax applied 0', () => {
    const taxSlabInput = {
      lowerLimit: 18200,
      upperLimit: 37000,
      taxPerDollar: 0.19,
      minimumInitialTax: 0,
    };
    expect(taxCalculatorHelper.calculateTaxAmount(20000, taxSlabInput)).to.equal(342);
  });

  it('should calculate tax amount for minimum lowerlimit > 0, tax applied > 0', () => {
    const taxSlabInput = {
      lowerLimit: 37000,
      upperLimit: 87000,
      taxPerDollar: 0.325,
      minimumInitialTax: 3572,
    };
    expect(taxCalculatorHelper.calculateTaxAmount(80000, taxSlabInput)).to.equal(17547);
  });
});
