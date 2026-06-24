import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import Consumption from './pages/Consumption';
import Outages from './pages/Outages';
import ServiceRequests from './pages/ServiceRequests';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import { authService } from './services';
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Services from './pages/public/Services';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Interruptions from './pages/public/Interruptions';
import Accessibility from './pages/public/Accessibility';
import Seed from './pages/Seed';
import More from './pages/More';
import AddAccount from './pages/AddAccount';

function App() {
  const [isDark, setIsDark] = React.useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}
    setUser(null);
  };

  const isAuthenticated = !!user;

  const publicRoute = (element) => (
    <PublicLayout isDark={isDark} toggleTheme={() => setIsDark(!isDark)}>
      {element}
    </PublicLayout>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login isDark={isDark} toggleTheme={() => setIsDark(!isDark)} defaultMode="register" />} />
        <Route path="/forgot-password" element={<ForgotPassword isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />} />
        <Route path="/reset-password" element={<ResetPassword isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />} />

        <Route path="/" element={publicRoute(<Landing />)} />
        <Route path="/about" element={publicRoute(<About />)} />
        <Route path="/services" element={publicRoute(<Services />)} />
        <Route path="/faq" element={publicRoute(<FAQ />)} />
        <Route path="/contact" element={publicRoute(<Contact />)} />
        <Route path="/privacy" element={publicRoute(<Privacy />)} />
        <Route path="/terms" element={publicRoute(<Terms />)} />
        <Route path="/accessibility" element={publicRoute(<Accessibility />)} />
        <Route path="/interruptions" element={publicRoute(<Interruptions />)} />

        {isAuthenticated ? (
          <Route element={<Layout isDark={isDark} toggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/consumption" element={<Consumption />} />
            <Route path="/outages" element={<Outages />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/support" element={<Support />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="/more" element={<More />} />
            <Route path="/add-account" element={<AddAccount />} />
            <Route path="/dev/seed" element={<Seed />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </>
  );
}

export default App;
