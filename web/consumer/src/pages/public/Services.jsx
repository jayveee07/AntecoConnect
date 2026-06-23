import React from 'react';

const services = [
  {
    title: 'Electric Service Connection',
    desc: 'New connection application for residential, commercial, and industrial properties.',
    items: ['Residential connection', 'Commercial connection', 'Industrial connection', 'Temporary connection for events'],
  },
  {
    title: 'Meter Services',
    desc: 'Complete meter installation, relocation, inspection, and calibration services.',
    items: ['New meter installation', 'Meter relocation', 'Meter inspection and testing', 'Meter calibration'],
  },
  {
    title: 'Billing and Payments',
    desc: 'Convenient billing and payment options for your electric consumption.',
    items: ['Monthly billing statements', 'Online payment via GCash, Maya, and bank transfer', 'Payment history and receipts', 'Bill inquiry and dispute resolution'],
  },
  {
    title: 'Outage Management',
    desc: 'Rapid response to power outages and electrical service interruptions.',
    items: ['24/7 outage reporting', 'Real-time restoration tracking', 'Planned interruption notifications', 'Emergency response team dispatch'],
  },
  {
    title: 'Member Services',
    desc: 'Support and assistance for all your cooperative membership needs.',
    items: ['Account management and updates', 'Document requests and certifications', 'Change of account holder', 'Membership inquiries'],
  },
  {
    title: 'Customer Support',
    desc: 'Multiple channels to reach our customer service team.',
    items: ['Hotline support', 'Email inquiries', 'Walk-in counter services', 'Online support ticketing'],
  },
];

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Comprehensive electric cooperative services designed for our member-consumer-owners.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.title} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
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
  );
}
