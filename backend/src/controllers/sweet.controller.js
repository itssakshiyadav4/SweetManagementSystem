const Sweet = require('../models/Sweet');

exports.create = async (req, res) => {
  const sweet = await Sweet.create(req.body);
  res.status(201).json(sweet);
};

exports.getAll = async (req, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
};

exports.update = async (req, res) => {
  const sweet = await Sweet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(sweet);
};

exports.remove = async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.purchase = async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

  if (sweet.quantity <= 0) {
    return res.status(400).json({ msg: 'Out of stock' });
  }

  sweet.quantity -= 1;
  await sweet.save();
  res.json(sweet);
};

exports.restock = async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

  sweet.quantity += req.body.amount || 1;
  await sweet.save();
  res.json(sweet);
};

exports.search = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  const filter = {};

  if (name) filter.name = new RegExp(name, 'i');
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(filter);
  res.json(sweets);
};

