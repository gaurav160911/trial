import api from './axios';

// backend returns array directly
export const getClaims = async () => {
  const res = await api.get('/claims');
  return { claims: Array.isArray(res.data) ? res.data : [] };
};

// backend returns { message, claim }
export const triggerClaim = async (type) => {
  const res = await api.post('/claims/trigger', { type });
  return res.data;
};

// backend returns { message, claim, payment }
export const processPayout = async (claimId) => {
  const res = await api.post(`/claims/${claimId}/payout`);
  return res.data;
};
