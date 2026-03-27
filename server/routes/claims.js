const express = require('express');
const router = express.Router();
const {
  getClaims,
  getClaimById,
  triggerClaim,
  processPayout
} = require('../controllers/claimsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getClaims);
router.get('/:id', getClaimById);
router.post('/trigger', triggerClaim);
router.post('/:id/payout', processPayout);

module.exports = router;
