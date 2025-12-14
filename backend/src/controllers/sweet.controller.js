const Sweet = require('../models/Sweet');

exports.create = async (req, res) => {
  const sweet = await Sweet.create(req.body);
  res.status(201).json(sweet);
};

exports.getAll = async (req, res) => {
  res.json(await Sweet.find());
};

exports.update = async (req, res) => {
  res.json(await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

exports.remove = async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.purchase = async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (sweet.quantity <= 0) return res.status(400).json({ msg: 'Out of stock' });

  sweet.quantity -= 1;
  await sweet.save();
  res.json(sweet);
};

exports.restock = async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  sweet.quantity += req.body.amount;
  await sweet.save();
  res.json(sweet);
};
