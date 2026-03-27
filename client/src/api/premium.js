import api from './axios';

export const calculatePremium = async (plan, zone, riskScore, loyaltyMonths) => {
  // Backend uses GET with query params; capitalize plan name
  const planName = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Standard';
  const res = await api.get('/premium/calculate', {
    params: { plan: planName, zone, riskScore, loyaltyMonths },
  });
  return res.data;
};

export const getFactors = async () => {
  const res = await api.get('/premium/factors');
  return res.data;
};
