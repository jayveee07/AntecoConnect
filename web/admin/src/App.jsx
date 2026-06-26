import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Consumers from './pages/Consumers';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import MeterReading from './pages/MeterReading';
import Outages from './pages/Outages';
import WorkOrders from './pages/WorkOrders';
import ServiceRequests from './pages/ServiceRequests';
import Announcements from './pages/Announcements';
import Reports from './pages/Reports';
import GIS from './pages/GIS';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => !!localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      const hasToken = !!localStorage.getItem('token');
      if (firebaseUser && hasToken) {
        setIsAuthenticated(true);
      } else if (!firebaseUser) {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<Login onLogin={(token, user) => handleLogin(token, user)} />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<AdminLayout onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/consumers" element={<Consumers />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/meter-reading" element={<MeterReading />} />
          <Route path="/outages" element={<Outages />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/service-requests" element={<ServiceRequests />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/gis" element={<GIS />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
