import React from 'react';

export default function Accessibility() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Accessibility Statement</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400 space-y-6 leading-relaxed">
        <p>Last updated: January 2025</p>
        <p>ANTECO is committed to ensuring that ANTECOConnect is accessible to all users, including those with disabilities. We continuously work to improve the accessibility of our platform to provide a seamless experience for everyone.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Accessibility Features</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Dark mode:</strong> Toggle between light and dark themes for comfortable viewing</li>
          <li><strong>Keyboard navigation:</strong> All interactive elements are accessible via keyboard</li>
          <li><strong>Screen reader support:</strong> Semantic HTML structure and ARIA labels</li>
          <li><strong>High contrast:</strong> Sufficient color contrast ratios for readability</li>
          <li><strong>Responsive design:</strong> Usable across all screen sizes and devices</li>
          <li><strong>Clear typography:</strong> Readable font sizes and line spacing</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Standards and Compliance</h2>
        <p>We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. Our team regularly reviews and tests the platform to identify and address accessibility barriers.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Ongoing Improvements</h2>
        <p>Accessibility is an ongoing effort. We actively seek feedback from our users and work with accessibility experts to identify areas for improvement. As technology evolves, we update our platform to maintain and enhance accessibility.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Need Assistance?</h2>
        <p>If you encounter any accessibility barriers while using ANTECOConnect, or if you need assistance accessing any content or feature, please contact us:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email: accessibility@anteco.ph</li>
          <li>Phone: (036) 540-8001</li>
          <li>Visit our office at ANTECO Building, San Jose de Buenavista, Antique</li>
        </ul>
      </div>
    </div>
  );
}
