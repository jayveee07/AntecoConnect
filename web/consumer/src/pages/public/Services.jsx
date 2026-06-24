import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: 'Zap', title: 'Electric Service Connection', desc: 'New connection application for residential, commercial, and industrial properties.',
    items: ['Residential connection', 'Commercial connection', 'Industrial connection', 'Temporary connection for events'],
  },
  {
    icon: 'Activity', title: 'Meter Services', desc: 'Complete meter installation, relocation, inspection, and calibration services.',
    items: ['New meter installation', 'Meter relocation', 'Meter inspection and testing', 'Meter calibration'],
  },
  {
    icon: 'CreditCard', title: 'Billing and Payments', desc: 'Convenient billing and payment options for your electric consumption.',
    items: ['Monthly billing statements', 'Online payment via GCash, Maya, and bank transfer', 'Payment history and receipts', 'Bill inquiry and dispute resolution'],
  },
  {
    icon: 'AlertTriangle', title: 'Outage Management', desc: 'Rapid response to power outages and electrical service interruptions.',
    items: ['24/7 outage reporting', 'Real-time restoration tracking', 'Planned interruption notifications', 'Emergency response team dispatch'],
  },
  {
    icon: 'Users', title: 'Member Services', desc: 'Support and assistance for all your cooperative membership needs.',
    items: ['Account management and updates', 'Document requests and certifications', 'Change of account holder', 'Membership inquiries'],
  },
  {
    icon: 'Headphones', title: 'Customer Support', desc: 'Multiple channels to reach our customer service team.',
    items: ['Hotline support', 'Email inquiries', 'Walk-in counter services', 'Online support ticketing'],
  },
];

function path(icon) {
  const icons = {
    Zap: 'M13 10V3L4 14h7v7l9-11h-7z',
    Activity: 'M13 10V3L4 14h7v7l9-11h-7z',
    CreditCard: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    AlertTriangle: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    Users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    Headphones: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
  };
  return icons[icon] || '';
}

export default function Services() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-primary-200 uppercase tracking-widest">Our Services</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">Services We Offer</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Comprehensive electric cooperative services designed for our member-consumer-owners across Antique.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </section>

      <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path(service.icon)} />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{service.desc}</p>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Need an Account?</h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">Access all these services and more by creating your free ANTECOConnect account.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-2xl shadow-black/20">
              Create Free Account
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
