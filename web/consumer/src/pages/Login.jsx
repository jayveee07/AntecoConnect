import React from 'react';
import { authService } from '../services';

const input = 'w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all duration-200 text-sm';

export default function Login({ onLogin }) {
  const [mode, setMode] = React.useState('login');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [step, setStep] = React.useState(1);

  const [l, setL] = React.useState({ email: '', password: '' });
  const [r, setR] = React.useState({
    first_name: '', last_name: '', email: '', mobile_number: '',
    password: '', password_confirmation: '', address_line1: '',
    barangay: '', city: '', province: '', zip_code: '',
  });

  const up = (obj, fn) => (e) => fn({ ...obj, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await authService.login(l);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await authService.register(r);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      const m = err.response?.data?.message;
      if (m) setError(m);
      else {
        const es = err.response?.data?.errors;
        setError(es ? Object.values(es).flat().join('. ') : 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setStep(1); };

  const Tab = ({ label }) => (
    <button onClick={() => { setMode(label.toLowerCase()); setError(''); setStep(1); }}
      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${mode === label.toLowerCase() ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
      {label}
    </button>
  );

  const Btn = ({ onClick, children, secondary }) => (
    <button type={onClick ? 'button' : 'submit'} onClick={onClick}
      className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${secondary ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'}`}
      disabled={loading}>
      {children}
    </button>
  );

  const Field = ({ name, label, type, placeholder, value, onChange, required, minLength }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input name={name} type={type || 'text'} className={input + (error && !value ? ' border-red-300 dark:border-red-700' : ' border-gray-200 dark:border-gray-700')}
        value={value} onChange={onChange} placeholder={placeholder} required={required} minLength={minLength} />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join ANTECO'}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {mode === 'login' ? 'Sign in to manage your account' : 'Create your account to get started'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1">
              <Tab label="Login" /><Tab label="Register" />
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Field name="email" label="Email Address" type="email" placeholder="Enter your email" value={l.email} onChange={up(l, setL)} required />
                <Field name="password" label="Password" type="password" placeholder="Enter your password" value={l.password} onChange={up(l, setL)} required />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500/50" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">Remember me</span>
                  </label>
                  <button type="button" className="text-xs text-primary-500 hover:text-primary-600 font-semibold">Forgot Password?</button>
                </div>
                <Btn>{loading ? 'Signing In...' : 'Sign In'}</Btn>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                      <Field name="first_name" label="First Name" placeholder="Juan" value={r.first_name} onChange={up(r, setR)} required />
                      <Field name="last_name" label="Last Name" placeholder="Dela Cruz" value={r.last_name} onChange={up(r, setR)} required />
                    </div>
                    <Field name="email" label="Email Address" type="email" placeholder="juan@email.com" value={r.email} onChange={up(r, setR)} required />
                    <Field name="mobile_number" label="Mobile Number" type="tel" placeholder="0917xxxxxxx" value={r.mobile_number} onChange={up(r, setR)} required />
                    <Btn onClick={() => setStep(2)}>Next Step</Btn>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <Field name="address_line1" label="Home Address" placeholder="123 Street, Barangay" value={r.address_line1} onChange={up(r, setR)} required />
                    <div className="grid grid-cols-3 gap-3">
                      <Field name="barangay" label="Barangay" placeholder="Barangay" value={r.barangay} onChange={up(r, setR)} required />
                      <Field name="city" label="City" placeholder="City" value={r.city} onChange={up(r, setR)} required />
                      <Field name="province" label="Province" placeholder="Province" value={r.province} onChange={up(r, setR)} required />
                    </div>
                    <Field name="zip_code" label="Zip Code" placeholder="xxxx" value={r.zip_code} onChange={up(r, setR)} required />
                    <div className="flex gap-3">
                      <Btn onClick={() => setStep(1)} secondary>Back</Btn>
                      <Btn onClick={() => setStep(3)}>Next Step</Btn>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <Field name="password" label="Password" type="password" placeholder="Min. 8 characters" value={r.password} onChange={up(r, setR)} required minLength={8} />
                    <Field name="password_confirmation" label="Confirm Password" type="password" placeholder="Repeat password" value={r.password_confirmation} onChange={up(r, setR)} required />
                    <div className="flex gap-3">
                      <Btn onClick={() => setStep(2)} secondary>Back</Btn>
                      <Btn>{loading ? 'Creating Account...' : 'Create Account'}</Btn>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-8 bg-primary-500' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={switchMode} className="text-primary-500 hover:text-primary-600 font-semibold">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-white max-w-md p-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            <span className="text-2xl font-bold">A</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Powering Progress,<br />Connecting Lives</h2>
          <p className="text-white/70 text-base leading-relaxed mb-10">
            ANTECO CONNECT brings you closer to your electric cooperative. Manage bills, report outages, track consumption, and access services all in one place.
          </p>
          <div className="space-y-4">
            {[
              { icon: 'Zap', label: 'Real-time Billing', desc: 'View and pay bills instantly' },
              { icon: 'AlertTriangle', label: 'Outage Alerts', desc: 'Get notified of power interruptions' },
              { icon: 'BarChart3', label: 'Energy Insights', desc: 'Track your consumption patterns' },
              { icon: 'Headphones', label: '24/7 Support', desc: 'We are always here to help' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon === 'Zap' ? 'M13 10V3L4 14h7v7l9-11h-7z' : item.icon === 'AlertTriangle' ? 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : item.icon === 'BarChart3' ? 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' : 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
