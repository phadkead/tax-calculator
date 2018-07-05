const { expect } = require('chai');
const sinon = require('sinon');

const taxCalculatorService = require('../service/taxCalculatorService');
const taxSlabService = require('../service/taxSlabService');

const taxData = require('../service/mockData');

describe('Testing calculation of tax data', () => {

  beforeEach(() => {
    taxSlabService.getTaxSlabsForYear = sinon.mock().resolves(JSON.parse(taxData));
  });

  it('should throw error for invalid or less than 9.5% superannuation percentage', () => {
    try {
      const superPercentage = 0;
      taxCalculatorService.calculateTaxDataForFinancialYear(superPercentage, 20000, 1999);
    } catch (err) {
      expect(err.message).to.be.equal('Invalid super amount');
    }
  });

  it('should throw error for gross amount <= 0', () => {
    try {
      const superPercentage = 10;
      const gross = 0;
      const expectedTaxData = taxCalculatorService.calculateTaxDataForFinancialYear(superPercentage, gross);
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

    return taxCalculatorService.calculateTaxDataForFinancialYear(10, 20000, '2016-17')
      .then((allTaxes) => {
        expect(allTaxes).to.deep.equal(expectedTaxData);
      });
  });
});

describe('Testing calculated data for gross + super ', () => {
  beforeEach(() => {
    taxSlabService.getTaxSlabsForYear = sinon.mock().resolves(JSON.parse(taxData));
  });

  it('should calculate gross amount out of gross with super amount', () => {
    expect(taxCalculatorService.getGrossAmount(10, 22000)).to.equal(19800);
  });

  it('should return object with correct tax calculations', () => {
    const expectedTaxData = {
      superannuation: 1980,
      gross: 19800,
      tax: 304,
      net: 19496,
      netWithSuper: 21476,
    };

    return taxCalculatorService.getAllTaxesForGrossWithSuperAmount(10, 22000, '2016-17')
      .then((allTaxes) => {
        expect(allTaxes).to.deep.equal(expectedTaxData);
      });
  });

});

describe('Testing calculated data for gross ', () => {

  beforeEach(() => {
    taxSlabService.getTaxSlabsForYear = sinon.mock().resolves(JSON.parse(taxData));
  });

  it('should calculate gross amount out of gross with super amount', () => {
    expect(taxCalculatorService.getGrossAmount(10, 22000)).to.equal(19800);
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

describe('Tax calculation', () => {

  it('should calculate tax amount for minimum tax applied 0', () => {
    const taxSlabInput = {
      lowerLimit: 0,
      upperLimit: 18200,
      taxPerDollar: 0,
      minimumInitialTax: 0,
    };
    expect(taxCalculatorService.calculateTaxAmount(20000, taxSlabInput)).to.equal(0);
  });

  it('should calculate tax amount for lowerlimit > 0, minimum tax applied 0', () => {
    const taxSlabInput = {
      lowerLimit: 18200,
      upperLimit: 37000,
      taxPerDollar: 0.19,
      minimumInitialTax: 0,
    };
    expect(taxCalculatorService.calculateTaxAmount(20000, taxSlabInput)).to.equal(342);
  });

  it('should calculate tax amount for minimum lowerlimit > 0, tax applied > 0', () => {
    const taxSlabInput = {
      lowerLimit: 37000,
      upperLimit: 87000,
      taxPerDollar: 0.325,
      minimumInitialTax: 3572,
    };
    expect(taxCalculatorService.calculateTaxAmount(80000, taxSlabInput)).to.equal(17547);
  });
});

describe('Find out correct tax slab for gross', () => {

  it('should get correct tax slab for lowerlimit 0,  and upperlimit > 0', () => {
    const expectedTaxSlab = {
      lowerLimit: 0,
      upperLimit: 18200,
      taxPerDollar: 0,
      minimumInitialTax: 0,
    };
    expect(taxCalculatorService.getTaxSlabForGross(10, JSON.parse(taxData))).to.deep.equal(expectedTaxSlab);
  });

  it('should get correct tax slab for lowerlimit > 0,  and upperlimit > 0', () => {
    const expectedTaxSlab = {
      lowerLimit: 37000,
      upperLimit: 87000,
      taxPerDollar: 0.325,
      minimumInitialTax: 3572,
    };
    expect(taxCalculatorService.getTaxSlabForGross(80000, JSON.parse(taxData))).to.deep.equal(expectedTaxSlab);
  });
});

describe('Testing calculation of super ', () => {
  it('should calculate super amount', () => {
    expect(taxCalculatorService.calculateSuper(10, 20000)).to.equal(2000);
  });
});

describe('Testing calculation of gross + super ', () => {
  it('should calculate gross with super amount', () => {
    expect(taxCalculatorService.calculateGrossWithSuper(10, 20000)).to.equal(22000);
  });
});

describe('Testing  calculation of net + super ', () => {
  it('should calculate net amount', () => {
    expect(taxCalculatorService.getNetWithSuper(20000, 500, 1000)).to.equal(20500);
  });
});

