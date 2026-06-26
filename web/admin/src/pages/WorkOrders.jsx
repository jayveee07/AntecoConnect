import React from 'react';
import { ClipboardList, Clock, CheckCircle, UserCheck, MapPin, Wrench } from 'lucide-react';
import { workOrderService } from '../services';

const defaultOrders = [
  { id: 1, type: 'Meter Replacement', address: '123 Rizal St., San Roque', status: 'in_progress', tech: 'Jose Santos', priority: 'urgent', scheduled: 'June 17, 2024' },
  { id: 2, type: 'Reconnection', address: '456 Mabini St., Barangay 1', status: 'assigned', tech: 'Pedro Lim', priority: 'routine', scheduled: 'June 18, 2024' },
  { id: 3, type: 'Service Installation', address: '789 Luna St., Bayanan', status: 'pending', tech: null, priority: 'routine', scheduled: 'June 19, 2024' },
  { id: 4, type: 'Emergency Repair', address: '321 Rizal St., Poblacion', status: 'completed', tech: 'Jose Santos', priority: 'emergency', scheduled: 'June 16, 2024' },
];

export default function WorkOrders() {
  const [orders, setOrders] = React.useState(defaultOrders);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await workOrderService.getAll();
        if (res.data?.data) {
          setOrders(res.data.data);
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
        <div><h1 className="text-2xl font-bold">Work Orders</h1><p className="text-gray-400">Manage field operations and technician assignments</p></div>
        <button className="btn-primary">+ Create Work Order</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-2xl font-bold text-blue-400">12</p><p className="text-sm text-gray-400">Total Open</p></div>
        <div className="card"><p className="text-2xl font-bold text-yellow-400">5</p><p className="text-sm text-gray-400">Pending</p></div>
        <div className="card"><p className="text-2xl font-bold text-green-400">4</p><p className="text-sm text-gray-400">In Progress</p></div>
        <div className="card"><p className="text-2xl font-bold text-purple-400">8</p><p className="text-sm text-gray-400">Completed Today</p></div>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  o.status === 'completed' ? 'bg-green-500/20' :
                  o.status === 'in_progress' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                }`}>
                  <ClipboardList className={`w-6 h-6 ${
                    o.status === 'completed' ? 'text-green-400' :
                    o.status === 'in_progress' ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{o.type}</p>
                    <span className={`badge ${o.priority === 'emergency' ? 'badge-danger' : o.priority === 'urgent' ? 'badge-warning' : 'badge-info'}`}>{o.priority}</span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{o.address}</p>
                  <p className="text-xs text-gray-500 mt-1">Scheduled: {o.scheduled}</p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <span className={`badge ${
                  o.status === 'completed' ? 'badge-success' :
                  o.status === 'in_progress' ? 'badge-info' :
                  o.status === 'assigned' ? 'badge-warning' : 'badge-warning'
                }`}>{o.status.replace('_', ' ')}</span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {o.tech ? (
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" />{o.tech}</span>
                  ) : (
                    <button className="text-primary-400 text-xs hover:underline">Assign</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
