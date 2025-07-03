import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { User, AuthToken } from '@/types';

// Auth Context Types
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
};

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

// Auth Context Creation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for saved auth state on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem('akawo_user');
        const storedToken = localStorage.getItem('akawo_token');
        
        if (storedUser && storedToken) {
          // In a real app, validate the token here
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: JSON.parse(storedUser), token: storedToken },
          });
        }
      } catch (error) {
        console.error('Failed to load authentication state:', error);
      }
    };
    
    loadStoredAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // In a real app, make API call to login
      // For now, mock a successful login with a sample user
      const mockUser: User = {
        _id: 'user123',
        email,
        firstName: 'John',
        lastName: 'Doe',
        defaultCurrency: 'USD',
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        role: 'customer',
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          marketing: true,
        },
      };
      const mockToken = 'mock-jwt-token';
      
      // Save to local storage
      localStorage.setItem('akawo_user', JSON.stringify(mockUser));
      localStorage.setItem('akawo_token', mockToken);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Invalid email or password',
      });
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      // In a real app, make API call to register
      // For now, mock a successful registration
      const mockUser: User = {
        _id: 'user456',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        defaultCurrency: 'USD',
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        role: 'customer',
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          marketing: true,
        },
      };
      const mockToken = 'mock-jwt-token';
      
      // Save to local storage
      localStorage.setItem('akawo_user', JSON.stringify(mockUser));
      localStorage.setItem('akawo_token', mockToken);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: 'Registration failed. Please try again.',
      });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('akawo_user');
    localStorage.removeItem('akawo_token');
    dispatch({ type: 'LOGOUT' });
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      // In a real app, make API call to update user
      if (state.user) {
        const updatedUser = { ...state.user, ...userData, updatedAt: new Date() };
        localStorage.setItem('akawo_user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};