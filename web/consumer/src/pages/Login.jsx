import React from 'react';
import { authService } from '../services';

export default function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <img src="/anteco.png" alt="ANTECO" className="h-16 w-16 mx-auto mb-6 rounded-2xl" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your ANTECO account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-500 hover:underline">Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button className="text-primary-500 hover:underline font-medium">Register</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-primary-800 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <img src="/anteco.png" alt="ANTECO" className="w-16 h-16 mb-6 brightness-0 invert opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Powering Progress, Connecting Lives</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            ANTECO CONNECT brings you closer to your electric cooperative. Manage bills, report outages, 
            track consumption, and access services all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
