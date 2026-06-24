import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout({ isDark, toggleTheme }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/anteco.png" alt="ANTECO" className="h-9" />
              <span className="hidden sm:block text-lg font-bold text-gray-900 dark:text-white">ANTECO<span className="text-primary-500">Connect</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === link.to ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {isDark ? <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
              <Link to="/login" className="ml-2 px-5 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
                Sign In
              </Link>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {isDark ? <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg ${location.pathname === link.to ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-lg">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main><Outlet /></main>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img src="/anteco.png" alt="ANTECO" className="h-10 mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                ANTECO is committed to providing reliable and affordable electricity to the communities of Antique. ANTECOConnect is your digital gateway to manage your account and access our services.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Legal</h4>
              <div className="space-y-2.5">
                <Link to="/privacy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Terms &amp; Conditions</Link>
                <Link to="/accessibility" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Accessibility</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} ANTECO. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary-500">Privacy</Link>
              <Link to="/terms" className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary-500">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
