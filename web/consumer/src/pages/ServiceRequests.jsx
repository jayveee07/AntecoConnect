import React from 'react';
import { ClipboardList, CheckCircle, Clock, XCircle, Plus, ChevronRight } from 'lucide-react';

const requests = [
  { id: 1, type: 'New Connection', status: 'approved', ref: 'SRQ-2024-001', date: 'June 10, 2024' },
  { id: 2, type: 'Change Ownership', status: 'under_review', ref: 'SRQ-2024-002', date: 'June 15, 2024' },
  { id: 3, type: 'Meter Calibration', status: 'completed', ref: 'SRQ-2024-003', date: 'May 20, 2024' },
];

export default function ServiceRequests() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Apply for new connections and other services</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Connection', icon: Plus, color: 'bg-blue-500' },
          { label: 'Reconnection', icon: Clock, color: 'bg-orange-500' },
          { label: 'Change Ownership', icon: ChevronRight, color: 'bg-purple-500' },
          { label: 'Meter Transfer', icon: ClipboardList, color: 'bg-green-500' },
        ].map((service, i) => (
          <button key={i} className="card-hover text-center">
            <div className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <service.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-medium text-sm">{service.label}</p>
          </button>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">My Requests</h3>
        {requests.map((req, i) => {
          const statusIcons = {
            approved: CheckCircle,
            under_review: Clock,
            completed: CheckCircle,
            rejected: XCircle,
          };
          const StatusIcon = statusIcons[req.status] || Clock;
          const statusColors = {
            approved: 'text-green-500',
            under_review: 'text-blue-500',
            completed: 'text-green-500',
            rejected: 'text-red-500',
          };
          const statusBadges = {
            approved: 'badge-info',
            under_review: 'badge-warning',
            completed: 'badge-success',
            rejected: 'badge-danger',
          };

          return (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mb-2">
              <div className="flex items-center gap-4">
                <StatusIcon className={`w-6 h-6 ${statusColors[req.status]}`} />
                <div>
                  <p className="font-medium">{req.type}</p>
                  <p className="text-sm text-gray-500">Ref: {req.ref}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={statusBadges[req.status]}>
                  {req.status.replace('_', ' ')}
                </span>
                <p className="text-xs text-gray-400 mt-1">{req.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
