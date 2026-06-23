import React from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function ForgotPassword({ isDark, toggleTheme }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      const m = err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : 'Failed to send reset link';
      toast.error(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 relative">
      <button onClick={toggleTheme} className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {sent ? 'Check your email for the reset link' : "Enter your email and we'll send you a reset link"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong></p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Please check your inbox and follow the instructions.</p>
                <Link to="/login" className="text-sm text-primary-500 hover:text-primary-600 font-semibold">Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center">
                  <Link to="/login" className="text-xs text-primary-500 hover:text-primary-600 font-semibold">Back to Sign In</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
