import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function ResetPassword({ isDark, toggleTheme }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode') || searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [form, setForm] = React.useState({ password: '', password_confirmation: '' });
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [valid, setValid] = React.useState(true);

  React.useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode).catch(() => setValid(false));
    }
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, form.password);
      setDone(true);
      toast.success('Password reset successful');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const m = err.code === 'auth/expired-action-code' ? 'Reset link has expired. Please request a new one.'
        : err.code === 'auth/invalid-action-code' ? 'Invalid reset link. Please request a new one.'
        : 'Failed to reset password';
      toast.error(m);
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode || !valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Reset Link</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This password reset link is invalid or expired.</p>
          <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600 font-semibold">Request a new reset link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 relative">
      <button onClick={toggleTheme} className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
        {isDark ? (
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
      </button>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/"><img src="/anteco.png" alt="ANTECO" className="h-14 mx-auto mb-4" /></Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Your Password</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Enter your new password below.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            {done ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Password reset successfully! Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
                  <input type="password" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Min. 6 characters" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <input type="password" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Repeat your password" required value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
