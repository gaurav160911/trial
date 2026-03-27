import api from './axios';

export const calculatePremium = async (plan, zone, riskScore, loyaltyMonths) => {
  const res = await api.post('/premium/calculate', { plan, zone, riskScore, loyaltyMonths });
  return res.data;
};

export const getFactors = async () => {
  const res = await api.get('/premium/factors');
  return res.data;
};
