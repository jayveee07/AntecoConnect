import React from 'react';


export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="/anteco.png" alt="ANTECO" className="h-16 w-16 mx-auto mb-6 rounded-2xl" />
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">ANTECO CONNECT Management</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input type="email" className="input-field" placeholder="admin@anteconect.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input type="password" className="input-field" placeholder="Enter password" required />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
      </div>
    </div>
  );
}
