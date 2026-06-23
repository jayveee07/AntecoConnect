import React from 'react';
import { Wrench, Plus, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { serviceRequestService } from '../services';
import toast from 'react-hot-toast';

const requestTypes = [
  { value: 'new_connection', label: 'New Connection', icon: 'Zap' },
  { value: 'reconnection', label: 'Reconnection', icon: 'Zap' },
  { value: 'change_ownership', label: 'Change Ownership', icon: 'User' },
  { value: 'meter_transfer', label: 'Meter Transfer', icon: 'Wrench' },
  { value: 'service_upgrade', label: 'Service Upgrade', icon: 'TrendingUp' },
  { value: 'meter_calibration', label: 'Meter Calibration', icon: 'Wrench' },
  { value: 'temporary_connection', label: 'Temporary Connection', icon: 'Clock' },
  { value: 'others', label: 'Others', icon: 'AlertCircle' },
];

const statusConfig = {
  submitted: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Submitted' },
  under_review: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', label: 'Under Review' },
  approved: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Approved' },
  rejected: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', label: 'Rejected' },
  completed: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', label: 'Completed' },
  cancelled: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500', label: 'Cancelled' },
};

export default function ServiceRequests() {
  const [showForm, setShowForm] = React.useState(false);
  const [requests, setRequests] = React.useState([]);
  const [form, setForm] = React.useState({ type: '', preferred_date: '', notes: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const result = await serviceRequestService.getRequests();
        setRequests(result || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) { toast.error('Please select a request type'); return; }
    setSubmitting(true);
    try {
      const result = await serviceRequestService.createRequest(form);
      toast.success(`Request submitted! Reference #: ${result.requestNumber}`);
      setForm({ type: '', preferred_date: '', notes: '' });
      setShowForm(false);
      const updated = await serviceRequestService.getRequests();
      setRequests(updated || []);
    } catch (err) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await serviceRequestService.cancelRequest(id);
      toast.success('Request cancelled');
      const updated = await serviceRequestService.getRequests();
      setRequests(updated || []);
    } catch {
      toast.error('Failed to cancel request');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Submit and track service requests</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Service Request</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Request Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {requestTypes.map((t) => (
                    <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value })}
                      className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${form.type === t.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Preferred Date (Optional)</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all resize-none" placeholder="Additional details..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No service requests yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Submit a request to get started.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Create First Request</button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <Wrench className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium">{r.type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                  <p className="text-xs text-gray-400">{r.requestNumber}</p>
                  {r.notes && <p className="text-xs text-gray-400 mt-0.5">{r.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${(statusConfig[r.status] || statusConfig.submitted).color}`}>
                  {(statusConfig[r.status] || statusConfig.submitted).label}
                </span>
                {(r.status === 'submitted' || r.status === 'under_review') && (
                  <button onClick={() => handleCancel(r.id)} className="text-xs text-red-500 hover:text-red-600 font-medium">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
