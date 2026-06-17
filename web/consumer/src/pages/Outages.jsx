import React from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle, Send, Search } from 'lucide-react';

const outages = [
  { id: 1, type: 'Power Outage', barangay: 'San Roque', city: 'San Juan', status: 'in_progress', priority: 'high', ticket: 'OTG-2024-001' },
  { id: 2, type: 'Low Voltage', barangay: 'Barangay 1', city: 'Malolos', status: 'resolved', priority: 'medium', ticket: 'OTG-2024-002' },
  { id: 3, type: 'Transformer Issue', barangay: 'Bayanan', city: 'Mabini', status: 'reported', priority: 'critical', ticket: 'OTG-2024-003' },
];

export default function Outages() {
  const [showReport, setShowReport] = React.useState(false);
  const [trackTicket, setTrackTicket] = React.useState('');

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Power Outage', 'Low Voltage', 'High Voltage', 'Broken Meter', 'Fallen Pole', 'Transformer Issue'].map((type) => (
                <button key={type} className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 text-sm font-medium">
                  {type}
                </button>
              ))}
            </div>
            <input className="input-field" placeholder="Street Address" />
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="Barangay" />
              <input className="input-field" placeholder="City/Municipality" />
            </div>
            <textarea className="input-field" rows={3} placeholder="Describe the issue in detail..." />
            <button className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Report
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Track Outage Status</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="input-field pl-12"
              placeholder="Enter ticket number (e.g., OTG-...)"
              value={trackTicket}
              onChange={(e) => setTrackTicket(e.target.value)}
            />
          </div>
          <button className="btn-primary">Track</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Ongoing & Recent Outages</h3>
        <div className="space-y-3">
          {outages.map((outage) => {
            const statusColors = {
              reported: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
              in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              resolved: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            };
            const priorityColors = {
              low: 'gray', medium: 'yellow', high: 'orange', critical: 'red',
            };

            return (
              <div key={outage.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    outage.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
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
                    <p className="text-xs text-gray-400">Ticket: {outage.ticket}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${statusColors[outage.status]}`}>
                    {outage.status.replace('_', ' ')}
                  </span>
                  <div className="mt-1">
                    <span className={`text-xs font-medium text-${priorityColors[outage.priority]}-500`}>
                      {outage.priority.toUpperCase()} Priority
                    </span>
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
