require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gigshield';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Policy.deleteMany({});
    await Claim.deleteMany({});

    // Create demo users
    const users = await User.insertMany([
      {
        phone: '9999999999',
        name: 'Raju Kumar',
        aadhaarLast4: '1234',
        platform: 'Swiggy',
        partnerId: 'SWG-001',
        pincode: '560001',
        zone: 'high',
        loyaltyMonths: 12,
        riskScore: 0.4,
        isVerified: true
      },
      {
        phone: '8888888888',
        name: 'Priya Sharma',
        aadhaarLast4: '5678',
        platform: 'Zomato',
        partnerId: 'ZMT-042',
        pincode: '400001',
        zone: 'medium',
        loyaltyMonths: 6,
        riskScore: 0.5,
        isVerified: true
      }
    ]);

    console.log(`Seeded ${users.length} users`);

    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);

    // Create active policies
    const policies = await Policy.insertMany([
      {
        userId: users[0]._id,
        plan: 'Premium',
        premium: 72,
        coverage: 20000,
        startDate: now,
        endDate: weekLater,
        status: 'active',
        premiumBreakdown: {
          basePremium: 79,
          zoneMultiplier: 1.2,
          seasonalFactor: 1.0,
          riskAdjustment: 0.96,
          loyaltyDiscount: 12,
          finalPremium: 72
        }
      },
      {
        userId: users[1]._id,
        plan: 'Standard',
        premium: 49,
        coverage: 10000,
        startDate: now,
        endDate: weekLater,
        status: 'active',
        premiumBreakdown: {
          basePremium: 49,
          zoneMultiplier: 1.0,
          seasonalFactor: 1.0,
          riskAdjustment: 1.0,
          loyaltyDiscount: 6,
          finalPremium: 49
        }
      }
    ]);

    console.log(`Seeded ${policies.length} policies`);

    // Create sample claims
    const claims = await Claim.insertMany([
      {
        userId: users[0]._id,
        policyId: policies[0]._id,
        type: 'rain',
        triggerCondition: 'Heavy rainfall detected (>30mm)',
        triggerValue: 45,
        amount: 10000,
        status: 'paid',
        fraudScore: 0.0,
        fraudSignals: [],
        autoTriggered: true,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: users[0]._id,
        policyId: policies[0]._id,
        type: 'aqi',
        triggerCondition: 'Hazardous AQI level (>200)',
        triggerValue: 280,
        amount: 6000,
        status: 'approved',
        fraudScore: 0.1,
        fraudSignals: ['Platform activity not fully verified'],
        autoTriggered: true
      },
      {
        userId: users[1]._id,
        policyId: policies[1]._id,
        type: 'rain',
        triggerCondition: 'Heavy rainfall detected (>30mm)',
        triggerValue: 45,
        amount: 5000,
        status: 'paid',
        fraudScore: 0.0,
        fraudSignals: [],
        autoTriggered: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log(`Seeded ${claims.length} claims`);
    console.log('\nDemo credentials:');
    console.log('  Phone: 9999999999  OTP: 123456');
    console.log('  Phone: 8888888888  OTP: 123456');
    console.log('\nSeeding complete!');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
