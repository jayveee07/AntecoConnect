import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: 'Zap', title: 'Real-Time Billing', desc: 'View and pay your bills anytime, anywhere. Get notified before due dates and track your payment history.' },
  { icon: 'AlertTriangle', title: 'Outage Alerts', desc: 'Report power outages instantly and track restoration progress. Get notified about planned interruptions in your area.' },
  { icon: 'BarChart3', title: 'Energy Insights', desc: 'Monitor your electricity consumption patterns with interactive charts and get AI-powered saving recommendations.' },
  { icon: 'Headphones', title: '24/7 Support', desc: 'Connect with our support team through tickets, contact forms, and FAQs. We are always here to help you.' },
  { icon: 'FileText', title: 'Service Requests', desc: 'Submit and track service requests for connections, reconnections, meter installations, and more.' },
  { icon: 'Smartphone', title: 'Mobile Access', desc: 'Access ANTECOConnect on any device. Available as a mobile app and responsive web application.' },
];

const stats = [
  { value: '100K+', label: 'Households Served' },
  { value: '98%', label: 'Service Reliability' },
  { value: '24/7', label: 'Customer Support' },
  { value: '50+', label: 'Service Areas' },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up with your name and email in under a minute. No hidden fees, no commitments.' },
  { step: '02', title: 'Link Your Service', desc: 'Connect your electric service account using your CAN (Consumer Account Number) in seconds.' },
  { step: '03', title: 'Manage Everything', desc: 'View bills, pay online, report outages, and track consumption — all from one dashboard.' },
];

const whyChoose = [
  { icon: 'Shield', title: 'Secure & Private', desc: 'Industry-standard encryption protects your personal data and payment information.' },
  { icon: 'Clock', title: 'Real-Time Updates', desc: 'Get instant notifications for bill due dates, outage status, and service updates.' },
  { icon: 'Users', title: 'Member-Owned', desc: 'ANTECO is owned by the members we serve. Your satisfaction is our top priority.' },
];

function path(icon) {
  const icons = {
    Shield: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    Clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    Users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    Zap: 'M13 10V3L4 14h7v7l9-11h-7z',
    AlertTriangle: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    BarChart3: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    Headphones: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    FileText: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    Smartphone: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  };
  return icons[icon] || '';
}

export default function Landing() {
  const [faqOpen, setFaqOpen] = React.useState(null);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-4 h-4 bg-primary-300/40 rounded-full" />
          <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-primary-200/30 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 mb-6 border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/80">ANTECOConnect is live</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Powering Progress,<br />
              <span className="text-primary-200">Connecting Lives</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Your digital gateway to ANTECO — manage bills, report outages, track consumption, and access all cooperative services in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-2xl shadow-black/20 text-center">
                Get Started Free
              </Link>
              <Link to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 text-center backdrop-blur">
                Sign In
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
              <span className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Free to use</span>
              <span className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Secure access</span>
              <span className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Available 24/7</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
      </section>

      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-gray-500 dark:text-gray-400">Joining ANTECOConnect takes just minutes. Here is how to get started.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center group">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary-500">{s.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Everything You Need</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your electric cooperative account from anywhere with ANTECOConnect.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path(feature.icon)} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Why ANTECO</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Built for Your Peace of Mind</h2>
            <p className="text-gray-500 dark:text-gray-400">We put our members first in everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChoose.map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path(item.icon)} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">Quick answers to common questions about ANTECOConnect.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: 'What is ANTECOConnect?', a: 'ANTECOConnect is the official digital platform of ANTECO. It allows members to view bills, pay online, report outages, submit service requests, track consumption, and access support services.' },
              { q: 'How do I create an account?', a: 'Click the "Get Started" button and fill out the registration form with your personal details and address. Once registered, you can link your electric service account using your account number.' },
              { q: 'Can I view and pay my bills through ANTECOConnect?', a: 'Yes. You can view your current and past billing statements, download PDF copies, and pay online through integrated payment methods including GCash and Maya.' },
              { q: 'How do I report a power outage?', a: 'Log in to your account, go to the Outages section, and click "Report Outage". Select the type of issue, provide the location and description, and submit. You will receive a reference number to track your report.' },
              { q: 'Is ANTECOConnect free to use?', a: 'Yes, ANTECOConnect is completely free for all ANTECO members. Standard data charges from your internet or mobile provider may apply.' },
            ].map((faq, i) => (
              <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <span>{faq.q}</span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="text-sm text-primary-500 hover:text-primary-600 font-semibold">View all FAQs &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">Join thousands of ANTECO members managing their accounts online. It is free and takes just minutes.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-2xl shadow-black/20">
              Create Free Account
            </Link>
            <Link to="/about" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
