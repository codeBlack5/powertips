// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/image.jpg';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo + Title */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4">
          <Link
            to="/"
            className="flex items-center text-base sm:text-lg md:text-xl font-bold text-white"
          >
            <img
              src={logo}
              alt="logo"
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full shadow-xl"
            />
            <h1 className="ml-2 sm:ml-3 md:ml-4">PowerTips</h1>
          </Link>
        </div>


        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10">
          <Link to="/" className="text-white hover:text-blue-600">Home</Link>
          <Link to="/blogs" className="text-white hover:text-blue-600">Blogs</Link>
          <Link to="/login" className="text-white hover:text-blue-600">Login</Link>
          <Link to="/register" className="text-white hover:text-blue-600">Register</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={36} className='text-red-600' /> : <FaBars size={36} className='text-green-600' />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-4 md:hidden">
          <Link to="/" className="text-white hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/blogs" className="text-white hover:text-blue-600" onClick={() => setIsOpen(false)}>Blogs</Link>
          <Link to="/login" className="text-white hover:text-blue-600" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/register" className="text-white hover:text-blue-600" onClick={() => setIsOpen(false)}>Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
