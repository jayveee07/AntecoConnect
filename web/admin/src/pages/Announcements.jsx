import React from 'react';
import { Megaphone, Plus, Bell, Calendar, Clock } from 'lucide-react';
import { announcementService } from '../services';

const defaultAnnouncements = [
  { id: 1, title: 'Scheduled Power Maintenance - June 20', type: 'maintenance', priority: 'high', status: 'upcoming', date: 'June 18, 2024', areas: ['San Roque', 'Barangay 1'] },
  { id: 2, title: 'Billing Period Extended for May', type: 'billing', priority: 'medium', status: 'active', date: 'June 15, 2024', areas: ['All Areas'] },
  { id: 3, title: 'System Upgrade Notice', type: 'general', priority: 'low', status: 'active', date: 'June 10, 2024', areas: ['All Areas'] },
  { id: 4, title: 'Emergency Outage - Transformer Repair', type: 'emergency', priority: 'urgent', status: 'upcoming', date: 'June 17, 2024', areas: ['Bayanan'] },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = React.useState(defaultAnnouncements);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await announcementService.getAll();
        if (res.data?.data) {
          setAnnouncements(res.data.data);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Announcements</h1><p className="text-gray-400">Create and manage public announcements & alerts</p></div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Announcement</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-2xl font-bold text-blue-400">4</p><p className="text-sm text-gray-400">Active</p></div>
        <div className="card"><p className="text-2xl font-bold text-yellow-400">2</p><p className="text-sm text-gray-400">Upcoming</p></div>
        <div className="card"><p className="text-2xl font-bold text-red-400">1</p><p className="text-sm text-gray-400">Emergency</p></div>
        <div className="card"><p className="text-2xl font-bold text-purple-400">12</p><p className="text-sm text-gray-400">This Month</p></div>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  a.type === 'emergency' ? 'bg-red-500/20' :
                  a.type === 'maintenance' ? 'bg-orange-500/20' :
                  a.type === 'billing' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                }`}>
                  <Megaphone className={`w-5 h-5 ${
                    a.type === 'emergency' ? 'text-red-400' :
                    a.type === 'maintenance' ? 'text-orange-400' : 'text-blue-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{a.title}</p>
                    <span className={`badge ${a.priority === 'urgent' ? 'badge-danger' : a.priority === 'high' ? 'badge-warning' : 'badge-info'}`}>{a.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                    <span className="flex items-center gap-1"><Bell className="w-3 h-3" />{a.areas.join(', ')}</span>
                  </div>
                </div>
              </div>
              <span className={`badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
