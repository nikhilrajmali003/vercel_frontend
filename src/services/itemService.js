import api from '../config/api';

// Helper to prepare data for upload
const prepareData = (itemData) => {
  const hasFiles = itemData.images && itemData.images.some(img => img instanceof File);

  if (hasFiles) {
    const formData = new FormData();
    Object.keys(itemData).forEach(key => {
      if (key === 'images') {
        itemData.images.forEach(image => {
          if (image instanceof File) {
            formData.append('images', image);
          } else {
            // Existing images as URLs
            formData.append('images', image);
          }
        });
      } else if (itemData[key] !== null && itemData[key] !== undefined) {
        formData.append(key, itemData[key]);
      }
    });
    return { data: formData, headers: { 'Content-Type': 'multipart/form-data' } };
  }
  return { data: itemData };
};

export const itemService = {
  getAllItems: async (params = {}) => {
    try {
      const response = await api.get('/items', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching items' };
    }
  },

  getItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching item' };
    }
  },

  createItem: async (itemData) => {
    try {
      const { data, headers } = prepareData(itemData);
      const response = await api.post('/items', data, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error creating item' };
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const { data, headers } = prepareData(itemData);
      const response = await api.put(`/items/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating item' };
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting item' };
    }
  },

  updateItemStatus: async (id, status) => {
    try {
      const response = await api.patch(`/items/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating item status' };
    }
  },
};
