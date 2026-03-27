const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  type: { type: String, enum: ['rain', 'aqi', 'accident', 'health'], required: true },
  triggerCondition: { type: String, required: true },
  triggerValue: { type: Number },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'paid', 'rejected'], default: 'pending' },
  fraudScore: { type: Number, default: 0 },
  fraudSignals: [String],
  description: { type: String, default: '' },
  autoTriggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }
});

module.exports = mongoose.model('Claim', claimSchema);
