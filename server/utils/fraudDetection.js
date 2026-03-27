const detectFraud = (claim, user) => {
  let fraudScore = 0;
  const fraudSignals = [];

  // Signal 1: Multiple claims in 7 days (simulated)
  if (Math.random() < 0.1) {
    fraudScore += 0.3;
    fraudSignals.push('Multiple claims in 7 days');
  }

  // Signal 2: Claim timing anomaly (midnight to 4am)
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 4) {
    fraudScore += 0.2;
    fraudSignals.push('Unusual claim timing (midnight-4am)');
  }

  // Signal 3: GPS mismatch (simulated)
  if (Math.random() < 0.05) {
    fraudScore += 0.4;
    fraudSignals.push('GPS location mismatch');
  }

  // Signal 4: Platform activity not verified
  if (!user.isVerified) {
    fraudScore += 0.1;
    fraudSignals.push('Platform activity not fully verified');
  }

  fraudScore = Math.min(1, parseFloat(fraudScore.toFixed(2)));
  return { fraudScore, fraudSignals };
};

module.exports = { detectFraud };
