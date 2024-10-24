import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userDetails:any;
  login: (token: string) => void;
  logout: () => void;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserDetails: (details: any) => void;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('token') || null;
  });
  const [userDetails, setUserDetails] = useState<any>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token); 
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: { role?: string } = jwtDecode(token);
        setUserRole(decoded.role || null);
      } catch (error) {
        console.error('Invalid token:', error);
        setUserRole(null);
      }
    }
  }, [token]);
  const setUserDetailsContext = (details: any) => {
    setUserDetails(details);
    sessionStorage.setItem('userDetails', JSON.stringify(details));
  };

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    sessionStorage.setItem('token', newToken); 
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUserRole(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userDetails');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login,userDetails, logout, setToken, userRole,setUserDetails: setUserDetailsContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
