import React from 'react';
import { Map as MapIcon, Zap, Bell, Filter, Layers, Download } from 'lucide-react';
import { gisService } from '../services';

const defaultLayers = [
  { label: 'Consumer Locations', count: '45,892', color: 'blue' },
  { label: 'Electric Poles', count: '8,230', color: 'green' },
  { label: 'Transformers', count: '1,456', color: 'orange' },
  { label: 'Feeders', count: '24', color: 'purple' },
  { label: 'Service Areas', count: '12', color: 'yellow' },
  { label: 'Active Outages', count: '3', color: 'red' },
];

const defaultQuickStats = [
  { label: 'Poles', value: '8,230' },
  { label: 'Transformers', value: '1,456' },
  { label: 'Feeders', value: '24' },
  { label: 'Service Areas', value: '12' },
];

export default function GIS() {
  const [layers, setLayers] = React.useState(defaultLayers);
  const [quickStats, setQuickStats] = React.useState(defaultQuickStats);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [polesRes, transformersRes, feedersRes] = await Promise.all([
          gisService.getPoles(),
          gisService.getTransformers(),
          gisService.getFeeders(),
        ]);
        if (polesRes.data?.data || transformersRes.data?.data || feedersRes.data?.data) {
          const newLayers = [...defaultLayers];
          const newStats = [...defaultQuickStats];
          if (polesRes.data?.data) {
            newLayers[1] = { ...newLayers[1], count: String(polesRes.data.data.length || polesRes.data.data) };
            newStats[0] = { ...newStats[0], value: String(polesRes.data.data.length || polesRes.data.data) };
          }
          if (transformersRes.data?.data) {
            newLayers[2] = { ...newLayers[2], count: String(transformersRes.data.data.length || transformersRes.data.data) };
            newStats[1] = { ...newStats[1], value: String(transformersRes.data.data.length || transformersRes.data.data) };
          }
          if (feedersRes.data?.data) {
            newLayers[3] = { ...newLayers[3], count: String(feedersRes.data.data.length || feedersRes.data.data) };
            newStats[2] = { ...newStats[2], value: String(feedersRes.data.data.length || feedersRes.data.data) };
          }
          setLayers(newLayers);
          setQuickStats(newStats);
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
        <div><h1 className="text-2xl font-bold">GIS Mapping</h1><p className="text-gray-400">Geographic information system for infrastructure management</p></div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><Layers className="w-4 h-4" /> Layers</button>
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-64 space-y-3">
          <div className="card">
            <h3 className="font-semibold mb-3">Map Layers</h3>
            <div className="space-y-2">
              {layers.map((layer, i) => (
                <label key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>{layer.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{layer.count}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              {quickStats.map((stat, i) => (
                <div key={i} className="flex justify-between"><span className="text-gray-400">{stat.label}</span><span>{stat.value}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 card flex items-center justify-center min-h-[600px] bg-gray-700/50">
          <div className="text-center">
            <MapIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-400">Google Maps Integration</p>
            <p className="text-sm text-gray-500 mt-2">Connect Google Maps API key in settings to enable the interactive GIS map.</p>
            <p className="text-xs text-gray-600 mt-4">API Key: Configured in .env (GOOGLE_MAPS_API_KEY)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
