const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const sweetController = require('../controllers/sweet.controller');

// Protected routes
router.post('/', auth, sweetController.create);
router.get('/', auth, sweetController.getAll);
router.get('/search', auth, sweetController.search);

router.put('/:id', auth, sweetController.update);
router.delete('/:id', auth, sweetController.remove);

// Inventory
router.post('/:id/purchase', auth, sweetController.purchase);
router.post('/:id/restock', auth, sweetController.restock);

module.exports = router;
