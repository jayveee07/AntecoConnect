import React from 'react';
import { Search, Filter, ChevronDown, MoreHorizontal, Users, Phone, Mail, MapPin } from 'lucide-react';
import { consumerService } from '../services';

const defaultConsumers = [
  { id: 1, name: 'Juan Dela Cruz', account: 'ANT-2024-0001', meter: 'MTR-12345', barangay: 'San Roque', city: 'San Juan', status: 'active', bill: 2847.50 },
  { id: 2, name: 'Maria Santos', account: 'ANT-2024-0002', meter: 'MTR-12346', barangay: 'Barangay 1', city: 'Malolos', status: 'active', bill: 1980.00 },
  { id: 3, name: 'Pedro Reyes', account: 'ANT-2024-0003', meter: 'MTR-12347', barangay: 'Bayanan', city: 'Mabini', status: 'disconnected', bill: 0 },
  { id: 4, name: 'Ana Gonzales', account: 'ANT-2024-0004', meter: 'MTR-12348', barangay: 'Poblacion', city: 'Lipa', status: 'active', bill: 3350.25 },
  { id: 5, name: 'Carlos Mendoza', account: 'ANT-2024-0005', meter: 'MTR-12349', barangay: 'San Jose', city: 'Batangas', status: 'pending', bill: 0 },
];

export default function Consumers() {
  const [consumers, setConsumers] = React.useState(defaultConsumers);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await consumerService.getAll();
        if (res.data?.data) {
          setConsumers(res.data.data);
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
        <div>
          <h1 className="text-2xl font-bold">Consumer Management</h1>
          <p className="text-gray-400">Manage all registered consumers and accounts</p>
        </div>
        <button className="btn-primary">+ Add Consumer</button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="input-field pl-12" placeholder="Search by name, account number, or meter number..." />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-medium text-gray-400">Consumer</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Account #</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Meter #</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Location</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Current Bill</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {consumers.map((c) => (
              <tr key={c.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-sm font-bold">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3 h-3" /> 09XX-XXX-XXXX
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm">{c.account}</td>
                <td className="p-4 text-sm font-mono">{c.meter}</td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    {c.barangay}, {c.city}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`badge ${
                    c.status === 'active' ? 'badge-success' :
                    c.status === 'disconnected' ? 'badge-danger' : 'badge-warning'
                  }`}>{c.status}</span>
                </td>
                <td className="p-4 text-right font-semibold">
                  {c.bill > 0 ? `₱${c.bill.toFixed(2)}` : '—'}
                </td>
                <td className="p-4">
                  <button className="p-2 hover:bg-gray-700 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
