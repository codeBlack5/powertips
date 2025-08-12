import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/image.jpg'
// import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md p-4 z-50">
    <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
      <div className='flex items-center'>
        <img src={logo} alt='logo' className='h-25 w-20 rounded-full shadow-xl'></img>
       <Link to="/" className="text-2xl font-bold text-white mx-4">PowerTips</Link>
      </div>
      <div className="space-x-10">
        <Link to="/" className="text-white hover:text-blue-600">Predictions</Link>
        <Link to="/upcoming" className="text-white hover:text-blue-600">Upcoming</Link>
        <Link to="/results" className="text-white hover:text-blue-600">Results</Link>
      </div>
    </div>
  </nav>
  )
}

export default Navbar
