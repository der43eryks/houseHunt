import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import HelpDeskPage from './pages/HelpDeskPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import VerifyPage from './pages/VerifyPage';
import AboutPage from './pages/AboutPage';
import { eventStream } from './services/streaming';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: '/listings',
    element: <Layout><ListingsPage /></Layout>,
  },
  {
    path: '/listings/:id',
    element: <Layout><ListingDetailPage /></Layout>,
  },
  {
    path: '/help',
    element: <Layout><HelpDeskPage /></Layout>,
  },
  {
    path: '/contact',
    element: <Layout><ContactPage /></Layout>,
  },
  {
    path: '/about',
    element: <Layout><AboutPage /></Layout>,
  },
  {
    path: '/auth',
    element: <Layout><AuthPage /></Layout>,
  },
  {
    path: '/verify-email',
    element: <Layout><VerifyPage /></Layout>,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

function Layout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

function App() {
  useEffect(() => {
    // Connect to SSE when app loads
    eventStream.connect();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Listen for new listings
    eventStream.addListener('new_listing', (listing) => {
      // Update your listings state or show notification
      console.log('New listing:', listing);
    });
    
    return () => {
      eventStream.disconnect();
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
