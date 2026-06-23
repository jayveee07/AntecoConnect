import React from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, Send, Plus, X } from 'lucide-react';
import { supportService } from '../services';
import toast from 'react-hot-toast';

const ticketCategories = ['billing', 'outage', 'meter', 'account', 'payment', 'technical_issue', 'others'];

export default function Support() {
  const [activeTab, setActiveTab] = React.useState('contact');
  const [tickets, setTickets] = React.useState([]);
  const [faqs, setFaqs] = React.useState([]);
  const [openFaq, setOpenFaq] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [showTicketForm, setShowTicketForm] = React.useState(false);
  const [ticketForm, setTicketForm] = React.useState({ category: '', subject: '', description: '' });
  const [submitting, setSubmitting] = React.useState(false);

  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState('');

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const [tickRes, faqRes] = await Promise.allSettled([
          supportService.getTickets(),
          supportService.getFaqs(),
        ]);
        if (tickRes.status === 'fulfilled') setTickets(tickRes.value || []);
        if (faqRes.status === 'fulfilled') setFaqs(faqRes.value || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.category) { toast.error('Please select a category'); return; }
    setSubmitting(true);
    try {
      const res = await supportService.createTicket(ticketForm);
      toast.success(`Ticket created! Reference #: ${res.ticketNumber}`);
      setTicketForm({ category: '', subject: '', description: '' });
      setShowTicketForm(false);
      const updated = await supportService.getTickets();
      setTickets(updated || []);
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      await supportService.sendMessage(selectedTicket.id, newMessage);
      setNewMessage('');
      const updated = await supportService.getTicket(selectedTicket.id);
      setSelectedTicket(updated);
      toast.success('Message sent');
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Support</h1>
          <p className="text-gray-500 dark:text-gray-400">We are here to help you</p>
        </div>
        <button onClick={() => setShowTicketForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'contact', label: 'Contact Info' },
          { key: 'tickets', label: 'My Tickets' },
          { key: 'faq', label: 'FAQs' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Phone, title: 'Hotline', value: '(02) 8532-1234', desc: 'Mon-Fri, 8AM-5PM' },
            { icon: Phone, title: 'Emergency', value: '(02) 8532-5678', desc: '24/7 for outage reports' },
            { icon: Mail, title: 'Email', value: 'support@anteco.ph', desc: 'We respond within 24hrs' },
          ].map((item) => (
            <div key={item.title} className="card text-center">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-primary-500 font-medium mt-1">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">My Support Tickets</h3>
          </div>
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No support tickets yet</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setSelectedTicket(selectedTicket?.id === t.id ? null : t)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.subject}</p>
                        <p className="text-xs text-gray-400">{t.ticketNumber}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      t.status === 'open' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      t.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      t.status === 'resolved' || t.status === 'closed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>{t.status?.replace(/_/g, ' ')}</span>
                  </div>
                  {selectedTicket?.id === t.id && (
                    <div className="mt-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.description}</p>
                      {t.messages && t.messages.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {t.messages.map((m, i) => (
                            <div key={i} className={`p-3 rounded-xl text-sm ${m.isStaffReply ? 'bg-primary-50 dark:bg-primary-900/20 ml-8' : 'bg-gray-50 dark:bg-gray-800 mr-8'}`}>
                              <p className="text-xs text-gray-400 mb-1">{m.isStaffReply ? 'Staff' : 'You'}</p>
                              <p>{m.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                        <button onClick={handleSendMessage} className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all"><Send className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
          {faqs.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No FAQs available</p>
          ) : (
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <div key={f.id || i} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span>{f.question}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showTicketForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowTicketForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Support Ticket</h3>
              <button onClick={() => setShowTicketForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {ticketCategories.map((cat) => (
                    <button key={cat} type="button" onClick={() => setTicketForm({ ...ticketForm, category: cat })}
                      className={`p-3 rounded-xl border-2 text-sm capitalize transition-all ${ticketForm.category === cat ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}>
                      {cat.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" required value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all resize-none" required value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowTicketForm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  {submitting ? 'Submitting...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
