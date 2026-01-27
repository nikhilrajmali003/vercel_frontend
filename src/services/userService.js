import api from '../config/api';

export const userService = {
  requestOTP: async (email) => {
    try {
      const response = await api.post('/users/otp/request', { email, purpose: 'login' });
      if (process.env.NODE_ENV === 'development' && response.data.data?.otp) {
        console.log('DEBUG: OTP for', email, 'is', response.data.data.otp);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error requesting OTP' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error registering user' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error logging in' };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching users' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating user' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting user' };
    }
  },
};
