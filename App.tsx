import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import ToastContainer from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';

const AppRouter: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (user) {
     if (route === '#dashboard') {
         return <DashboardPage />;
     }
     if (route === '#pricing') {
         return <PricingPage />;
     }
     // Redirect to dashboard if logged in and on a public page
     if (route === '' || route === '#' || route === '#login' || route === '#register') {
        window.location.hash = '#dashboard';
        return <DashboardPage />; // Render immediately for smoother experience
     }
  }

  // Public routes
  switch (route) {
    case '#login':
      return <LoginPage />;
    case '#register':
      return <RegisterPage />;
    case '#pricing':
      // Can access pricing without login
      return <PricingPage />;
    case '#dashboard':
      // Not logged in, redirect to login
      window.location.hash = '#login';
      return <LoginPage />;
    default:
      return <LandingPage />;
  }
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <ToastProvider>
              <ToastContainer />
              <AppRouter />
            </ToastProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;