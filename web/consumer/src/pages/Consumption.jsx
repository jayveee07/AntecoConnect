import React from 'react';
import { Zap, TrendingUp, TrendingDown, Lightbulb, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { consumptionService } from '../services';

export default function Consumption() {
  const [period, setPeriod] = React.useState('monthly');
  const [data, setData] = React.useState([]);
  const [stats, setStats] = React.useState({ current: 0, change: 0, avg: 0 });
  const [forecast, setForecast] = React.useState(null);
  const [tips, setTips] = React.useState([]);

  React.useEffect(() => {
    Promise.allSettled([
      consumptionService.getConsumption({ period }),
      consumptionService.getForecast(),
      consumptionService.getSavingTips(),
    ]).then(([cRes, fRes, tRes]) => {
      if (cRes.status === 'fulfilled') {
        const d = cRes.value.data;
        const records = d.consumption || d.data || [];
        setData(records.map((r) => ({
          month: r.period_date || r.month || r.billing_period || '',
          kwh: Number(r.consumption_kwh || r.kwh || 0),
          cost: Number(r.estimated_cost || r.cost || 0),
        })));
        setStats({
          current: d.current_month_kwh || d.current || 0,
          change: d.change_vs_last_month || d.change || 0,
          avg: d.average_daily || d.avg || 0,
        });
      }
      if (fRes.status === 'fulfilled') {
        setForecast(fRes.value.data.forecast || fRes.value.data.data || fRes.value.data);
      }
      if (tRes.status === 'fulfilled') {
        setTips(tRes.value.data.tips || tRes.value.data.data || []);
      }
    });
  }, [period]);

  const periods = ['daily', 'weekly', 'monthly', 'yearly'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Energy Consumption</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor your electricity usage and trends</p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                period === p ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.current} kWh</p>
            <p className="text-sm text-gray-500">Current {period}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`p-3 rounded-xl ${stats.change < 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {stats.change < 0 ? <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" /> : <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />}
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.change}%</p>
            <p className="text-sm text-gray-500">vs Last {period}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.avg} kWh/day</p>
            <p className="text-sm text-gray-500">Average Daily</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Usage Trend</h3>
        {data.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No consumption data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0057B8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0057B8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="kwh" stroke="#0057B8" fill="url(#colorKwh)" strokeWidth={3} name="kWh" />
              <Area yAxisId="right" type="monotone" dataKey="cost" stroke="#FFC107" fill="url(#colorCost)" strokeWidth={3} name="Cost (₱)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">AI Consumption Forecast</h3>
          <div className="bg-primary-50 dark:bg-primary-950 rounded-xl p-6 text-center">
            <Lightbulb className="w-12 h-12 text-electric-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-primary-500">
              ₱{forecast?.predicted_value?.toLocaleString() || forecast?.estimated_cost?.toLocaleString() || '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Estimated Next Bill</p>
            {forecast?.confidence_score && (
              <p className="text-xs text-green-500 font-medium mt-2">{forecast.confidence_score}% confidence based on your usage patterns</p>
            )}
          </div>
          {forecast?.recommendations?.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-500">AI Recommendations:</p>
              <ul className="space-y-2">
                {forecast.recommendations.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-electric-500 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Energy Saving Tips</h3>
          <div className="space-y-4">
            {tips.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No saving tips available</p>
            ) : tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-electric-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{tip.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                    </div>
                  </div>
                  {tip.estimated_savings_percent && (
                    <span className="badge-success shrink-0">Save {tip.estimated_savings_percent}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
