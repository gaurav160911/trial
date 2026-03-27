import api from './axios';

export const getCurrentPolicy = async () => {
  const res = await api.get('/policies/current');
  return res.data;
};

export const getPolicyHistory = async () => {
  const res = await api.get('/policies/history');
  return res.data;
};

export const subscribePolicy = async (plan) => {
  const res = await api.post('/policies/subscribe', { plan });
  return res.data;
};

export const cancelPolicy = async (id) => {
  const res = await api.delete(`/policies/${id}`);
  return res.data;
};
