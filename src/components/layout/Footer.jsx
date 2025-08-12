import React from 'react'
import { FaFacebookF, FaTwitter, FaTelegramPlane, FaInstagram } from "react-icons/fa";
import { logEvent } from "../../ga";

function Footer() {
  const trackClick = (platform, url) => {
    logEvent("Footer Links", `Clicked ${platform} Link`, url);
    window.open(url, "_blank", "noopener noreferrer");
  };
  return (
    <footer className="bg-gray-800 text-white py-6 px-4 mt-auto shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
        
        <button
          onClick={() => trackClick("Facebook", "https://web.facebook.com/profile.php?id=61562164091887")}
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaFacebookF /> Facebook
        </button>

        <button
          onClick={() => trackClick("Twitter", "https://x.com/power_tipster")}
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaTwitter /> Twitter
        </button>

        <button
          onClick={() => trackClick("Telegram", "https://t.me/powertipsterbets")}
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaTelegramPlane /> Telegram
        </button>

        <button
          onClick={() => trackClick("Instagram", "https://instagram.com/yourprofile")}
          className="flex items-center gap-2 hover:text-blue-400 transition text-lg"
        >
          <FaInstagram /> Instagram
        </button>
        
      </div>
    </footer>
  );
}

export default Footer
