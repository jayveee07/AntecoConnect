import React from 'react';
import { Search, MapPin, CheckCircle, XCircle, Camera } from 'lucide-react';

const readings = [
  { id: 1, meter: 'MTR-12345', name: 'Juan Dela Cruz', reading: 18450, prev: 18190, status: 'validated', date: 'June 15, 2024', reader: 'Jose Santos' },
  { id: 2, meter: 'MTR-12346', name: 'Maria Santos', reading: 9230, prev: 9020, status: 'pending', date: 'June 15, 2024', reader: 'Pedro Lim' },
  { id: 3, meter: 'MTR-12348', name: 'Ana Gonzales', reading: 15670, prev: 15300, status: 'rejected', date: 'June 14, 2024', reader: 'Jose Santos' },
];

export default function MeterReading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meter Reading Management</h1>
          <p className="text-gray-400">Manage and validate meter readings</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">Schedule Reading</button>
          <button className="btn-primary">+ Enter Reading</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-2xl font-bold text-blue-400">15</p><p className="text-sm text-gray-400">Scheduled Today</p></div>
        <div className="card"><p className="text-2xl font-bold text-yellow-400">8</p><p className="text-sm text-gray-400">In Progress</p></div>
        <div className="card"><p className="text-2xl font-bold text-green-400">42</p><p className="text-sm text-gray-400">Completed Today</p></div>
        <div className="card"><p className="text-2xl font-bold text-red-400">3</p><p className="text-sm text-gray-400">Needs Validation</p></div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input className="input-field pl-12" placeholder="Search by meter number or consumer..." />
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-medium text-gray-400">Meter</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Consumer</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Reading</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Previous</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Consumption</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Reader</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="p-4 text-sm font-mono">{r.meter}</td>
                <td className="p-4 font-medium">{r.name}</td>
                <td className="p-4 text-right font-semibold">{r.reading}</td>
                <td className="p-4 text-right">{r.prev}</td>
                <td className="p-4 text-right font-semibold text-green-400">{r.reading - r.prev}</td>
                <td className="p-4 text-sm">{r.reader}</td>
                <td className="p-4">
                  <span className={`badge ${r.status === 'validated' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{r.status}</span>
                </td>
                <td className="p-4">
                  {r.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-green-500/20 rounded-lg text-green-400"><CheckCircle className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-red-500/20 rounded-lg text-red-400"><XCircle className="w-4 h-4" /></button>
                    </div>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
