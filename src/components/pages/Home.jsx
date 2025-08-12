import React, { useState } from 'react'
import bg from '../assets/images/kickoff.jpg'

const today = new Date().toISOString().split("T")[0];
console.log(today);
function Home() {
  const [filters, setFilters] = useState({
    league: "",
    date: today,
    search: "",
  });

  return (
    <div className='relative'>
      { /* Fixed background */}
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat bg-center z-0"
        style={{ backgroundImage: `url(${bg})` }}
      >
      </div> 
      {/**Scrollable content*/}
      <div className="relative z-10">
      <section className="px-4 py-8 min-h-screen">
      {/* <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      </div> */}
      <div className='mt-20 bg-gray-900 opacity-50  text-xl p-4 text-center'>
        <p className="mb-2 text-red-600">Get access to <span className="glow-text">VIP tips</span> on Telegram</p>
        <a
          href="https://t.me/powertipsterbets"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-600 transition"
        >
          Join Telegram Group
        </a>
      </div>
      <div className="h-[200vh] bg-gray-900 opacity-50 flex flex-col items-center p-6">
        <h1 className='text-2xl font-bold text-white mb-6'>Games & Predictions</h1>
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className='w-full border-collapse bg-white rounded-lg shadow-md'>
            <thead>
              <tr>
                <th className='p-3 text-left'>Game</th>
                <th className='p-3 text-left'>Prediction</th>
                <th className='p-3 text-left'>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b hover:bg-gray-100 transition'>
                <td className='p-3'>Team A vs Team B</td>
                <td className='p-3 text-blue-600 font-semibold'>Both Teams To Score</td>
                <td className='p-3 text-green-600 font-semibold relative group'>✅
                  <span className='absolute left-1/2 -translate-x-1/2 -bottom-8 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap'>
                    Won
                  </span>
                </td>
              </tr>
              <tr className='border-b hover:bg-gray-100 transition'>
                <td className='p-3'>Team C vs Team D</td>
                <td className='p-3 text-blue-600 font-semibold'>Firt Half Draw</td>
                <td className='p-3 text-yellow-600 font-semibold relative group'>⏳
                  <span className='absolute left-1/2 -translate-x-1/2 -bottom-8 bg-yellow-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap'>
                    Pending
                  </span>
                </td>
              </tr>
              <tr className='border-b hover:bg-gray-100 transition'>
                <td className='p-3'>Team E vs Team F</td>
                <td className='p-3 text-blue-600 font-semibold'>Total Over 2.5</td>
                <td className='p-3 text-red-600 font-semibold relative group'>❌
                  <span className='absolute left-1/2 -translate-x-1/2 -bottom-8 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap'>
                    Lost
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>  
    </div>
    
    </div>
    
  )
}

export default Home
