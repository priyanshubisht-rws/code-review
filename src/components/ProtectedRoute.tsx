import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated , token } = useAuth(); 
  useEffect(()=>{

    console.log(isAuthenticated, 'AUTH___((')
    console.log(token,"tokensss");
    console.log( [token || ""]?.length > 0," [token || '']?.length > 0sss");
    
  },[isAuthenticated,token])
  return (isAuthenticated || (token || "")?.length > 0) ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

