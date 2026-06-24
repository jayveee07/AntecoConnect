import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400 space-y-6 leading-relaxed">
        <p>Last updated: January 2025</p>
        <p>ANTECO respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use ANTECOConnect.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Information We Collect</h2>
        <p>We collect information you provide directly to us, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Full name, email address, mobile number, and home address</li>
          <li>Electric service account numbers and meter numbers</li>
          <li>Billing and payment history</li>
          <li>Outage reports, service requests, and support tickets</li>
          <li>Profile photos and uploaded documents</li>
          <li>Communication preferences and settings</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide and maintain your ANTECOConnect account</li>
          <li>To process billing statements and payments</li>
          <li>To respond to outage reports and service requests</li>
          <li>To send important notices about your account and service</li>
          <li>To improve our services and user experience</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Data Protection</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security assessments.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Data Retention</h2>
        <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. When data is no longer needed, we securely delete or anonymize it.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Your Rights</h2>
        <p>Under the Philippine Data Privacy Act, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access your personal data held by us</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (subject to legal requirements)</li>
          <li>Object to the processing of your data</li>
          <li>Data portability</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Contact Us</h2>
        <p>If you have questions about this Privacy Policy or wish to exercise your data privacy rights, please contact our Data Protection Officer at privacy@anteco.ph or visit our office at ANTECO Building, San Jose de Buenavista, Antique.</p>
      </div>
    </div>
  );
}
