import React from 'react';
import { Shield, Bell, Database, Globe, Lock, Users, ChevronRight } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">System Settings</h1>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">General</h3>
        <div className="space-y-2">
          <SettingItem icon={Globe} label="System Configuration" desc="App name, timezone, locale" />
          <SettingItem icon={Bell} label="Notification Settings" desc="Push, email, SMS configuration" />
          <SettingItem icon={Database} label="Data Management" desc="Backup, retention, cleanup" />
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Security</h3>
        <div className="space-y-2">
          <SettingItem icon={Shield} label="Authentication" desc="MFA, OTP, password policies" />
          <SettingItem icon={Lock} label="API Security" desc="API keys, rate limiting, CORS" />
          <SettingItem icon={Users} label="Role Management" desc="RBAC, permissions, access control" />
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Billing Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">VAT Rate (%)</label>
            <input type="number" className="input-field w-48" defaultValue={12} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Penalty Rate (% per month)</label>
            <input type="number" className="input-field w-48" defaultValue={3} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Disconnection Threshold (days after due)</label>
            <input type="number" className="input-field w-48" defaultValue={30} />
          </div>
          <button className="btn-primary">Save Settings</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">API Integration</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Google Maps API Key</label>
            <input className="input-field font-mono text-sm" value="AIzaSy************************************************" readOnly />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Firebase Cloud Messaging Key</label>
            <input className="input-field font-mono text-sm" value="AAAA************************************************" readOnly />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">SMS Provider API Key</label>
            <input className="input-field font-mono text-sm" value="************************************************" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ icon: Icon, label, desc }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary-400" />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500" />
    </div>
  );
}
