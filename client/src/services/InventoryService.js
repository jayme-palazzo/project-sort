import axios from 'axios';

class InventoryService {
    constructor() {
      this.baseURL = 'http://localhost:5000/api/inventory';
    }
  
    async getAllItems() {
      try {
        const response = await axios.get(this.baseURL);
        return response.data;
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    async getItem(id) {
      try {
        const response = await axios.get(`${this.baseURL}/${id}`);
        return response.data;
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    async createItem(item) {
      try {
        const response = await axios.post(this.baseURL, item);
        return response.data;
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    async updateItem(id, item) {
      try {
        const response = await axios.put(`${this.baseURL}/${id}`, item);
        return response.data;
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    async deleteItem(id) {
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
  
  export default new InventoryService();