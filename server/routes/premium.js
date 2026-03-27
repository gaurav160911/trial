const express = require('express');
const router = express.Router();
const { calculatePremium, getFactors } = require('../controllers/premiumController');

router.get('/calculate', calculatePremium);
router.get('/factors', getFactors);

module.exports = router;
