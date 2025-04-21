import axios from 'axios';

class CategoryService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/categories';
    // Add axios interceptor to include token in all requests
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async getCategories() {
    try {
      const response = await axios.get(this.baseURL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCategory(name) {
    try {
      const response = await axios.post(this.baseURL, { name });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(id) {
    try {
      const response = await axios.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    return new Error(error.response?.data?.message || 'An error occurred');
  }
}

export default new CategoryService();
