import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: 'User', name: 'Account Management',
    questions: [
      { q: 'How do I create an account?', a: 'Click "Get Started" on the landing page or "Register" on the login page. Fill in your personal details including name, email, mobile number, and address. Once registered, you will receive a verification email.' },
      { q: 'How do I link my electric service account?', a: 'After logging in, go to your Profile and select "Linked Accounts". Enter your Consumer Account Number (CAN) and verify ownership to link your service account.' },
      { q: 'What should I do if I forget my password?', a: 'Click "Forgot Password?" on the login page. Enter your registered email address, and we will send you instructions to reset your password.' },
      { q: 'Can I update my personal information?', a: 'Yes. Log in and go to your Profile page where you can update your name, contact information, and address. Some changes may require verification.' },
    ],
  },
  {
    icon: 'CreditCard', name: 'Billing and Payments',
    questions: [
      { q: 'How can I view my bill?', a: 'Log in and click "Billing" from the dashboard. Your current bill statement is displayed along with your billing history.' },
      { q: 'What payment methods are accepted?', a: 'ANTECOConnect supports GCash, Maya, bank transfer, credit/debit card, and cash payments at our office.' },
      { q: 'Can I download my bill as PDF?', a: 'Yes. On the billing page, click the download icon next to any billing statement to save it as a PDF file.' },
      { q: 'What happens if I miss the payment due date?', a: 'A late payment penalty may be applied to your next bill. We recommend setting up payment reminders to avoid missing due dates.' },
    ],
  },
  {
    icon: 'AlertTriangle', name: 'Outage Reporting',
    questions: [
      { q: 'How do I report a power outage?', a: 'Log in, go to the Outages page, and click "Report Outage". Select the type of issue, provide your location and a description, then submit. You will receive a reference number.' },
      { q: 'How can I track my outage report?', a: 'On the Outages page, enter your reference number in the tracking field to see the current status and estimated restoration time.' },
      { q: 'What types of outages can I report?', a: 'You can report no power, low voltage, fluctuating voltage, damaged lines, damaged meters, transformer issues, and other electrical concerns.' },
    ],
  },
  {
    icon: 'FileText', name: 'Service Requests',
    questions: [
      { q: 'What service requests can I submit online?', a: 'You can request new connections, reconnections, meter installations, meter relocations, change of account holder, and other services.' },
      { q: 'How long does it take to process a service request?', a: 'Processing time depends on the type of request. Simple requests may be processed within 1-3 business days, while complex requests may take longer.' },
      { q: 'Can I cancel a pending request?', a: 'Yes. Go to your Service Requests page and click "Cancel" on any pending request. Once a request is in progress, please contact support to discuss cancellation.' },
    ],
  },
  {
    icon: 'Headphones', name: 'Technical Support',
    questions: [
      { q: 'What should I do if the app is not working?', a: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team.' },
      { q: 'Is my data secure?', a: 'Yes. ANTECOConnect uses industry-standard encryption and security measures to protect your personal information and account data.' },
      { q: 'Which browsers are supported?', a: 'ANTECOConnect supports the latest versions of Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge.' },
    ],
  },
];

function path(icon) {
  const icons = {
    User: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    CreditCard: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    AlertTriangle: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    FileText: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    Headphones: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
  };
  return icons[icon] || '';
}

export default function FAQ() {
  const [openCat, setOpenCat] = React.useState(null);
  const [openQ, setOpenQ] = React.useState(null);
  const [search, setSearch] = React.useState('');

  const filtered = categories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-primary-200 uppercase tracking-widest">Help Center</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Find answers to {totalQuestions} common questions about ANTECOConnect and our services.
          </p>
          <div className="max-w-xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text" placeholder="Search for answers..." value={search} onChange={(e) => { setSearch(e.target.value); setOpenCat(null); setOpenQ(null); }}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </section>

      <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {search && filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Try searching with different keywords or browse the categories below.</p>
              <button onClick={() => setSearch('')} className="px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-all">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {(search ? filtered : categories).map((cat, ci) => (
                <div key={cat.name} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
                  <button onClick={() => setOpenCat(openCat === ci ? null : ci)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/50 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path(cat.icon)} />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{cat.name}</h2>
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{cat.questions.length}</span>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openCat === ci ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openCat === ci && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 animate-fade-in">
                      {cat.questions.map((item, qi) => (
                        <div key={qi}>
                          <button onClick={() => setOpenQ(openQ === `${ci}-${qi}` ? null : `${ci}-${qi}`)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <span>{item.q}</span>
                            <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openQ === `${ci}-${qi}` ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          {openQ === `${ci}-${qi}` && (
                            <div className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Still Have Questions?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Our support team is ready to help you with any questions or concerns.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="px-8 py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
                Contact Support
              </Link>
              <Link to="/register" className="px-8 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
