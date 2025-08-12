import React from 'react'
import { FaFacebookF, FaTwitter, FaTelegramPlane, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4 mt-auto shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
        
        <a 
          href="https://web.facebook.com/profile.php?id=61562164091887" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaFacebookF /> Facebook
        </a>

        <a 
          href="https://x.com/futbolunat" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaTwitter /> Twitter
        </a>

        <a href="https://t.me/powertipsterbets" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaTelegramPlane /> Telegram
        </a>

        <a href="https://web.facebook.com/profile.php?id=61562164091887" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaInstagram /> Instagram
        </a>
        
      </div>
    </footer>
  );
}

export default Footer
