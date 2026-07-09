import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle,
  Compass,
  Zap
} from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Decorative Header */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Compass className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">404</h1>
                <p className="text-white/80 text-sm">Page Not Found</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-100">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
              </div>
            </div>
            
            {/* Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Oops! You've wandered off the path
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track!
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
              >
                <Home size={18} />
                Back to Dashboard
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for what you're looking for..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/search?q=${e.target.value}`;
                  }
                }}
              />
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/users" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Users
              </Link>
              <Link to="/attendance" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Attendance
              </Link>
              <Link to="/zkteco" className="text-slate-600 hover:text-indigo-600 transition-colors">
                ZKTeco
              </Link>
              <Link to="/settings" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>
        
        {/* Fun Fact */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Zap size={12} className="text-amber-400 fill-amber-400" />
          <span>Tip: Double-check the URL or use the search bar above</span>
          <Zap size={12} className="text-amber-400 fill-amber-400" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;