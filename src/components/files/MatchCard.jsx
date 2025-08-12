import React from 'react'
import { motion } from "framer-motion";
import homeLogo from '../assets/images/pedri.jpg'
import awayLogo from '../assets/images/vini.jpg'
function MatchCard({match}) {
    const {homeTeam, awayTeam, prediction, time, type} = match;
    const isVIP = type === "vip";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-xl p-4 w-full max-w-md"
    >
      <div className="flex justify-between mb-2 text-sm text-gray-500">
        <span>{time}</span>
        <span className={`uppercase ${isVIP ? "text-yellow-500" : "text-green-500"}`}>
          {type}
        </span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img src={homeLogo} alt={homeTeam} className="w-8 h-8" />
          <span>{homeTeam}</span>
        </div>
        <span className="text-sm text-gray-400">vs</span>
        <div className="flex items-center space-x-2">
          <span>{awayTeam}</span>
          <img src={awayLogo} alt={awayTeam} className="w-8 h-8" />
        </div>
      </div>

      <div className={`text-center text-xl font-bold ${isVIP ? "blur-sm" : ""}`}>
        {prediction}
      </div>

      {isVIP && (
        <div className="text-center mt-3">
          <a
            href="https://t.me/+JVfBp3Q03OU5ZTk0"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Unlock on Telegram
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default MatchCard
