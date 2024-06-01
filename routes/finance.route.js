const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

router.post('/calculate', surveyController.calculateFinanceScore);

module.exports = router;
