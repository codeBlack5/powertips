// src/components/Navbar.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/image.jpg';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const navigate = useNavigate();
  const sheetRef = useRef(null);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setTimeout(() => {
      setIsOpen(false);
      navigate(path);
    }, 2000);
  };

  const linkClasses = (path) =>
    `relative text-white px-3 py-2 rounded-lg transition-all duration-300 
     hover:scale-110 
     ${activeLink === path ? 
       "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_100%] animate-shine" 
       : "hover:bg-gray-700"}`;

  // Handle swipe down to close
  const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);

  const handleTouchMove = (e) => {
    if (!touchStartY) return;
    const currentY = e.touches[0].clientY;
    if (currentY - touchStartY > 80) { // swipe down threshold
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="logo"
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full shadow-xl"
          />
          <h1 className="text-xl font-bold text-white">PowerTips</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 lg:space-x-10">
          {["/", "/favorites", "/history", "/blogs", "/login", "/register"].map((path) => (
            <button
              key={path}
              onClick={() => handleLinkClick(path)}
              className={linkClasses(path)}
            >
              {path === "/" ? "Home" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={32} className='text-red-600' /> : <FaBars size={32} className='text-green-600' />}
          </button>
        </div>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Action Sheet */}
      {isOpen && (
        <div
          ref={sheetRef}
          className="fixed bottom-0 left-0 w-full  rounded-t-2xl shadow-lg 
                     flex flex-col items-center space-y-4 py-6 md:hidden animate-slideUp relative bg-gray-900"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-4 text-white hover:text-white transform transition duration-300 hover:scale-125 hover:rotate-90 bg-red-500/10 hover:bg-red-500 rounded-full p-2 shadow-md"
          >
            <FaTimes size={20} />
          </button>

          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-gray-500 rounded-full mb-6"></div>

          {["/", "/favorites", "/history", "/blogs", "/login", "/register"].map((path) => (
            <button
              key={path}
              onClick={() => handleLinkClick(path)}
              className={linkClasses(path)}
            >
              {path === "/" ? "Home" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
            </button>
          ))}
        </div>
      )}

      {/* Keyframe Animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </nav>
  );
}

export default Navbar;
