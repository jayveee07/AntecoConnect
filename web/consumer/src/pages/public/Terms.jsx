import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Terms and Conditions</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400 space-y-6 leading-relaxed">
        <p>Last updated: January 2025</p>
        <p>By accessing or using ANTECOConnect, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our platform.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Account Registration</h2>
        <p>To use ANTECOConnect, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Acceptable Use</h2>
        <p>You agree to use ANTECOConnect only for lawful purposes and in accordance with these terms. You must not:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide false or misleading information</li>
          <li>Attempt to access another user's account without authorization</li>
          <li>Use the platform for any fraudulent or illegal activity</li>
          <li>Interfere with the proper functioning of the platform</li>
          <li>Upload malicious code or content</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Billing and Payments</h2>
        <p>All billing information displayed on ANTECOConnect is for reference purposes. Official billing statements from ANTECO remain the authoritative record of your account. Payments made through the platform are subject to verification and processing times.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Service Availability</h2>
        <p>We strive to maintain high availability of ANTECOConnect, but we do not guarantee uninterrupted access. Temporary downtime may occur for maintenance, updates, or factors beyond our control.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Limitation of Liability</h2>
        <p>ANTECO shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of ANTECOConnect. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. We will notify users of material changes through the platform or via email. Continued use after changes constitutes acceptance of the updated terms.</p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Contact</h2>
        <p>For questions about these Terms and Conditions, please contact us at support@anteco.ph or visit our office at ANTECO Building, Sumulong Highway, Antipolo City.</p>
      </div>
    </div>
  );
}
