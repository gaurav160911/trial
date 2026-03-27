import api from './axios';

export const getClaims = async () => {
  const res = await api.get('/claims');
  return res.data;
};

export const triggerClaim = async (type) => {
  const res = await api.post('/claims/trigger', { type });
  return res.data;
};

export const processPayout = async (claimId) => {
  const res = await api.post(`/claims/${claimId}/payout`);
  return res.data;
};
