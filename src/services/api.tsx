import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      return { error: error.response.data.message };
    } else {
      return { error: 'An error occurred while trying to log in' };
    }
  }
};

// export const getUsersList = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/users/get_users_list`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`, 
//           'Content-Type': 'application/json',
//         },
//       });
  
//       if (response.data && response.data.userData) {
//         return response.data.userData; 
//       } else {
//         console.error('Failed to fetch user list: No userData found');
//         return false; 
//       }
//     } catch (error: any) {
//       if (error.response) {
//         console.error('Error fetching user list:', error.response.data.message);
//         return { error: error.response.data.message }; 
//       } else {
//         console.error('Error fetching user list:', error.message);
//         return { error: 'An error occurred while trying to fetch user list' }; 
//       }
//     }
//   };
export const getUsersList = async (page = 1, limit = 10, sort = '', order = '') => {
  try {
      const response = await axios.get(`${API_URL}/users`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
          },
          params: { 
              page,
              limit,
              sort,
              order,
          }
      });

      if (response.data && response.data.userData) {
          return response.data; // Return the entire response for total pages and users count
      } else {
          console.error('Failed to fetch user list: No userData found');
          return false; 
      }
  } catch (error:any) {
      if (error.response) {
          console.error('Error fetching user list:', error.response.data.message);
          return { error: error.response.data.message }; 
      } else {
          console.error('Error fetching user list:', error.message);
          return { error: 'An error occurred while trying to fetch user list' }; 
      }
  }
};
  export const addUser = async (username: string,email:string, password: string, role: string) => {
    try {
      const response = await axios.post(`${API_URL}/users`, 
        { username,email, password, role }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error adding user:', error.response.data.message);
        return { error: error.response.data.message };
      } else {
        console.error('Error adding user:', error.message);
        return { error: 'An error occurred while trying to add user' };
      }
    }
  };
  
  export const getUserData = async (userId:any) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`, { 
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.userData) {
            return response.data; 
        } else {
            console.error('Failed to fetch user data: No userData found');
            return false; 
        }
    } catch (error:any) {
        if (error.response) {
            console.error('Error fetching user data:', error.response.data.message);
            return { error: error.response.data.message }; 
        } else {
            console.error('Error fetching user data:', error.message);
            return { error: 'An error occurred while trying to fetch user data' }; 
        }
    }
};
  export const resetPassword = async (email:any, password:any) => {
    try {
      const response = await axios.post(`${API_URL}/users/reset_password`, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error resetting password:', error.response.data.message);
        return { error: error.response.data.message };
      } else {
        console.error('Error resetting password:', error.message);
        return { error: 'An error occurred while trying to reset the password' };
      }
    }
  };

  export const updateUser = async (id: string, username?: string,email?: string,role?: string,is_active?: any) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${id}`,
        {  username,email, role,is_active },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error updating user:', error.response.data.message);
        return { error: error.response.data.message };
      } else {
        console.error('Error updating user:', error.message);
        return { error: 'An error occurred while trying to update user' };
      }
    }
  };

  export const deleteUser = async (id: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/users/delete`,
        {
          data: { id },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error deleting user:', error.response.data.message);
        return { error: error.response.data.message };
      } else {
        console.error('Error deleting user:', error.message);
        return { error: 'An error occurred while trying to delete user' };
      }
    }
  };