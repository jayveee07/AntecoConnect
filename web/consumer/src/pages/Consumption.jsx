import React from 'react';
import { Zap, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { consumptionService } from '../services';

const defaultMonthly = [
  { month: 'Jan', kwh: 180, cost: 1440 }, { month: 'Feb', kwh: 195, cost: 1560 },
  { month: 'Mar', kwh: 210, cost: 1680 }, { month: 'Apr', kwh: 240, cost: 1920 },
  { month: 'May', kwh: 280, cost: 2240 }, { month: 'Jun', kwh: 260, cost: 2080 },
  { month: 'Jul', kwh: 250, cost: 2000 }, { month: 'Aug', kwh: 270, cost: 2160 },
  { month: 'Sep', kwh: 230, cost: 1840 }, { month: 'Oct', kwh: 200, cost: 1600 },
  { month: 'Nov', kwh: 190, cost: 1520 }, { month: 'Dec', kwh: 220, cost: 1760 },
];

export default function Consumption() {
  const [period, setPeriod] = React.useState('monthly');
  const [consumption, setConsumption] = React.useState(defaultMonthly);
  const [forecast, setForecast] = React.useState(null);
  const [tips, setTips] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const [consRes, foreRes, tipsRes] = await Promise.allSettled([
          consumptionService.getConsumption(),
          consumptionService.getForecast(),
          consumptionService.getSavingTips(),
        ]);
        if (consRes.status === 'fulfilled' && consRes.value?.monthly?.length) {
          setConsumption(consRes.value.monthly.map((m) => ({
            month: m.month || m.periodDate || m.period_date || '',
            kwh: Number(m.kwh || m.consumptionKwh || m.consumption_kwh || 0),
            cost: Number(m.cost || m.estimatedCost || m.estimated_cost || 0),
          })));
        }
        if (foreRes.status === 'fulfilled') setForecast(foreRes.value);
        if (tipsRes.status === 'fulfilled') setTips(tipsRes.value || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalKwh = consumption.reduce((s, m) => s + m.kwh, 0);
  const avgKwh = consumption.length ? Math.round(totalKwh / consumption.length) : 0;
  const lastMonth = consumption[consumption.length - 1] || { kwh: 0 };
  const prevMonth = consumption[consumption.length - 2] || { kwh: 0 };
  const change = prevMonth.kwh ? Math.round(((lastMonth.kwh - prevMonth.kwh) / prevMonth.kwh) * 100) : 0;

  const periods = ['daily', 'weekly', 'monthly', 'yearly'];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Energy Consumption</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitor your electricity usage and trends</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {periods.map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${period === p ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{lastMonth.kwh} kWh</p>
            <p className="text-sm text-gray-500">Current Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`p-3 rounded-xl ${change >= 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
            {change >= 0 ? <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" /> : <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />}
          </div>
          <div>
            <p className="text-2xl font-bold">{change >= 0 ? '+' : ''}{change}%</p>
            <p className="text-sm text-gray-500">vs Last Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{avgKwh} kWh</p>
            <p className="text-sm text-gray-500">Monthly Average</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Usage Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={consumption}>
            <defs>
              <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} /><stop offset="95%" stopColor="#FF6B00" stopOpacity={0} /></linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#9e9e9e" />
            <YAxis stroke="#9e9e9e" />
            <Tooltip />
            <Area type="monotone" dataKey="kwh" stroke="#FF6B00" fill="url(#colorKwh)" strokeWidth={3} />
            <Area type="monotone" dataKey="cost" stroke="#3B82F6" fill="url(#colorCost)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {forecast && (
        <div className="bg-gradient-to-br from-primary-500 to-primary-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">AI Consumption Forecast</h3>
            <Lightbulb className="w-6 h-6 text-yellow-300" />
          </div>
          <p className="text-primary-200 text-sm mb-2">Predicted next month bill</p>
          <p className="text-4xl font-bold mb-2">&#x20B1;{(forecast.predictedValue || forecast.predicted_value || 0).toLocaleString()}</p>
          <p className="text-primary-200 text-sm">Confidence: {forecast.confidenceScore || forecast.confidence_score || 'High'}</p>
        </div>
      )}

      {tips.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Energy Saving Tips</h3>
          <div className="space-y-3">
            {tips.slice(0, 3).map((tip) => (
              <div key={tip.id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">{tip.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{tip.description}</p>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 inline-block">Save up to {tip.estimatedSavingsPercent || tip.estimated_savings_percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
