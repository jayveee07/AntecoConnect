import React from 'react';

const contactMethods = [
  { icon: 'Phone', title: 'Hotline', value: '(036) 540-8001', desc: 'Available Monday to Friday, 8:00 AM - 5:00 PM' },
  { icon: 'Smartphone', title: 'Emergency Hotline', value: '(036) 540-8002', desc: '24/7 for urgent outage and emergency reports' },
  { icon: 'Mail', title: 'Email', value: 'support@anteco.ph', desc: 'We respond within 24 hours' },
  { icon: 'MapPin', title: 'Office Address', value: 'ANTECO Building, San Jose de Buenavista', desc: 'Antique, Philippines' },
];

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 dark:from-primary-800 dark:via-gray-900 dark:to-black py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-primary-200 uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">Contact Us</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
            We are here to help. Reach out to us through any of the channels below, and our team will respond promptly.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </section>

      <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <div key={method.title} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon === 'Phone' ? 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' : method.icon === 'Smartphone' ? 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' : method.icon === 'Mail' ? 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' : 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{method.title}</h3>
                    <p className="text-sm text-primary-500 font-medium mt-0.5">{method.value}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{method.desc}</p>
                  </div>
                </div>
              ))}

              <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between"><span>Monday - Friday</span><span className="font-medium text-gray-700 dark:text-gray-300">8:00 AM - 5:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-gray-700 dark:text-gray-300">8:00 AM - 12:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-red-500">Closed</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Us a Message</h2>
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thank you for reaching out. We will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 text-sm text-primary-500 hover:text-primary-600 font-semibold">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all resize-none" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Visit Our Office</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-2">ANTECO Building, San Jose de Buenavista, Antique</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Walk-in inquiries are welcome during office hours. For faster service, we recommend booking online through ANTECOConnect.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
