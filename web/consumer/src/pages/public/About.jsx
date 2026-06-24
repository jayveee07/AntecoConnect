import React from 'react';
import { Link } from 'react-router-dom';

const values = [
  { icon: 'Shield', title: 'Integrity', desc: 'We uphold the highest standards of honesty and transparency in all our dealings with members, partners, and each other.' },
  { icon: 'Star', title: 'Service Excellence', desc: 'We are committed to providing exceptional service that exceeds the expectations of our member-consumer-owners.' },
  { icon: 'Zap', title: 'Innovation', desc: 'We embrace technology and innovation to continuously improve our operations and deliver modern solutions.' },
  { icon: 'Heart', title: 'Community', desc: 'We support the development and well-being of the communities we serve through sustainable programs.' },
];

const milestones = [
  { year: '2024', title: 'ANTECOConnect Launch', desc: 'Digital platform launched to bring online billing, outage reporting, and service requests to all members.' },
  { year: '2023', title: 'Substation Expansion', desc: 'New substations commissioned to accommodate growing demand and improve grid reliability across service areas.' },
  { year: '2021', title: 'System Loss Reduction', desc: 'Achieved significant reduction in system loss through infrastructure upgrades and modernization.' },
  { year: '2018', title: 'Energization Milestone', desc: 'Reached 95% household electrification across all municipalities in the service area.' },
];

const team = [
  { role: 'General Manager', name: 'Engr. Roberto M. Villanueva' },
  { role: 'Board President', name: 'Atty. Maria Cristina L. Santos' },
  { role: 'Head, Engineering', name: 'Engr. Jose R. Fernandez' },
  { role: 'Head, Finance', name: 'CPA Ana Marie G. Gonzales' },
];

function path(icon) {
  const icons = {
    Shield: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    Star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    Zap: 'M13 10V3L4 14h7v7l9-11h-7z',
    Heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  };
  return icons[icon] || '';
}

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-primary-200 uppercase tracking-widest">About Us</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">Powering Antique Since Day One</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Antique Electric Cooperative (ANTECO) is a member-owned electric cooperative dedicated to providing reliable, affordable, and sustainable electricity to the Province of Antique.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
      </section>

      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Our Principles</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/10 rounded-2xl p-8 border border-primary-100 dark:border-primary-800">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide reliable, efficient, and affordable electric service to our member-consumer-owners while promoting sustainable energy practices and community development.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                To be a model electric cooperative recognized for operational excellence, innovation, and unwavering commitment to member service and satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Core Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">What We Stand For</h2>
            <p className="text-gray-500 dark:text-gray-400">These values guide every decision we make and every service we deliver.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path(v.icon)} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Milestones</h2>
            <p className="text-gray-500 dark:text-gray-400">Key moments in our commitment to serve the province of Antique.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative flex items-start gap-6">
                {i < milestones.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                )}
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0 border-2 border-primary-200 dark:border-primary-700">
                  <span className="text-xs font-bold text-primary-500">{m.year.slice(2)}</span>
                </div>
                <div className="pb-8">
                  <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{m.year}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1 mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">Our Management Team</h2>
            <p className="text-gray-500 dark:text-gray-400">Dedicated professionals committed to serving our member-consumer-owners.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary-500">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{member.name}</h3>
                <p className="text-xs text-primary-500 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Service Areas</h2>
            <p className="text-gray-500 dark:text-gray-400">Bringing electricity to every corner of Antique.</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/5 rounded-2xl p-8 border border-primary-100 dark:border-primary-800 text-center">
            <div className="w-14 h-14 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              ANTECO serves the entire Province of Antique, bringing electricity to all 18 municipalities from <strong>San Jose de Buenavista</strong> in the south to <strong>Pandan</strong> in the north. Our service coverage continues to expand as we fulfill our commitment to bringing electricity to every household.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Be Part of the ANTECO Community</h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">Create your account today and take control of your electric service.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-2xl shadow-black/20">
              Create Free Account
            </Link>
            <Link to="/services" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur">
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
