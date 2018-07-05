const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taxCalculation = new Schema({
  superannuation: 'number',
  gross: 'number',
  tax: 'number',
  net: 'number',
  netWithSuper: 'number',
  grossWithSuper: 'number',
  userId: 'ObjectId',
});

module.exports = mongoose.model('TaxCalculation', taxCalculation);
