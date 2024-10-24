import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getPostsList = async (page = 1, limit = 10, title = '', sort = 'createdAt', order = 'DESC', filter = '') => {
  try {
    const response = await axios.get(`${API_URL}/feed`, {
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

    if (response.data && response.data.feeds) {
      return {
        feeds :response.data.feeds || [],
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalPosts: response.data.totalPosts ,
      };
    } else {
      console.error('Failed to fetch posts: No posts found');
      return { feeds: [], totalPages: 0, currentPage: 1, totalPosts: 0 };
    }
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        console.warn('No posts found (404). Returning empty feeds array.');
        return { feeds: [], totalPages: 0, currentPage: 1, totalPosts: 0 }; 
      } else {
        console.error('Error fetching posts:', error.response.data.message);
        return { error: error.response.data.message, feeds: [] }; 
      }
    } else {
      console.error('Error fetching posts:', error.message);
      return { error: 'An error occurred while trying to fetch posts', feeds: [] };
    }
  }
};
export const createOrUpdatePost = async (postId: string | null, postData: any) => {
  try {
    const url = postId ? `${API_URL}/feed/${postId}` : `${API_URL}/feed`;

    const response = await axios.post(url, postData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data) {
      return response.data;
    } else {
      console.error('Failed to create/update post: No response data');
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Error creating/updating post:', error.response.data.message);
      return { error: error.response.data.message };
    } else {
      console.error('Error creating/updating post:', error.message);
      return { error: 'An error occurred while trying to create/update the post' };
    }
  }
};

export const deletePost = async (postId: string) => {
  try {
    const url = `${API_URL}/feed/${postId}`;

    const response = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data) {
      return response.data;
    } else {
      console.error('Failed to delete post: No response data');
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Error deleting post:', error.response.data.message);
      return { error: error.response.data.message };
    } else {
      console.error('Error deleting post:', error.message);
      return { error: 'An error occurred while trying to delete the post' };
    }
  }
};