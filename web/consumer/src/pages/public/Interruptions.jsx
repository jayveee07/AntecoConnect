import React from 'react';
import { outageService } from '../../services';

const defaultEmergency = [
  { status: 'ongoing', title: 'Emergency Line Repair - Brgy. Funda', desc: 'Our team is working to restore power in portions of Brgy. Funda, San Jose de Buenavista due to a damaged primary line caused by a vehicular accident. Estimated restoration: within 4 hours.', updated: 'Updated 2 hours ago' },
  { status: 'resolved', title: 'Transformer Issue - Brgy. San Angel (Resolved)', desc: 'Power has been fully restored in Brgy. San Angel, Sibalom after a faulty transformer was replaced. Restoration time: 3:45 PM.', updated: 'Resolved yesterday' },
];

export default function Interruptions() {
  const [planned, setPlanned] = React.useState([]);
  const [emergency, setEmergency] = React.useState(defaultEmergency);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const active = await outageService.getActiveInterruptions();
        if (active && active.length > 0) {
          setPlanned(active);
        }
        const all = await outageService.getAllInterruptions();
        if (all && all.length > 0) {
          setPlanned(all);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Power Interruption Schedule</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">Stay informed about planned and emergency power interruptions in your area.</p>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          Emergency Interruptions
        </h2>
        <div className="space-y-4">
          {emergency.map((item) => (
            <div key={item.title} className={`rounded-2xl p-5 border ${item.status === 'ongoing' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.status === 'ongoing' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{item.desc}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{item.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Planned Interruptions</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">Schedule is subject to change</span>
        </div>
        <div className="space-y-4">
          {planned.length > 0 ? planned.map((item, i) => (
            <div key={item.id || i} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-gray-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.startTime ? new Date(item.startTime).toLocaleDateString() : item.date || 'Scheduled'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.time || item.reason || ''}</p>
                  </div>
                </div>
                <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full font-medium">{item.type || item.reason || 'Maintenance'}</span>
              </div>
              {item.areas && Array.isArray(item.areas) && (
                <div className="flex flex-wrap gap-2">
                  {item.areas.map((area, j) => (
                    <span key={j} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">{area}</span>
                  ))}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No planned interruptions at this time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}