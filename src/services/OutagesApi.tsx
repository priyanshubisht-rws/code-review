import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getOutagesList = async (page = 1, limit = 10, title = '', sort = 'createdAt', order = 'DESC', filter = '') => {
    try {
      const response = await axios.get(`${API_URL}/outage`, {
        params: {
          page: page,
          limit: limit,
          title: title,           
          sort: sort,             
          order: order,           
          filter: filter
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data && response.data.outage) {
        console.log(response.data.outage,"api");
        
        return {
          outage :response.data.outage || [],
          totalOutages: response.data.totalOutages,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
        };
      } else {
        console.error('Failed to fetch outage: No outages found');
        return { outage: [], totalPages: 0, currentPage: 1, totalPosts: 0 };
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.warn('No outage found (404). Returning empty outage array.');
          return { outage: [], totalPages: 0, currentPage: 1, totalPosts: 0 }; 
        } else {
          console.error('Error fetching outage:', error.response.data.message);
          return { error: error.response.data.message, outage: [] }; 
        }
      } else {
        console.error('Error fetching outage:', error.message);
        return { error: 'An error occurred while trying to fetch outage', outage: [] }; 
      }
    }
  };
  export const createOutages = async (outageData:any) => {
    try {
      const response = await axios.post(`${API_URL}/outage`, outageData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      return { success: true, outage: response.data };
    } catch (error:any) {
      if (error.response) {
        console.error('Error creating outage:', error.response.data.message);
        return { success: false, error: error.response.data.message };
      } else {
        console.error('Error creating outage:', error.message);
        return { success: false, error: 'An error occurred while trying to create outage' };
      }
    }
  };

  export const updateOutages = async (id:any, outageData:any) => {
    try {
      const response = await axios.post(`${API_URL}/outage/${id}`, outageData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      return { success: true, outage: response.data };
    } catch (error:any) {
      if (error.response) {
        console.error('Error updating outage:', error.response.data.message);
        return { success: false, error: error.response.data.message };
      } else {
        console.error('Error updating outage:', error.message);
        return { success: false, error: 'An error occurred while trying to update outage' };
      }
    }
  };
  export const deleteOutages = async (id:any) => {
    try {
      const response = await axios.delete(`${API_URL}/outage/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data; 
    } catch (error:any) {
      console.error('Error deleting Outage:', error);
      return { error: error.response ? error.response.data.message : 'An unexpected error occurred' };
    }
  };
  
  export const toggleOutages = async (id:any, isActive:any) => {
    try {
      const response = await axios.post(`${API_URL}/outage/toggle/${id}`,  isActive , {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error:any) {
      console.error('Error toggling Outage status:', error);
      return { error: error.response ? error.response.data.message : 'An unexpected error occurred' };
    }
  };