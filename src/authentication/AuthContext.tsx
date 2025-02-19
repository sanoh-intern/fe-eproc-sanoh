import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_Logout } from '../api/route-api';
import { toast, ToastContainer } from 'react-toastify';
import { API_Login } from '../api/route-api';
import axios from 'axios';
import { getRolePath } from './Role';
import { useLocation, useNavigate } from 'react-router-dom';

type Role = '1' | '2' | '3' | '4' | '5' | null;

interface AuthContextProps {
    isAuthenticated: boolean;
    userRole: Role;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // On mount, check for token and role in localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    const loginError = sessionStorage.getItem('login_error');

    if (loginError) {
      setTimeout(() => {
        toast.error(loginError);
        sessionStorage.removeItem('login_error');
      }, 100);
    }

    if (token && role) {
      const roleValue =
        role === 'super-admin'
          ? '1'
          : role === 'presdir'
          ? '2'
          : role === 'purchasing'
          ? '3'
          : role === 'review'
          ? '4'
          : role === 'supplier'
          ? '5'
          : null;
      setUserRole(roleValue);
      setIsAuthenticated(true);
    } else {
      setUserRole(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // On route change, update lastActivity only if user is authenticated and token exists
  useEffect(() => {
    if (isAuthenticated && localStorage.getItem("access_token")) {
      localStorage.setItem("lastActivity", Date.now().toString());
    }
  }, [location, isAuthenticated]);

  useEffect(() => {
    const checkInactivityExpiration = () => {
      if (!isAuthenticated || !localStorage.getItem("access_token")) return;
      const lastActivityStr = localStorage.getItem("lastActivity");
      if (!lastActivityStr) return;
      const lastActivity = parseInt(lastActivityStr);
      const now = Date.now();
      const oneHour = 3600000; // 1 hour in milliseconds
      if (now - lastActivity > oneHour) {
        localStorage.clear();
        setUserRole(null);
        setIsAuthenticated(false);
        toast.error("Session expired due to inactivity, please login again");
        navigate("/auth/login");
      }
    };

    const interval = setInterval(checkInactivityExpiration, 1000);
    return () => clearInterval(interval);
  }, [navigate, isAuthenticated]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(API_Login(), { username, password });
      const { access_token, role, bp_code, name, supplier_name } = response.data;
  
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('name', name);
      localStorage.setItem('bp_code', bp_code);
      localStorage.setItem('supplier_name', supplier_name);  
      localStorage.setItem("role", getRolePath(role));
      
      setUserRole(role);
      setIsAuthenticated(true);

      localStorage.setItem("lastActivity", Date.now().toString());

      toast.success('Welcome back! ' + name);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        sessionStorage.setItem('login_error', error.response.data.message);
      } else {
        sessionStorage.setItem('login_error', 'An unexpected error occurred');
      }
      setTimeout(() => window.location.reload(), 100);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {    
    const token = localStorage.getItem('access_token');

    const clearAuth = () => {
      setUserRole(null);
      localStorage.clear();
      setIsAuthenticated(false);
    };

    if (token) {
      try {
        await fetch(API_Logout(), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: token }),
        });
        clearAuth();
        toast.success('Logout success');
        navigate('/');
      } catch (error : any) {
        clearAuth();
        toast.error('Logout failed: ' + (error.response ? error.response.data : error.message));
        console.error('Error:', error.response ? error.response.data : error.message);
        navigate('/');
      }
    } else {
      clearAuth();
      toast.error('Error: Token not found');
      console.error('Error: Token not found');
      navigate('/');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
