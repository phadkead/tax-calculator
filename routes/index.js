const express = require('express');

const router = express.Router();
const TaxCalculationModel = require('../models/taxCalculationModel');

router.get('/taxes', (req, res) => {
  TaxCalculationModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }
    console.log(`data${data}`);
    res.status(200).send(data);
  });
});

router.post('/taxes', (req, res) => {
  console.log(req.body);
  const taxCalcInstance = new TaxCalculationModel(req.body);
  taxCalcInstance.save((err) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }
    res.status(201).send(req.body);
  });
});

module.exports = router;
