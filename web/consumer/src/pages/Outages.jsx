import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Search, MapPin } from 'lucide-react';
import { outageService } from '../services';
import toast from 'react-hot-toast';

const outageTypes = [
  { value: 'power_outage', label: 'No Power', icon: 'Zap' },
  { value: 'low_voltage', label: 'Low Voltage', icon: 'AlertTriangle' },
  { value: 'fluctuating_voltage', label: 'Fluctuating Voltage', icon: 'AlertTriangle' },
  { value: 'damaged_line', label: 'Damaged Line', icon: 'AlertTriangle' },
  { value: 'damaged_meter', label: 'Damaged Meter', icon: 'AlertTriangle' },
  { value: 'transformer_issue', label: 'Transformer Issue', icon: 'AlertTriangle' },
  { value: 'other', label: 'Other', icon: 'AlertTriangle' },
];

const statusConfig = {
  reported: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Reported' },
  verified: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', label: 'Verified' },
  assigned: { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', label: 'Assigned' },
  in_progress: { color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', label: 'In Progress' },
  resolved: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Resolved' },
  closed: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', label: 'Closed' },
};

export default function Outages() {
  const [activeTab, setActiveTab] = React.useState('new');
  const [outages, setOutages] = React.useState([]);
  const [interruptions, setInterruptions] = React.useState([]);
  const [trackingTicket, setTrackingTicket] = React.useState('');
  const [trackedOutage, setTrackedOutage] = React.useState(null);
  const [trackLoading, setTrackLoading] = React.useState(false);
  const [form, setForm] = React.useState({ type: '', address: '', description: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const [outRes, intRes] = await Promise.allSettled([
          outageService.getOutages(),
          outageService.getActiveInterruptions(),
        ]);
        if (outRes.status === 'fulfilled') setOutages(outRes.value || []);
        if (intRes.status === 'fulfilled') setInterruptions(intRes.value || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) { toast.error('Please select an outage type'); return; }
    setSubmitting(true);
    try {
      const result = await outageService.reportOutage(form);
      toast.success(`Outage reported! Reference #: ${result.ticketNumber}`);
      setForm({ type: '', address: '', description: '' });
      setActiveTab('list');
      const updated = await outageService.getOutages();
      setOutages(updated || []);
    } catch (err) {
      toast.error(err.message || 'Failed to report outage');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async () => {
    if (!trackingTicket.trim()) return;
    setTrackLoading(true);
    try {
      const result = await outageService.trackOutage(trackingTicket.trim());
      setTrackedOutage(result);
      if (!result) toast.error('No outage found with that ticket number');
    } catch {
      toast.error('Failed to track outage');
    } finally {
      setTrackLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Outages</h1>
        <p className="text-gray-500 dark:text-gray-400">Report and track power outages in your area</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'new', label: 'Report Outage' },
          { key: 'list', label: 'My Reports' },
          { key: 'track', label: 'Track Status' },
          { key: 'interruptions', label: 'Planned Interruptions' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'new' && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Report Power Outage</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Outage Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {outageTypes.map((t) => (
                  <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${form.type === t.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'}`}>
                    <AlertTriangle className={`w-5 h-5 mb-1 ${form.type === t.value ? 'text-primary-500' : 'text-gray-400'}`} />
                    <p className="text-xs font-medium">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Location / Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Enter the location of the outage" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description (Optional)</label>
              <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all resize-none" placeholder="Provide additional details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
              {submitting ? 'Submitting...' : 'Submit Outage Report'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">My Outage Reports</h3>
          </div>
          {outages.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No outage reports yet</p>
          ) : (
            <div className="space-y-3">
              {outages.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{o.ticketNumber}</p>
                      <p className="text-xs text-gray-400">{o.type} - {o.address}</p>
                      {o.estimatedRestoration && <p className="text-xs text-orange-500 mt-1">Est. restoration: {o.estimatedRestoration}</p>}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${(statusConfig[o.status] || statusConfig.reported).color}`}>
                    {(statusConfig[o.status] || statusConfig.reported).label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'track' && (
        <div className="card space-y-6">
          <h3 className="font-semibold text-lg">Track Outage Status</h3>
          <div className="flex gap-3">
            <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Enter your ticket number (e.g., OUT-XXXX)" value={trackingTicket} onChange={(e) => setTrackingTicket(e.target.value)} />
            <button onClick={handleTrack} disabled={trackLoading} className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center gap-2">
              {trackLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </div>
          {trackedOutage && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">{trackedOutage.ticketNumber}</p>
                  <p className="text-sm text-gray-400">{trackedOutage.type}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${(statusConfig[trackedOutage.status] || statusConfig.reported).color}`}>
                  {(statusConfig[trackedOutage.status] || statusConfig.reported).label}
                </span>
              </div>
              {trackedOutage.updates && trackedOutage.updates.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeline</p>
                  {trackedOutage.updates.map((u, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{(statusConfig[u.status] || { label: u.status }).label}</p>
                        <p className="text-xs text-gray-400">{u.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'interruptions' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Planned & Emergency Interruptions</h3>
          </div>
          {interruptions.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No planned interruptions at this time</p>
          ) : (
            <div className="space-y-3">
              {interruptions.map((i) => (
                <div key={i.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${i.status === 'ongoing' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <div>
                      <p className="font-medium text-sm">{i.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{i.description}</p>
                      {i.startTime && <p className="text-xs text-orange-500 mt-1">Scheduled: {i.startTime}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
