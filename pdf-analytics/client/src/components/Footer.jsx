import React from 'react';

const Footer = () => (
  <footer className="bg-slate-900/50 border-t border-slate-800 pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">DocSight</h3>
          <p className="text-slate-400 mb-6">Track PDF engagement. Grow your business.</p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors text-slate-400 hover:text-white">T</a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors text-slate-400 hover:text-white">f</a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors text-slate-400 hover:text-white">in</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-300">Product</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-300">Company</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-300">Support</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Docs</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Status</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
        <span>© 2024 DocSight Analytics, Inc. All rights reserved.</span>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Security</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
