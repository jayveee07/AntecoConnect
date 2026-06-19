import React from 'react';
import { Phone, Mail, MessageSquare, HelpCircle, ChevronRight, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supportService } from '../services';

export default function Support() {
  const [faqs, setFaqs] = React.useState([]);
  const [form, setForm] = React.useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    supportService.getFaqs().then(({ data }) => {
      setFaqs(data.faqs || data.data || []);
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.subject || !form.message) { toast.error('Fill in all fields'); return; }
    setSubmitting(true);
    try {
      await supportService.createTicket({ subject: form.subject, description: form.message });
      toast.success('Ticket created! We will respond within 24 hours.');
      setForm({ subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

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
            {faqs.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No FAQs available</p>
            ) : faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span className="font-medium text-sm">{faq.question || faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="p-3 text-sm text-gray-500">{faq.answer || faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Send us a Message</h3>
          <div className="space-y-4">
            <input className="input-field" placeholder="Subject" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea className="input-field" rows={5} placeholder="Describe your issue or question..." value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
