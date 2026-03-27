import api from './axios';

export const sendOTP = async (phone) => {
  const res = await api.post('/auth/send-otp', { phone });
  return res.data;
};

export const verifyOTP = async (phone, otp) => {
  const res = await api.post('/auth/verify-otp', { phone, otp });
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put('/auth/profile', data);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};
