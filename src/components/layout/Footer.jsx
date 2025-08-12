import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-600 text-white p-4 text-center flex justify-around">
      <Link to='/' className='hover:text-blue-400'>Facebook</Link>
      <Link to='/' className='hover:text-blue-400'>Twitter</Link>
      <Link to='/' className='hover:text-blue-400'>Telegram</Link>
      <Link to='/' className='hover:text-blue-400'>Instagram</Link>
    </footer>
  )
}

export default Footer
