import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">About ANTECO</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          Antique Electric Cooperative (ANTECO) is a member-owned electric cooperative serving the Province of Antique, Philippines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              To provide reliable, efficient, and affordable electric service to our member-consumer-owners while promoting sustainable energy practices and community development.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              To be a model electric cooperative recognized for operational excellence, innovation, and unwavering commitment to member service and satisfaction.
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { title: 'Integrity', desc: 'We uphold the highest standards of honesty and transparency in all our dealings.' },
            { title: 'Service Excellence', desc: 'We are committed to providing exceptional service to our member-consumer-owners.' },
            { title: 'Innovation', desc: 'We embrace technology and innovation to improve our operations and services.' },
            { title: 'Community', desc: 'We support the development and well-being of the communities we serve.' },
          ].map((v) => (
            <div key={v.title} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Areas</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          ANTECO serves the entire Province of Antique, bringing electricity to municipalities from San Jose de Buenavista to Pandan. Our service coverage continues to expand as we fulfill our commitment to bringing electricity to every household.
        </p>
      </div>
    </div>
  );
}
