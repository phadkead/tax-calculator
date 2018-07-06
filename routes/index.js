const express = require('express');

const router = express.Router();
const TaxCalculationModel = require('../models/taxCalculationModel');
const taxCalculatorService = require('../service/taxCalculatorService');

router.get('/taxes', (req, res) => {

  TaxCalculationModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500);
    }
    res.status(200).send(data);
  });
});

router.post('/taxes/calculate', (req, res) => {
  console.log(req.body);
  taxCalculatorService.saveTaxCalculationData(req.body)
    .then((taxCalculation) => {
      console.log(`${taxCalculation}taxCalculation`);
      res.status(201).send(taxCalculation);
    }).catch((err) => {
      res.status(500).send(err);
    });
});


module.exports = router;
