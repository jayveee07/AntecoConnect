import React from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle, Send, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { outageService } from '../services';

export default function Outages() {
  const [showReport, setShowReport] = React.useState(false);
  const [trackTicket, setTrackTicket] = React.useState('');
  const [outages, setOutages] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);

  const [form, setForm] = React.useState({
    type: '', street_address: '', barangay: '', city: '', province: '', description: '',
  });

  React.useEffect(() => {
    outageService.getOutages().then(({ data }) => {
      setOutages(data.outages || data.data || []);
    }).catch(() => {});
  }, []);

  const handleReport = async () => {
    if (!form.type) { toast.error('Select an outage type'); return; }
    if (!form.street_address || !form.barangay) { toast.error('Fill in address fields'); return; }
    setSubmitting(true);
    try {
      await outageService.reportOutage(form);
      toast.success('Outage reported!');
      setShowReport(false);
      setForm({ type: '', street_address: '', barangay: '', city: '', province: '', description: '' });
      const { data } = await outageService.getOutages();
      setOutages(data.outages || data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async () => {
    if (!trackTicket) { toast.error('Enter a ticket number'); return; }
    try {
      const { data } = await outageService.trackOutage(trackTicket);
      toast.success(`Status: ${data.status || 'found'}`);
    } catch {
      toast.error('Ticket not found');
    }
  };

  const outageTypes = ['Power Outage', 'Low Voltage', 'High Voltage', 'Broken Meter', 'Fallen Pole', 'Transformer Issue'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Outage Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Report and track power outages</p>
        </div>
        <button onClick={() => setShowReport(!showReport)} className="btn-primary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Report Outage
        </button>
      </div>

      {showReport && (
        <div className="card animate-slide-up border-2 border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-lg mb-4">Report a Power Issue</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {outageTypes.map((type) => (
                <button key={type} onClick={() => setForm({ ...form, type })}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.type === type ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-600' : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                  }`}>
                  {type}
                </button>
              ))}
            </div>
            <input className="input-field" placeholder="Street Address" value={form.street_address}
              onChange={(e) => setForm({ ...form, street_address: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="Barangay" value={form.barangay}
                onChange={(e) => setForm({ ...form, barangay: e.target.value })} />
              <input className="input-field" placeholder="City/Municipality" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <input className="input-field" placeholder="Province" value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })} />
            <textarea className="input-field" rows={3} placeholder="Describe the issue in detail..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button onClick={handleReport} disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Track Outage Status</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input className="input-field pl-12" placeholder="Enter ticket number"
              value={trackTicket} onChange={(e) => setTrackTicket(e.target.value)} />
          </div>
          <button onClick={handleTrack} className="btn-primary">Track</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Ongoing & Recent Outages</h3>
        <div className="space-y-3">
          {outages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No outages reported</p>
          ) : outages.map((outage) => {
            const statusColors = {
              reported: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
              in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              resolved: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            };
            return (
              <div key={outage.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${outage.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {outage.status === 'resolved'
                      ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      : <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{outage.type}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{outage.barangay}, {outage.city}</span>
                    </div>
                    <p className="text-xs text-gray-400">Ticket: {outage.ticket_number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${statusColors[outage.status] || 'bg-gray-100 text-gray-600'}`}>
                    {outage.status?.replace('_', ' ')}
                  </span>
                  <div className="mt-1">
                    <span className="text-xs font-medium text-gray-500">{outage.priority} Priority</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
