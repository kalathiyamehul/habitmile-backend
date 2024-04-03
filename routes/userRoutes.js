const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/financeController');

// Route to save user data
router.post('/save', FinanceController.calculateFinanceScore);

module.exports = router;