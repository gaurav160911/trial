const Policy = require('../models/Policy');
const { calculatePremium } = require('../utils/premiumEngine');

const getCurrentPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ userId: req.user._id, status: 'active' }).sort({ createdAt: -1 });
    if (!policy) return res.status(404).json({ message: 'No active policy found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPolicyHistory = async (req, res) => {
  try {
    const policies = await Policy.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const subscribePolicy = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['Basic', 'Standard', 'Premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan. Choose Basic, Standard, or Premium.' });
    }

    const user = req.user;
    const breakdown = calculatePremium(plan, user.zone, user.riskScore, user.loyaltyMonths);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    // Cancel any existing active policy
    await Policy.updateMany({ userId: user._id, status: 'active' }, { status: 'cancelled' });

    const policy = await Policy.create({
      userId: user._id,
      plan,
      premium: breakdown.finalPremium,
      coverage: breakdown.coverage,
      startDate,
      endDate,
      status: 'active',
      premiumBreakdown: {
        basePremium: breakdown.basePremium,
        zoneMultiplier: breakdown.zoneMultiplier,
        seasonalFactor: breakdown.seasonalFactor,
        riskAdjustment: breakdown.riskAdjustment,
        loyaltyDiscount: breakdown.loyaltyDiscount,
        finalPremium: breakdown.finalPremium
      }
    });

    res.status(201).json({ message: 'Policy activated', policy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ _id: req.params.id, userId: req.user._id });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    if (policy.status !== 'active') return res.status(400).json({ message: 'Policy is not active' });

    policy.status = 'cancelled';
    await policy.save();
    res.json({ message: 'Policy cancelled', policy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCurrentPolicy, getPolicyHistory, subscribePolicy, cancelPolicy };
