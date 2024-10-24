import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getNewsList = async (page = 1, limit = 10, title = '', sort = 'createdAt', order = 'DESC', filter = '') => {
    try {
      const response = await axios.get(`${API_URL}/news`, {
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
  
      if (response.data && response.data.news) {
        console.log(response.data.news,"api");
        
        return {
          news :response.data.news || [],
          totalNews: response.data.totalNews,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
        };
      } else {
        console.error('Failed to fetch news: No newss found');
        return { news: [], totalPages: 0, currentPage: 1, totalPosts: 0 };
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.warn('No news found (404). Returning empty news array.');
          return { news: [], totalPages: 0, currentPage: 1, totalPosts: 0 }; 
        } else {
          console.error('Error fetching news:', error.response.data.message);
          return { error: error.response.data.message, news: [] }; 
        }
      } else {
        console.error('Error fetching news:', error.message);
        return { error: 'An error occurred while trying to fetch news', news: [] }; 
      }
    }
  };
  export const createNews = async (newsData:any) => {
    try {
      const response = await axios.post(`${API_URL}/news`, newsData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      return { success: true, news: response.data };
    } catch (error:any) {
      if (error.response) {
        console.error('Error creating news:', error.response.data.message);
        return { success: false, error: error.response.data.message };
      } else {
        console.error('Error creating news:', error.message);
        return { success: false, error: 'An error occurred while trying to create news' };
      }
    }
  };

  export const updateNews = async (id:any, newsData:any) => {
    try {
      const response = await axios.post(`${API_URL}/news/${id}`, newsData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      return { success: true, news: response.data };
    } catch (error:any) {
      if (error.response) {
        console.error('Error updating news:', error.response.data.message);
        return { success: false, error: error.response.data.message };
      } else {
        console.error('Error updating news:', error.message);
        return { success: false, error: 'An error occurred while trying to update news' };
      }
    }
  };
  export const deleteNews = async (id:any) => {
    try {
      const response = await axios.delete(`${API_URL}/news/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data; 
    } catch (error:any) {
      console.error('Error deleting news:', error);
      return { error: error.response ? error.response.data.message : 'An unexpected error occurred' };
    }
  };
  
  export const toggleNews = async (id:any, isActive:any) => {
    try {
      const response = await axios.post(`${API_URL}/news/toggle/${id}`,  isActive , {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data; 
    } catch (error:any) {
      console.error('Error toggling news status:', error);
      return { error: error.response ? error.response.data.message : 'An unexpected error occurred' };
    }
  };