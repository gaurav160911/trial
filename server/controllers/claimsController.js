const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const { simulateTrigger } = require('../utils/claimTrigger');
const { detectFraud } = require('../utils/fraudDetection');

const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user._id })
      .populate('policyId', 'plan coverage')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('policyId', 'plan coverage startDate endDate');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const triggerClaim = async (req, res) => {
  try {
    const { type } = req.body;
    if (!['rain', 'aqi', 'heat', 'accident', 'health'].includes(type)) {
      return res.status(400).json({ message: 'Invalid claim type' });
    }

    const policy = await Policy.findOne({ userId: req.user._id, status: 'active' });
    if (!policy) return res.status(404).json({ message: 'No active policy found' });

    const triggerData = simulateTrigger(type, policy);
    const { fraudScore, fraudSignals } = detectFraud({ type }, req.user);

    // Auto-reject if fraud score is too high
    const claimStatus = fraudScore >= 0.7 ? 'rejected' : 'approved';
    const paidAt = claimStatus === 'approved' ? new Date() : undefined;

    const claim = await Claim.create({
      userId: req.user._id,
      policyId: policy._id,
      ...triggerData,
      status: claimStatus,
      fraudScore,
      fraudSignals,
      paidAt
    });

    res.status(201).json({
      message: claimStatus === 'approved' ? 'Claim triggered and approved' : 'Claim rejected due to fraud signals',
      claim
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const processPayout = async (req, res) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user._id });
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.status !== 'approved') {
      return res.status(400).json({ message: `Claim is ${claim.status}, cannot process payout` });
    }

    // Mock Razorpay payout
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    claim.status = 'paid';
    claim.paidAt = new Date();
    await claim.save();

    res.json({
      message: 'Payout processed successfully',
      claim,
      payment: {
        paymentId,
        amount: claim.amount,
        currency: 'INR',
        method: 'UPI',
        status: 'success',
        paidAt: claim.paidAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getClaims, getClaimById, triggerClaim, processPayout };
