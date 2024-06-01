const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

// Route to save user data
router.post('/one', surveyController.saveSurvey1);
router.get('/one', surveyController.getSurvey1);

module.exports = router;