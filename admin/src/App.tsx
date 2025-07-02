import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import Dashboard from './pages/Dashboard';
import { adminEventStream } from './services/streaming';
import { adminAPI } from './services/api';

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    adminAPI.getProfile()
      .then(res => {
        if (isMounted && res.success) setIsAuthenticated(true);
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
}

function App() {
  useEffect(() => {
    // Remove all code that gets adminToken from localStorage for authentication
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/dashboard/listings" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/dashboard/add-listing" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/dashboard/profile" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/dashboard/settings" element={<RequireAuth><Dashboard /></RequireAuth>} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
