const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number
});

module.exports = mongoose.model('Sweet', sweetSchema);
