import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Set to false for production

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<AdminLayout onLogout={() => setIsAuthenticated(false)} />}>
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
