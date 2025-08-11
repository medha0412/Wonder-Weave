import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation();
  if (location.pathname === "/signin" || location.pathname === "/signup") {
    return null; 
  }
  
  return (
    <nav className='fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-white shadow-sm'>
      <Link to="/" className='text-xl font-semibold text-blue-600 hover:underline'>
        Wonder Weave
      </Link>
      
      <div className='flex items-center space-x-6'>
        <div className='hidden md:flex items-center space-x-6'>
          <Link 
            to="/about" 
            className={`text-gray-700 hover:text-blue-600 text-xl transition ${
              location.pathname === '/about' ? 'text-blue-600 font-xl' : ''
            }`}
          >
            About
          </Link>
          
          <Link 
            to="/blog" 
            className={`text-gray-700 hover:text-blue-600 text-xl transition ${
              location.pathname === '/blog' ? 'text-blue-600 font-xl' : ''
            }`}
          >
            Blog
          </Link>
        </div>
        
        {location.pathname === '/' && (
          <Link to="/signup">
            <button className='bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition'>
              Sign Up
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}
