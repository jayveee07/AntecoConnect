import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { authService } from './services';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import Consumption from './pages/Consumption';
import Outages from './pages/Outages';
import ServiceRequests from './pages/ServiceRequests';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  const [isDark, setIsDark] = React.useState(() => localStorage.getItem('theme') === 'dark');
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => !!localStorage.getItem('token'));

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<Login isDark={isDark} toggleTheme={() => setIsDark(!isDark)} onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout isDark={isDark} toggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/consumption" element={<Consumption />} />
          <Route path="/outages" element={<Outages />} />
          <Route path="/service-requests" element={<ServiceRequests />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
