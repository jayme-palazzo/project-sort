import axios from 'axios';

class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/auth';
    
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

    // Add response interceptor to handle authentication errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear invalid authentication data
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateToken() {
    try {
      const response = await axios.get(`${this.baseURL}/validate`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async register(username, email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/register`, {
        username,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    return new Error(error.response?.data?.message || 'An error occurred');
  }
}

export default new AuthService();
