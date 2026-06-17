import React from 'react';
import { Search, Shield, MoreHorizontal } from 'lucide-react';

const users = [
  { id: 1, name: 'Admin User', email: 'admin@anteconect.com', role: 'Super Administrator', status: 'active', mfa: true },
  { id: 2, name: 'Maria Cruz', email: 'maria@anteconect.com', role: 'Billing Manager', status: 'active', mfa: true },
  { id: 3, name: 'Jose Santos', email: 'jose@anteconect.com', role: 'Field Technician', status: 'active', mfa: false },
  { id: 4, name: 'Ana Reyes', email: 'ana@anteconect.com', role: 'Customer Support', status: 'active', mfa: false },
  { id: 5, name: 'Pedro Lim', email: 'pedro@anteconect.com', role: 'Meter Reader', status: 'inactive', mfa: false },
];

export default function Users() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-400">Manage system users, roles, and permissions</p>
        </div>
        <button className="btn-primary">+ Add User</button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input className="input-field pl-12" placeholder="Search users..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-700 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Role</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary-400" />
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{user.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">MFA</span>
                <span className={user.mfa ? 'text-green-400' : 'text-gray-500'}>{user.mfa ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
