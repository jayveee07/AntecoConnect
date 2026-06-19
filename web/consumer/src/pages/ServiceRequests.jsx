import React from 'react';
import { ClipboardList, CheckCircle, Clock, XCircle, Plus, ChevronRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { serviceRequestService } from '../services';

const serviceTypes = ['New Connection', 'Reconnection', 'Change Ownership', 'Meter Calibration', 'Meter Transfer', 'Disconnection'];

export default function ServiceRequests() {
  const [requests, setRequests] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({ type: '', description: '', preferred_date: '' });

  React.useEffect(() => {
    serviceRequestService.getRequests().then(({ data }) => {
      setRequests(data.requests || data.data || []);
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.type) { toast.error('Select a service type'); return; }
    setSubmitting(true);
    try {
      await serviceRequestService.createRequest(form);
      toast.success('Request submitted!');
      setShowForm(false);
      setForm({ type: '', description: '', preferred_date: '' });
      const { data } = await serviceRequestService.getRequests();
      setRequests(data.requests || data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const services = [
    { label: 'New Connection', icon: Plus, color: 'bg-blue-500' },
    { label: 'Reconnection', icon: Clock, color: 'bg-orange-500' },
    { label: 'Change Ownership', icon: ChevronRight, color: 'bg-purple-500' },
    { label: 'Meter Transfer', icon: ClipboardList, color: 'bg-green-500' },
  ];

  const statusConfig = {
    approved: { icon: CheckCircle, color: 'text-green-500', badge: 'badge-info' },
    under_review: { icon: Clock, color: 'text-blue-500', badge: 'badge-warning' },
    submitted: { icon: Clock, color: 'text-blue-500', badge: 'badge-warning' },
    completed: { icon: CheckCircle, color: 'text-green-500', badge: 'badge-success' },
    rejected: { icon: XCircle, color: 'text-red-500', badge: 'badge-danger' },
    cancelled: { icon: XCircle, color: 'text-gray-500', badge: 'badge-danger' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Apply for new connections and other services</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {showForm && (
        <div className="card border-2 border-primary-200 dark:border-primary-800">
          <h3 className="font-semibold text-lg mb-4">New Service Request</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="">Select type...</option>
                {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Date</label>
              <input type="date" className="input-field" value={form.preferred_date}
                onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea className="input-field" rows={3} placeholder="Describe your request..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s, i) => (
          <button key={i} onClick={() => { setForm({ ...form, type: s.label }); setShowForm(true); }} className="card-hover text-center">
            <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-sm">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">My Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No service requests yet</p>
        ) : requests.map((req, i) => {
          const cfg = statusConfig[req.status] || { icon: Clock, color: 'text-blue-500', badge: 'badge-warning' };
          const StatusIcon = cfg.icon;
          return (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mb-2">
              <div className="flex items-center gap-4">
                <StatusIcon className={`w-6 h-6 ${cfg.color}`} />
                <div>
                  <p className="font-medium">{req.type}</p>
                  <p className="text-sm text-gray-500">Ref: {req.request_number}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={cfg.badge}>{req.status.replace('_', ' ')}</span>
                <p className="text-xs text-gray-400 mt-1">{req.created_at}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
