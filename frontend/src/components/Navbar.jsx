import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (location.pathname === "/signin" || location.pathname === "/signup") {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-background/90 backdrop-blur-md shadow-sm border-b border-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-primary">WayOra</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/about"
              className={`text-foreground hover:text-primary transition-colors font-medium ${isActive('/about') ? 'text-primary' : ''}`}
            >
              About
            </Link>
            <Link
              to="/#experience"
              className={`text-foreground hover:text-primary transition-colors font-medium ${isActive('/stories') ? 'text-primary' : ''}`}
            >
              Blog
            </Link>
            {location.pathname === '/' && (
              <Link to="/signup">
                <button className="px-6 py-2 rounded-full font-semibold text-white bg-primary hover:bg-secondary transition-all duration-300">
                  Sign Up
                </button>
              </Link>
            )}
          </div>

          <button className="md:hidden px-2 py-1 border rounded text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block text-foreground hover:text-primary transition-colors font-medium ${isActive('/about') ? 'text-primary' : ''}`}
            >
              About
            </Link>
            <Link
              to="/#experience"
              onClick={() => setIsOpen(false)}
              className={`block text-foreground hover:text-primary transition-colors font-medium ${isActive('/stories') ? 'text-primary' : ''}`}
            >
              Blog
            </Link>
            {location.pathname === '/' && (
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <button className="w-full px-6 py-2 rounded-full font-semibold text-white bg-primary hover:bg-secondary transition-all duration-300">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
