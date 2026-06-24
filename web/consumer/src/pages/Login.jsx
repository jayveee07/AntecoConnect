import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

auth.settings.appVerificationDisabledForTesting = true;

const formatPhone = (val) => {
  const digits = val.replace(/\D/g, '');
  if (digits.startsWith('63') && digits.length >= 11) return '+' + digits;
  if (digits.startsWith('0')) return '+63' + digits.slice(1);
  return '+' + digits;
};

const input = 'w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all duration-200 text-sm';

const Field = React.memo(({ name, label, type, placeholder, inputMode, value, onChange, required, minLength, disabled, pattern }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input name={name} type={type || 'text'} inputMode={inputMode}
      className={input + (value === '' ? ' border-red-300 dark:border-red-700' : ' border-gray-200 dark:border-gray-700')}
      value={value} onChange={onChange} placeholder={placeholder} required={required} minLength={minLength} disabled={disabled} pattern={pattern} />
  </div>
), (prev, next) => prev.value === next.value && prev.name === next.name && prev.disabled === next.disabled);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const Tab = ({ label, active, onSwitch }) => (
  <button onClick={onSwitch}
    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${active ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
    {label}
  </button>
);

const SubmitBtn = ({ onClick, children, secondary, fullWidth, type, disabled }) => (
  <button type={type || (onClick ? 'button' : 'submit')} onClick={onClick}
    className={`py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : 'flex-1'} ${secondary ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'}`}
    disabled={disabled}>
    {disabled ? <Spinner /> : null}
    {children}
  </button>
);

const GoogleBtn = ({ onClick, loading }) => (
  <button type="button" onClick={onClick} disabled={loading}
    className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-sm">
    {loading ? <Spinner /> : (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )}
    {loading ? 'Connecting...' : 'Continue with Google'}
  </button>
);

const MethodChoice = ({ mode, onGoogleLogin, googleLoading, onSetMethod }) => (
  <div className="space-y-3">
    <GoogleBtn onClick={onGoogleLogin} loading={googleLoading} />
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white dark:bg-gray-900 px-3 text-gray-400 dark:text-gray-500">or</span>
      </div>
    </div>
    <button onClick={() => onSetMethod('email')}
      className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      Sign {mode === 'login' ? 'In' : 'Up'} with Email
    </button>
  </div>
);

const GoogleCompleteFormView = ({ step, googleProfile, mobileNumber, onMobileChange, onContinue, loading }) => (
  <div className="space-y-4">
    <div className="text-center mb-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, <span className="font-semibold text-gray-900 dark:text-white">{googleProfile?.first_name} {googleProfile?.last_name}</span></p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {step === 1 ? 'Enter your mobile number to continue' : 'Verify your phone number'}
      </p>
    </div>
    {step === 1 && (
      <div className="space-y-4 animate-fade-in">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Mobile Number</label>
          <input name="mobile_number" type="text" inputMode="numeric" placeholder="0917xxxxxxx" required
            className={input + (mobileNumber === '' ? ' border-red-300 dark:border-red-700' : ' border-gray-200 dark:border-gray-700')}
            value={mobileNumber} onChange={onMobileChange} />
        </div>
        <SubmitBtn onClick={onContinue} fullWidth disabled={loading}>{loading ? 'Saving...' : 'Continue'}</SubmitBtn>
      </div>
    )}
  </div>
);

const PhoneVerifyView = ({ phone, userId, phoneSent, sendingOtp, phoneCode, onCodeChange, onSendOtp, onVerifyOtp, verifyingOtp, onResend }) => (
  <div className="space-y-4 animate-fade-in">
    <div className="text-center mb-2">
      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Verify your mobile number</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">An OTP will be sent to {phone}</p>
    </div>
    {!phoneSent ? (
      <SubmitBtn onClick={onSendOtp} fullWidth disabled={sendingOtp}>{sendingOtp ? 'Sending OTP...' : 'Send OTP'}</SubmitBtn>
    ) : (
      <div className="space-y-4">
        <Field name="phone_code" label="Enter OTP Code" type="text" inputMode="numeric" placeholder="000000" value={phoneCode}
          onChange={onCodeChange} required pattern="[0-9]{6}" />
        <div className="flex gap-3">
          <SubmitBtn onClick={onVerifyOtp} fullWidth disabled={verifyingOtp}>{verifyingOtp ? 'Verifying...' : 'Verify Phone'}</SubmitBtn>
        </div>
        <button type="button" onClick={onResend}
          className="block mx-auto text-xs text-primary-500 hover:text-primary-600 font-semibold">
          Resend OTP
        </button>
      </div>
    )}
  </div>
);

export default function Login({ isDark, toggleTheme, defaultMode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState(defaultMode || searchParams.get('mode') || 'login');
  const [method, setMethod] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [step, setStep] = React.useState(1);
  const [googleProfile, setGoogleProfile] = React.useState(null);
  const [createdUserId, setCreatedUserId] = React.useState(null);

  const [phoneVerificationId, setPhoneVerificationId] = React.useState('');
  const [phoneCode, setPhoneCode] = React.useState('');
  const [phoneSent, setPhoneSent] = React.useState(false);
  const [sendingOtp, setSendingOtp] = React.useState(false);
  const [verifyingOtp, setVerifyingOtp] = React.useState(false);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then((snap) => {
        if (snap.exists()) navigate('/dashboard', { replace: true });
      });
    }
  }, [navigate]);

  const [l, setL] = React.useState({ email: '', password: '' });
  const [r, setR] = React.useState({
    first_name: '', last_name: '', email: '', mobile_number: '',
    password: '', password_confirmation: '',
  });
  const [g, setG] = React.useState({ mobile_number: '' });

  const up = (obj, fn) => (e) => fn({ ...obj, [e.target.name]: e.target.value });

  const setupRecaptcha = () => {
    if (auth.settings.appVerificationDisabledForTesting) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  const handleSendOtp = async (phone, userId) => {
    setSendingOtp(true);
    setError('');
    const formatted = formatPhone(phone);
    try {
      setupRecaptcha();
      const provider = new PhoneAuthProvider(auth);
      const verifier = auth.settings.appVerificationDisabledForTesting ? undefined : window.recaptchaVerifier;
      const verificationId = await provider.verifyPhoneNumber(formatted, verifier);
      setPhoneVerificationId(verificationId);
      setPhoneSent(true);
      toast.success('OTP sent to ' + formatted);
    } catch (err) {
      if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError(err.message || 'Failed to send OTP');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (phone) => {
    setVerifyingOtp(true);
    setError('');
    try {
      const credential = PhoneAuthProvider.credential(phoneVerificationId, phoneCode);
      await linkWithCredential(auth.currentUser, credential);
      toast.success('Phone number verified!');
      return true;
    } catch (err) {
      setError(err.message || 'Invalid verification code');
      return false;
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, l.email, l.password);
      const docSnap = await getDoc(doc(db, 'users', cred.user.uid));
      if (!docSnap.exists()) {
        await auth.signOut();
        setError('Please complete phone verification first. Register again or contact support.');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      const m = err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/invalid-credential' ? 'Invalid email or password'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.'
        : err.message || 'Login failed.';
      setError(m);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (s) => {
    if (s === 1 && (!r.first_name || !r.last_name || !r.email || !r.mobile_number)) {
      setError('Please fill in all required fields.'); return false;
    }
    if (s === 2 && r.password !== r.password_confirmation) {
      setError('Passwords do not match.'); return false;
    }
    if (s === 2 && r.password.length < 6) {
      setError('Password must be at least 6 characters.'); return false;
    }
    return true;
  };

  const goStep = (s) => { if (validateStep(step)) setStep(s); };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setLoading(true); setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, r.email, r.password);
      setCreatedUserId(cred.user.uid);
      setStep(3);
      toast.success('Almost there! Verify your phone to activate your account.');
    } catch (err) {
      const m = err.code === 'auth/email-already-in-use' ? 'An account with this email already exists'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters'
        : err.message || 'Registration failed.';
      setError(m);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true); setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const names = (user.displayName || '').split(' ');
        setGoogleProfile({
          first_name: names[0] || '',
          last_name: names.slice(1).join(' ') || '',
          email: user.email,
          uid: user.uid,
        });
        setMethod('google-complete');
        setG({ mobile_number: '' });
        setStep(1);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleComplete = async (e) => {
    e.preventDefault();
    if (!g.mobile_number) {
      setError('Please provide your mobile number.'); return;
    }
    setStep(2);
  };

  const switchMode = (m) => { setMode(m); setMethod(null); setError(''); setStep(1); setGoogleProfile(null); setCreatedUserId(null); setPhoneSent(false); setPhoneCode(''); setPhoneVerificationId(''); };

  const isBusy = loading || sendingOtp || verifyingOtp;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 relative">
      <div id="recaptcha-container" />
      <button onClick={toggleTheme} className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        {isDark ? (
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
      </button>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/"><img src="/anteco.png" alt="ANTECO" className="h-14 mx-auto mb-4" /></Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {method === 'google-complete' ? 'Complete Your Profile' : step === 3 ? 'Verify Phone' : mode === 'login' ? 'Welcome Back' : 'Join ANTECO'}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {method === 'google-complete' ? (step === 1 ? 'Enter your mobile number' : 'Verify your phone number') : step === 3 ? 'One more step to get started' : mode === 'login' ? 'Sign in to manage your account' : 'Create your account to get started'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            {method !== 'google-complete' && step !== 3 && (
              <div className="flex mb-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1">
                <Tab label="Login" active={mode === 'login'} onSwitch={() => switchMode('login')} />
                <Tab label="Register" active={mode === 'register'} onSwitch={() => switchMode('register')} />
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {step === 3 ? (
              <PhoneVerifyView phone={r.mobile_number} userId={createdUserId}
                phoneSent={phoneSent} sendingOtp={sendingOtp}
                phoneCode={phoneCode} onCodeChange={(e) => setPhoneCode(e.target.value)}
                onSendOtp={() => handleSendOtp(r.mobile_number, createdUserId)}
                onVerifyOtp={async () => {
                  const ok = await handleVerifyOtp(r.mobile_number);
                  if (ok) {
                    await setDoc(doc(db, 'users', createdUserId), {
                      uid: createdUserId,
                      role: 'consumer',
                      first_name: r.first_name,
                      last_name: r.last_name,
                      email: r.email,
                      mobile_number: r.mobile_number,
                      isEmailVerified: false,
                      phoneVerified: true,
                      accountStatus: 'active',
                      is_verified: false,
                      createdAt: serverTimestamp(),
                      updatedAt: serverTimestamp(),
                    });
                    navigate('/dashboard');
                  }
                }}
                verifyingOtp={verifyingOtp}
                onResend={() => { setPhoneSent(false); setPhoneCode(''); setPhoneVerificationId(''); }} />
            ) : method === 'google-complete' ? (
              <>
                {step === 2 ? (
                  <PhoneVerifyView phone={g.mobile_number} userId={googleProfile.uid}
                    phoneSent={phoneSent} sendingOtp={sendingOtp}
                    phoneCode={phoneCode} onCodeChange={(e) => setPhoneCode(e.target.value)}
                    onSendOtp={() => handleSendOtp(g.mobile_number, googleProfile.uid)}
                    onVerifyOtp={async () => {
                      const ok = await handleVerifyOtp(g.mobile_number);
                      if (ok) {
                        await setDoc(doc(db, 'users', googleProfile.uid), {
                          uid: googleProfile.uid,
                          role: 'consumer',
                          first_name: googleProfile.first_name,
                          last_name: googleProfile.last_name,
                          email: googleProfile.email,
                          mobile_number: g.mobile_number,
                          isEmailVerified: true,
                          phoneVerified: true,
                          accountStatus: 'active',
                          is_verified: true,
                          createdAt: serverTimestamp(),
                          updatedAt: serverTimestamp(),
                        });
                        navigate('/dashboard');
                      }
                    }}
                    verifyingOtp={verifyingOtp}
                    onResend={() => { setPhoneSent(false); setPhoneCode(''); setPhoneVerificationId(''); }} />
                ) : (
                  <GoogleCompleteFormView step={step} googleProfile={googleProfile}
                    mobileNumber={g.mobile_number}
                    onMobileChange={(e) => setG(p => ({ ...p, mobile_number: e.target.value }))}
                    onContinue={handleGoogleComplete} loading={loading} />
                )}
              </>
            ) : !method ? (
              <MethodChoice mode={mode} onGoogleLogin={handleGoogleLogin} googleLoading={googleLoading} onSetMethod={setMethod} />
            ) : method === 'email' && mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Login</span>
                  <button type="button" onClick={() => { setMethod(null); setError(''); }} className="text-xs text-primary-500 hover:text-primary-600 font-semibold">Back</button>
                </div>
                <Field name="email" label="Email Address" type="email" placeholder="Enter your email" value={l.email} onChange={up(l, setL)} required />
                <Field name="password" label="Password" type="password" placeholder="Enter your password" value={l.password} onChange={up(l, setL)} required />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500/50" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary-500 hover:text-primary-600 font-semibold">Forgot Password?</Link>
                </div>
                <SubmitBtn fullWidth disabled={isBusy}>{loading ? 'Signing In...' : 'Sign In'}</SubmitBtn>
              </form>
            ) : method === 'email' && mode === 'register' ? (
              <form onSubmit={handleRegister}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Registration</span>
                  <button type="button" onClick={() => { setMethod(null); setError(''); }} className="text-xs text-primary-500 hover:text-primary-600 font-semibold">Back</button>
                </div>
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                      <Field name="first_name" label="First Name" placeholder="Juan" value={r.first_name} onChange={up(r, setR)} required />
                      <Field name="last_name" label="Last Name" placeholder="Dela Cruz" value={r.last_name} onChange={up(r, setR)} required />
                    </div>
                    <Field name="email" label="Email Address" type="email" placeholder="juan@email.com" value={r.email} onChange={up(r, setR)} required />
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Mobile Number</label>
                      <input name="mobile_number" type="text" inputMode="numeric" placeholder="0917xxxxxxx" required
                        className={input + (r.mobile_number === '' ? ' border-red-300 dark:border-red-700' : ' border-gray-200 dark:border-gray-700')}
                        value={r.mobile_number} onChange={(e) => setR(p => ({ ...p, mobile_number: e.target.value }))} />
                    </div>
                    <SubmitBtn onClick={() => goStep(2)} fullWidth disabled={isBusy}>Next Step</SubmitBtn>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <Field name="password" label="Password" type="password" placeholder="Min. 6 characters" value={r.password} onChange={up(r, setR)} required minLength={6} />
                    <Field name="password_confirmation" label="Confirm Password" type="password" placeholder="Repeat password" value={r.password_confirmation} onChange={up(r, setR)} required />
                    <div className="flex gap-3">
                      <SubmitBtn onClick={() => setStep(1)} secondary disabled={isBusy}>Back</SubmitBtn>
                      <SubmitBtn disabled={isBusy}>{loading ? 'Creating Account...' : 'Create Account'}</SubmitBtn>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-8 bg-primary-500' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              </form>
            ) : null}
          </div>

          {method !== 'google-complete' && step !== 3 && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="text-primary-500 hover:text-primary-600 font-semibold">
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-white max-w-md p-12">
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
