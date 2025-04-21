import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class LocationService {
  static async createLocation(name) {
    try {
      const response = await axios.post(`${API_URL}/locations`, { name });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create location');
    }
  }

  static async getAllLocations() {
    try {
      const response = await axios.get(`${API_URL}/locations`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch locations');
    }
  }
}

export default LocationService; 