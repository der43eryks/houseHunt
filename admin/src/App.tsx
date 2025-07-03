import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <Layout><Login /></Layout> },
  { path: '/register', element: <Layout><Register /></Layout> },
  { path: '/forgot-password', element: <Layout><ForgotPassword /></Layout> },
  { path: '/terms', element: <Layout><Terms /></Layout> },
  { path: '/verify', element: <Layout><Verify /></Layout> },
  { path: '/dashboard', element: <Layout><RequireAuth><Dashboard /></RequireAuth></Layout> },
  { path: '/dashboard/listings', element: <Layout><RequireAuth><Dashboard /></RequireAuth></Layout> },
  { path: '/dashboard/add-listing', element: <Layout><RequireAuth><Dashboard /></RequireAuth></Layout> },
  { path: '/dashboard/profile', element: <Layout><RequireAuth><Dashboard /></RequireAuth></Layout> },
  { path: '/dashboard/settings', element: <Layout><RequireAuth><Dashboard /></RequireAuth></Layout> },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

function App() {
  useEffect(() => {
    // Remove all code that gets adminToken from localStorage for authentication
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
