import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_Logout } from '../api/route-api';
import { toast, ToastContainer } from 'react-toastify';
import { API_Login } from '../api/route-api';
import axios from 'axios';
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
      const oneHour = 3600000;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(API_Login(), { email, password });
      const { access_token, role_tags, bp_code, company_name, role_id } = response.data.data;
  
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('company_name', company_name);
      localStorage.setItem('bp_code', bp_code);
      localStorage.setItem("role", role_tags);
      localStorage.setItem("role_id", role_id);
      
      setUserRole(role_id);
      setIsAuthenticated(true);

      localStorage.setItem("lastActivity", Date.now().toString());

      toast.success('Welcome back! ' + company_name);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { message, error: errors } = error.response.data;
        let errorMsg = message;
        if (errors && typeof errors === 'object') {
          const msgs = Object.values(errors).flat();
          errorMsg = msgs;
        }
        sessionStorage.setItem('login_error', errorMsg);
      } else {
        sessionStorage.setItem('login_error', 'Server error, please try again later');
      }
      setTimeout(() => window.location.reload(), 10);
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
