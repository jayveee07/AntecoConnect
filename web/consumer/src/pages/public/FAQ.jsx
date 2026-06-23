import React from 'react';

const categories = [
  {
    name: 'Account Management',
    questions: [
      { q: 'How do I create an account?', a: 'Click "Get Started" on the landing page or "Register" on the login page. Fill in your personal details including name, email, mobile number, and address. Once registered, you will receive a verification email.' },
      { q: 'How do I link my electric service account?', a: 'After logging in, go to your Profile and select "Linked Accounts". Enter your account number and follow the verification process to link your service account.' },
      { q: 'What should I do if I forget my password?', a: 'Click the "Forgot Password?" link on the login page. Enter your registered email address, and we will send you instructions to reset your password.' },
      { q: 'Can I update my personal information?', a: 'Yes. Log in and go to your Profile page where you can update your name, contact information, and address. Some changes may require verification.' },
    ],
  },
  {
    name: 'Billing and Payments',
    questions: [
      { q: 'How can I view my bill?', a: 'Log in and click "Billing" from the dashboard or sidebar. Your current bill statement is displayed along with your billing history.' },
      { q: 'What payment methods are accepted?', a: 'ANTECOConnect supports GCash, Maya, bank transfer, credit/debit card, and cash payments at our office.' },
      { q: 'Can I download my bill as PDF?', a: 'Yes. On the billing page, click the download icon next to any billing statement to save it as a PDF file.' },
      { q: 'What happens if I miss the payment due date?', a: 'A late payment penalty may be applied to your next bill. We recommend setting up payment reminders to avoid missing due dates.' },
    ],
  },
  {
    name: 'Outage Reporting',
    questions: [
      { q: 'How do I report a power outage?', a: 'Log in, go to the Outages page, and click "Report Outage". Select the type of issue, provide your location and a description, then submit. You will receive a reference number.' },
      { q: 'How can I track my outage report?', a: 'On the Outages page, enter your reference number in the tracking field to see the current status and estimated restoration time.' },
      { q: 'What types of outages can I report?', a: 'You can report no power, low voltage, fluctuating voltage, damaged lines, damaged meters, transformer issues, and other electrical concerns.' },
    ],
  },
  {
    name: 'Service Requests',
    questions: [
      { q: 'What service requests can I submit online?', a: 'You can request new connections, reconnections, meter installations, meter relocations, change of account holder, and other services.' },
      { q: 'How long does it take to process a service request?', a: 'Processing time depends on the type of request. Simple requests may be processed within 1-3 business days, while complex requests may take longer.' },
      { q: 'Can I cancel a pending request?', a: 'Yes. Go to your Service Requests page and click "Cancel" on any pending request. Once a request is in progress, please contact support to discuss cancellation.' },
    ],
  },
  {
    name: 'Technical Support',
    questions: [
      { q: 'What should I do if the app is not working?', a: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team.' },
      { q: 'Is my data secure?', a: 'Yes. ANTECOConnect uses industry-standard encryption and security measures to protect your personal information and account data.' },
      { q: 'Which browsers are supported?', a: 'ANTECOConnect supports the latest versions of Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge.' },
    ],
  },
];

export default function FAQ() {
  const [openCat, setOpenCat] = React.useState(null);
  const [openQ, setOpenQ] = React.useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Find answers to common questions about ANTECOConnect and our services.</p>
      </div>
      <div className="space-y-6">
        {categories.map((cat, ci) => (
          <div key={cat.name} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setOpenCat(openCat === ci ? null : ci)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/50 text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{cat.name}</h2>
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
    </div>
  );
}
