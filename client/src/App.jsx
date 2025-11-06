
import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LoginScreen from "./pages/Auth/Login";
import SignupScreen from "./pages/Auth/Signup";
import DashboardScreen from "./pages/Dashboard";
import RequestsScreen from "./pages/Requests";
import MarketplaceScreen from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UnderDevelopment from "./pages/Contacts";

const Router = () => {
  const { user } = useAuth();
  const [currentPage, setPage] = useState(() => {
    return localStorage.getItem("currentPage") || null;
  });
  const [history, setHistory] = useState([]);

  const navigateTo = (page) => {
    setHistory((prev) => [...prev, currentPage]);
    setPage(page);
    localStorage.setItem("currentPage", page);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setPage(prev);
      localStorage.setItem("currentPage", prev);
    } else {
      setPage("dashboard");
      localStorage.setItem("currentPage", "dashboard");
    }
  };

  useEffect(() => {
    if (user !== undefined) {
      if (user && (currentPage === "login" || currentPage === "signup" || currentPage === null)) {
        setPage("dashboard");
        localStorage.setItem("currentPage", "dashboard");
      } else if (!user && (currentPage !== "login" && currentPage !== "signup")) {
        setPage("login");
        localStorage.setItem("currentPage", "login");
      }
    }
  }, [user]);

  if (!currentPage) return <div className="p-8 text-center">Loading...</div>;

  const props = { currentPage, setPage: navigateTo, handleBack };

  switch (currentPage) {
    case "login":
      return <LoginScreen {...props} />;
    case "signup":
      return <SignupScreen {...props} />;
    case "dashboard":
      return <DashboardScreen {...props} />;
    case "requests":
      return <RequestsScreen {...props} />;
    case "marketplace":
      return <MarketplaceScreen {...props} />;
    case "profile":
      return <UnderDevelopment {...props} />;
    case "contacts":
      return <UnderDevelopment {...props} />;
    case "about":
      return <About {...props} />;
    case "contact":
      return <Contact {...props} />;
    default:
      return <div className="p-8 text-center">404 Page Not Found</div>;
  }
};

const App = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;


