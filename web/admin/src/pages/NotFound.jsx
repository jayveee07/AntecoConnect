import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-primary-500">404</h1>
      <p className="text-xl mt-4">Page not found</p>
      <p className="text-gray-400 mt-2">The admin page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">Back to Dashboard</Link>
    </div>
  );
}
