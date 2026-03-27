const express = require('express');
const router = express.Router();
const {
  getCurrentPolicy,
  getPolicyHistory,
  subscribePolicy,
  cancelPolicy
} = require('../controllers/policyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/current', getCurrentPolicy);
router.get('/history', getPolicyHistory);
router.post('/subscribe', subscribePolicy);
router.patch('/:id/cancel', cancelPolicy);

module.exports = router;
