import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './pages/Login';
import SignupScreen from './pages/Signup';
import DashboardScreen from './pages/Dashboard';
import RequestsScreen from './pages/Requests';
import MarketplaceScreen from './pages/Marketplace';
import About from './pages/About';
import Contact from './pages/Contact';

const Router = () => {
  const { user } = useAuth();
  const [currentPage, setPage] = useState(null);
  const [history, setHistory] = useState([]); // <-- track page history

  // Handle navigation
  const navigateTo = (page) => {
    setHistory((prev) => [...prev, currentPage]); // push current page to history
    setPage(page);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
      setPage(prev);
    } else {
      setPage('dashboard'); // fallback page
    }
  };

  // Authentication effect
  useEffect(() => {
    if (user !== undefined) {
      if (user && (currentPage === 'login' || currentPage === 'signup' || currentPage === null)) {
        setPage('dashboard');
      } else if (!user && (currentPage !== 'login' && currentPage !== 'signup')) {
        setPage('login');
      }
    }
  }, [user, currentPage]);

  if (!currentPage) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const props = { currentPage, setPage: navigateTo, handleBack };

  switch (currentPage) {
    case 'login':
      return <LoginScreen {...props} />;
    case 'signup':
      return <SignupScreen {...props} />;
    case 'dashboard':
      return <DashboardScreen {...props} />;
    case 'requests':
      return <RequestsScreen {...props} />;
    case 'marketplace':
      return <MarketplaceScreen {...props} />;
    case 'about':
      return <About {...props} />; // pass handleBack
    case 'contact':
      return <Contact {...props} />; // pass handleBack
    default:
      return <div className="p-8 text-center">404 Page Not Found</div>;
  }
};

// Main application wrapper
const App = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;
