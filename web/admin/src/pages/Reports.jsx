import React from 'react';
import { BarChart3, FileText, Download, ChevronRight, TrendingUp, Users, Activity, DollarSign } from 'lucide-react';
import { reportService } from '../services';

const reportTypes = [
  { icon: DollarSign, label: 'Billing Report', desc: 'Complete billing summary for selected period', color: 'bg-blue-500' },
  { icon: TrendingUp, label: 'Collection Report', desc: 'Payment collection and revenue analysis', color: 'bg-green-500' },
  { icon: Users, label: 'Consumer Report', desc: 'Consumer demographics and account status', color: 'bg-purple-500' },
  { icon: Activity, label: 'Operations Report', desc: 'Outage, work order, and service metrics', color: 'bg-orange-500' },
];

const defaultRecentReports = [
  { name: 'June 2024 Billing Summary', type: 'PDF', date: 'June 17, 2024', size: '2.4 MB' },
  { name: 'Q2 2024 Collection Analysis', type: 'Excel', date: 'June 15, 2024', size: '1.8 MB' },
  { name: 'Consumer Growth Report', type: 'PDF', date: 'June 10, 2024', size: '3.1 MB' },
  { name: 'Monthly Operations Overview', type: 'PDF', date: 'June 5, 2024', size: '4.2 MB' },
];

export default function Reports() {
  const [recentReports, setRecentReports] = React.useState(defaultRecentReports);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reportService.getHistory();
        if (res.data?.data) {
          setRecentReports(res.data.data);
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
        <div><h1 className="text-2xl font-bold">Reports</h1><p className="text-gray-400">Generate and download reports</p></div>
        <button className="btn-primary">Generate Custom Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((r, i) => (
          <button key={i} className="card-hover text-left">
            <div className={`${r.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
              <r.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold">{r.label}</p>
            <p className="text-xs text-gray-400 mt-1">{r.desc}</p>
          </button>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Report Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Report Type</label>
            <select className="input-field"><option>Billing Report</option><option>Collection Report</option><option>Consumer Report</option></select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Period</label>
            <select className="input-field"><option>June 2024</option><option>Q2 2024</option><option>2024 YTD</option></select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <select className="input-field"><option>PDF</option><option>Excel</option><option>CSV</option></select>
          </div>
        </div>
        <button className="btn-primary">Generate Report</button>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Recently Generated</h3>
        <div className="space-y-2">
          {recentReports.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.type} • {r.date} • {r.size}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg"><Download className="w-4 h-4 text-gray-400" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
