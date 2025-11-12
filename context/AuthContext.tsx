import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, UserPlan } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (email: string, pass: string) => boolean;
  updateUser: (updater: (user: User) => User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USERS_KEY = 'fakeUsers';
const CURRENT_USER_KEY = 'currentUser';

const PLAN_DETAILS: Record<UserPlan, { credits: number }> = {
    free: { credits: 50 },
    pro: { credits: 500 },
    business: { credits: 2500 },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<Record<string, { pass: string; plan: UserPlan; credits: number; lastCreditReset: string; }>>(FAKE_USERS_KEY, {});
  const [user, setUser] = useLocalStorage<User | null>(CURRENT_USER_KEY, null);

  const updateUser = (updater: (user: User) => User) => {
    if (!user) return;
    const updatedUser = updater(user);
    setUser(updatedUser);
    // Also update the master user list in localStorage
    setUsers(prev => ({ ...prev, [updatedUser.email]: { ...prev[updatedUser.email], ...updatedUser } }));
  };

  const login = (email: string, pass: string): boolean => {
    const userData = users[email];
    if (userData && userData.pass === pass) {
      let loggedInUser: User = { 
          id: email, 
          email, 
          plan: userData.plan, 
          credits: userData.credits,
          lastCreditReset: userData.lastCreditReset
      };
      
      // Check for monthly credit reset
      const lastReset = new Date(loggedInUser.lastCreditReset);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (lastReset < oneMonthAgo) {
          console.log('Resetting credits for user:', email);
          loggedInUser.credits = PLAN_DETAILS[loggedInUser.plan].credits;
          loggedInUser.lastCreditReset = new Date().toISOString();
      }
      
      setUser(loggedInUser);
      // Persist the potentially updated user data
      setUsers(prev => ({...prev, [email]: { ...userData, credits: loggedInUser.credits, lastCreditReset: loggedInUser.lastCreditReset }}));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    window.location.hash = ''; 
  };

  const register = (email: string, pass: string): boolean => {
    if (users[email]) {
      return false;
    }
    const now = new Date().toISOString();
    const newUser: User = { 
        id: email, 
        email, 
        plan: 'free', 
        credits: PLAN_DETAILS.free.credits,
        lastCreditReset: now,
    };
    
    setUsers(prev => ({ ...prev, [email]: { pass, ...newUser } }));
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
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