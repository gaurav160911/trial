import api from './axios';

// backend returns the policy object directly
export const getCurrentPolicy = async () => {
  const res = await api.get('/policies/current');
  return { policy: res.data };
};

// backend returns array directly
export const getPolicyHistory = async () => {
  const res = await api.get('/policies/history');
  return Array.isArray(res.data) ? res.data : [];
};

// backend returns { message, policy }
export const subscribePolicy = async (plan) => {
  const res = await api.post('/policies/subscribe', { plan });
  return res.data;
};

// backend route is PATCH /:id/cancel
export const cancelPolicy = async (id) => {
  const res = await api.patch(`/policies/${id}/cancel`);
  return res.data;
};
