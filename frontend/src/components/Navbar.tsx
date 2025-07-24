import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()

  return (
    <nav className='flex items-center justify-between px-8 py-4 bg-white shadow-sm'>

      <Link to="/" className='text-xl font-semibold text-blue-600 hover:underline'>
        Wonder Weave
      </Link>

      <div className='flex'>
        <div className='flex space-x-8 text-gray-700 mr-10 pt-2'>
          <Link to="/team" className='hover:text-blue-600'>Our Team</Link>
          <Link to="/destinav" className='hover:text-blue-600'>Destination</Link>
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
