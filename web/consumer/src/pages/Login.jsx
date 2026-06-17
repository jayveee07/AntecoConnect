import React from 'react';


export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <img src="/anteco.png" alt="ANTECO" className="h-16 w-16 mx-auto mb-6 rounded-2xl" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your ANTECO account</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input type="email" className="input-field" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" className="input-field" placeholder="Enter your password" required />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-500 hover:underline">Forgot Password?</button>
            </div>
            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button className="text-primary-500 hover:underline font-medium">Register</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-primary-800 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <img src="/anteco.png" alt="ANTECO" className="w-16 h-16 mb-6 brightness-0 invert opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Powering Progress, Connecting Lives</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            ANTECO CONNECT brings you closer to your electric cooperative. Manage bills, report outages, 
            track consumption, and access services all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
