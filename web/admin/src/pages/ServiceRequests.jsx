import React from 'react';
import { Search, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

const requests = [
  { id: 1, type: 'New Connection', name: 'Carlos Mendoza', status: 'under_review', date: 'June 15, 2024', ref: 'SRQ-2024-004' },
  { id: 2, type: 'Change Ownership', name: 'Teresa Reyes', status: 'approved', date: 'June 14, 2024', ref: 'SRQ-2024-003' },
  { id: 3, type: 'Reconnection', name: 'Roberto Santos', status: 'submitted', date: 'June 13, 2024', ref: 'SRQ-2024-002' },
  { id: 4, type: 'Meter Calibration', name: 'Liza Cruz', status: 'completed', date: 'June 10, 2024', ref: 'SRQ-2024-001' },
];

export default function ServiceRequests() {
  const statusColors = {
    submitted: 'badge-warning', under_review: 'badge-info',
    approved: 'badge-success', completed: 'badge-success', rejected: 'badge-danger',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Service Requests</h1><p className="text-gray-400">Manage consumer service applications</p></div>
        <div className="flex gap-2">
          <select className="input-field w-40"><option>All Types</option><option>New Connection</option><option>Reconnection</option></select>
          <select className="input-field w-40"><option>All Status</option><option>Submitted</option><option>Approved</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><p className="text-2xl font-bold text-yellow-400">8</p><p className="text-sm text-gray-400">Pending Review</p></div>
        <div className="card"><p className="text-2xl font-bold text-green-400">12</p><p className="text-sm text-gray-400">Approved This Week</p></div>
        <div className="card"><p className="text-2xl font-bold text-blue-400">3</p><p className="text-sm text-gray-400">Awaiting Scheduling</p></div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input className="input-field pl-12" placeholder="Search by name or reference number..." />
      </div>

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="card flex items-center justify-between cursor-pointer hover:border-primary-500">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${r.status === 'completed' ? 'bg-green-500/20' : r.status === 'approved' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                {r.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                 r.status === 'approved' ? <CheckCircle className="w-5 h-5 text-blue-400" /> :
                 <Clock className="w-5 h-5 text-yellow-400" />}
              </div>
              <div>
                <p className="font-semibold">{r.type}</p>
                <p className="text-sm text-gray-400">{r.name}</p>
                <p className="text-xs text-gray-500">Ref: {r.ref} • {r.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${statusColors[r.status]}`}>{r.status.replace('_', ' ')}</span>
              <button className="p-1.5 hover:bg-gray-700 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
