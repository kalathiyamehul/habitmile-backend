const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

router.post('/one', surveyController.saveSurvey1);
router.post('/download', surveyController.saveDownload);
router.get('/one', surveyController.getSurvey1);

module.exports = router;