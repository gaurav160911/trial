const triggerConditions = {
  rain: {
    threshold: 30, // mm rainfall
    description: 'Heavy rainfall detected (>30mm)',
    amountPercent: 0.5 // 50% of coverage
  },
  aqi: {
    threshold: 200, // AQI
    description: 'Hazardous AQI level (>200)',
    amountPercent: 0.3 // 30% of coverage
  },
  heat: {
    threshold: 42, // Celsius
    description: 'Extreme heat warning (>42°C)',
    amountPercent: 0.25
  }
};

const simulateTrigger = (type, policy) => {
  const condition = triggerConditions[type];
  if (!condition) throw new Error('Unknown trigger type');

  const triggerValue = type === 'rain' ? 45 : type === 'aqi' ? 280 : 44;
  const claimAmount = Math.round(policy.coverage * condition.amountPercent);

  return {
    type,
    triggerCondition: condition.description,
    triggerValue,
    amount: claimAmount,
    autoTriggered: true
  };
};

module.exports = { simulateTrigger, triggerConditions };
