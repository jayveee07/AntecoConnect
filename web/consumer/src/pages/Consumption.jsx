import React from 'react';
import { Zap, TrendingUp, TrendingDown, Lightbulb, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', kwh: 180, cost: 1675 },
  { month: 'Feb', kwh: 195, cost: 1890 },
  { month: 'Mar', kwh: 210, cost: 1980 },
  { month: 'Apr', kwh: 240, cost: 2230 },
  { month: 'May', kwh: 280, cost: 2145 },
  { month: 'Jun', kwh: 260, cost: 2847 },
];

const tips = [
  { title: 'Switch to LED Bulbs', save: '5-10%', desc: 'Replace incandescent bulbs with energy-efficient LEDs' },
  { title: 'Unplug Idle Appliances', save: '3-5%', desc: 'Devices on standby still consume power' },
  { title: 'Optimize Aircon Usage', save: '10-15%', desc: 'Set thermostat to 25°C for optimal efficiency' },
  { title: 'Use Inverter Appliances', save: '20-30%', desc: 'Inverter technology reduces power consumption significantly' },
];

export default function Consumption() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Energy Consumption</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor your electricity usage and trends</p>
        </div>
        <div className="flex gap-2">
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
            <button key={period} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === 'Monthly' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {period}
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
            <p className="text-2xl font-bold">260 kWh</p>
            <p className="text-sm text-gray-500">Current Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
            <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">-7.1%</p>
            <p className="text-sm text-gray-500">vs Last Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">8.67 kWh/day</p>
            <p className="text-sm text-gray-500">Average Daily</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Usage Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyData}>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">AI Consumption Forecast</h3>
          <div className="bg-primary-50 dark:bg-primary-950 rounded-xl p-6 text-center">
            <Lightbulb className="w-12 h-12 text-electric-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-primary-500">₱2,950.00</p>
            <p className="text-sm text-gray-500 mt-1">Estimated Next Bill</p>
            <p className="text-xs text-green-500 font-medium mt-2">85% confidence based on your usage patterns</p>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-500">AI Recommendations:</p>
            <ul className="space-y-2">
              {['Your consumption peaks at 6-9 PM. Consider shifting usage.',
                'January shows lowest usage - great time for energy audits.',
                'You could save ~₱285/month with small efficiency changes.'].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-electric-500 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Energy Saving Tips</h3>
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-electric-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{tip.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{tip.desc}</p>
                    </div>
                  </div>
                  <span className="badge-success shrink-0">Save {tip.save}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
