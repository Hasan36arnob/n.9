import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="w-full border-b border-neutral-800 bg-[#0f0f0f]/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          <span className="font-semibold text-lg">PDF Analytics</span>
        </Link>
      </div>
    </div>
  )
}
