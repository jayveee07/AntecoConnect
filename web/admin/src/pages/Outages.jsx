import React from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle, UserCheck } from 'lucide-react';
import { adminOutageService } from '../services';

const defaultOutages = [
  { id: 1, type: 'Power Outage', barangay: 'San Roque', city: 'San Juan', status: 'in_progress', priority: 'high', team: 'Team Alpha', ticket: 'OTG-2024-001', time: '2 hours ago' },
  { id: 2, type: 'Low Voltage', barangay: 'Barangay 1', city: 'Malolos', status: 'verified', priority: 'medium', team: null, ticket: 'OTG-2024-002', time: '4 hours ago' },
  { id: 3, type: 'Transformer Issue', barangay: 'Bayanan', city: 'Mabini', status: 'reported', priority: 'critical', team: null, ticket: 'OTG-2024-003', time: '30 min ago' },
  { id: 4, type: 'Fallen Pole', barangay: 'San Jose', city: 'Batangas', status: 'resolved', priority: 'critical', team: 'Team Bravo', ticket: 'OTG-2024-004', time: '1 day ago' },
];

export default function Outages() {
  const [outages, setOutages] = React.useState(defaultOutages);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminOutageService.getAll();
        if (res.data?.data) {
          setOutages(res.data.data);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColors = { reported: 'badge-warning', verified: 'badge-info', in_progress: 'badge-warning', resolved: 'badge-success', closed: 'badge-success' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Outage Management</h1>
          <p className="text-gray-400">Monitor and manage power outages across all service areas</p>
        </div>
        <select className="input-field w-44">
          <option>All Areas</option>
          <option>San Juan</option>
          <option>Malolos</option>
          <option>Mabini</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-red-500"><p className="text-2xl font-bold text-red-400">3</p><p className="text-sm text-gray-400">Active Outages</p></div>
        <div className="card border-l-4 border-orange-500"><p className="text-2xl font-bold text-orange-400">1</p><p className="text-sm text-gray-400">Critical</p></div>
        <div className="card border-l-4 border-yellow-500"><p className="text-2xl font-bold text-yellow-400">2</p><p className="text-sm text-gray-400">Unassigned</p></div>
        <div className="card border-l-4 border-green-500"><p className="text-2xl font-bold text-green-400">45 min</p><p className="text-sm text-gray-400">Avg Response</p></div>
      </div>

      <div className="space-y-3">
        {outages.map((o) => (
          <div key={o.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${o.status === 'resolved' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {o.status === 'resolved' ? <CheckCircle className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />}
              </div>
              <div>
                <p className="font-semibold">{o.type}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{o.barangay}, {o.city}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{o.time}</span>
                </div>
                <p className="text-xs text-gray-500">Ticket: {o.ticket}</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <span className={`badge ${statusColors[o.status]}`}>{o.status.replace('_', ' ')}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${o.priority === 'critical' ? 'text-red-400' : o.priority === 'high' ? 'text-orange-400' : 'text-yellow-400'}`}>{o.priority.toUpperCase()}</span>
                {o.team ? (
                  <span className="text-xs text-gray-400 flex items-center gap-1"><UserCheck className="w-3 h-3" />{o.team}</span>
                ) : (
                  <button className="text-xs text-primary-400 hover:underline">Assign Team</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
