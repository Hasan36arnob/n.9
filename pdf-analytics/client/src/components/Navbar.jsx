import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//this is the navbar comp
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/20 bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300" />
            <span className="text-xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">DocSight</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="/upload" className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Upload PDF</Link>
            <Link to="/features" className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
            <a href="#contact" className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Enterprise</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-6 py-2.5 text-sm font-semibold text-slate-300 border border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200"
            >
              Log in
            </Link>
            <Link 
              to="/upload"
              className="px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link to="/pricing" className="block p-3 text-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            <Link to="/upload" className="block p-3 text-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
              Upload PDF
            </Link>
            <Link to="/features" className="block p-3 text-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
              Features
            </Link>
            <div className="pt-4 border-t border-slate-800">
              <Link 
                to="/login"
                className="block w-full p-3 text-center text-lg font-semibold text-slate-300 border border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link 
                to="/upload"
                className="block w-full mt-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-lg font-bold text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
