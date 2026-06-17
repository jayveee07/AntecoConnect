import React from 'react';
import { Phone, Mail, MessageSquare, HelpCircle, ChevronRight, Send } from 'lucide-react';

const faqs = [
  { q: 'How do I read my electric meter?', a: 'Your digital meter shows a 6-digit number. Read from left to right, ignoring any numbers in red.' },
  { q: 'When is my bill due?', a: 'Bills are due every 15th of the month following the billing period.' },
  { q: 'How can I report a power outage?', a: 'You can report outages through the app, hotline, or by visiting your nearest ANTECO office.' },
  { q: 'What payment methods are available?', a: 'We accept GCash, Maya, bank transfers, credit/debit cards, and over-the-counter payments.' },
];

export default function Support() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Customer Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Phone, label: 'Hotline', value: '1800-123-4567', sub: 'Available 24/7', color: 'bg-green-500' },
          { icon: Mail, label: 'Email', value: 'support@anteconect.com', sub: 'Response within 24hrs', color: 'bg-blue-500' },
          { icon: MessageSquare, label: 'Live Chat', value: 'Chat with us', sub: '6AM - 10PM daily', color: 'bg-purple-500' },
        ].map((item, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`${item.color} p-3 rounded-xl`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="p-3 text-sm text-gray-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Send us a Message</h3>
          <div className="space-y-4">
            <input className="input-field" placeholder="Subject" />
            <textarea className="input-field" rows={5} placeholder="Describe your issue or question..." />
            <button className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
