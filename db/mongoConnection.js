const mongoose = require('mongoose');

function createConnection() {
  const mongoDB = 'mongodb://127.0.0.1/tax_calculator';
  mongoose.connect(mongoDB);
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  console.log('Connection established')
}

module.exports = {
  createConnection,
};
