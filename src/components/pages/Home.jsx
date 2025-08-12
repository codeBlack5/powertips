import React from 'react';

function Home() {
  // Function to format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Completed games data (with dates added)
  const gamesData = [
    { game: "Independiente vs River Plate", pred: "First Half Draw",odds: "3.45", result: "✅", color: "green", text: "Won", date: "2025-08-10" },
    { game: "Coritiba vs Chapecoense-SC", pred: "First Half Draw",odds: "2.95", result: "✅", color: "green", text: "Won", date: "2025-08-09" },
    { game: "Montana vs Botev Vratsa", pred: "First Half Draw",odds: "3.98", result: "✅", color: "green", text: "Won", date: "2025-08-08" },
    { game: "Panathinaikos vs Shakhtar Donetsk", pred: "First Half Draw",odds: "3.28", result: "✅", color: "green", text: "Won", date: "2025-08-07" },
    { game: "Ludogorets vs Ferencvaros", pred: "First Half Draw",odds: "2.14", result: "✅", color: "green", text: "Won", date: "2025-08-06" },
    { game: "Malmo FF vs FC Copenhagen", pred: "Both Teams To Score",odds: "3.42", result: "❌", color: "red", text: "Lost", date: "2025-08-05" },
    { game: "Uganda vs Niger", pred: "First Half Home",odds: "4.22", result: "✅", color: "green", text: "Won", date: "2025-08-11" },
  ];

  // Upcoming games data
  const upcomingGames = [
    { game: "Angola vs DRC", pred: "First Half Draw", odds: "3.54", result: "⏳", color: "yellow", text: "Pending", date: "2025-08-14" },
    { game: "PSG vs Tottenham", pred: "First Half Draw",odds: "4.45", result: "⏳", color: "yellow", text: "Pending", date: "2025-08-13" },
    { game: "Naesby vs Horsens", pred: "First Half Draw",odds: "3.12", result: "⏳", color: "yellow", text: "Pending", date: "2025-08-12" },
  ];

  // Sort by latest date first (descending)
  const sortedGames = [...gamesData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedUpcoming = [...upcomingGames].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Find today's game from upcomingGames
  const today = new Date().toISOString().split("T")[0];
  const gameOfTheDay =
  upcomingGames.find((g) => g.date === today) ||
  gamesData.find((g) => g.date === today);

  return (
    <div className="relative">
      <div className="relative z-10">
        <section className="px-2 sm:px-4 py-8">
          {/* VIP section */}
          <div className="mt-20 bg-gray-900 bg-opacity-50 text-center p-4 sm:p-6 rounded-lg max-w-xl mx-auto">
            <p className="mb-3 text-red-600 text-lg sm:text-xl">
              Get access to <span className="glow-text">VIP tips</span> on Telegram
            </p>
            <a
              href="https://t.me/powertipsterbets"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-600 transition text-sm sm:text-base"
            >
              Join Telegram Group
            </a>
          </div>
          {/* Game of the Day */}
          {gameOfTheDay && (
            <div className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-white p-4 sm:p-6 rounded-lg shadow-lg mt-8 max-w-xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-center">
                🌟 Game of the Day 🌟
              </h2>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left">
                <div>
                  <p className="font-semibold text-lg">{gameOfTheDay.game}</p>
                  <p className="text-sm text-white/90">
                    Prediction: <span className="text-blue-200">{gameOfTheDay.pred}</span>
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-green-200 font-bold">Odds: {gameOfTheDay.odds}</p>
                  <p className="text-sm">
                    Date: {formatDate(gameOfTheDay.date)}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Completed games table */}
          <div className="bg-gray-900 bg-opacity-50 flex flex-col items-center p-4 sm:p-6 rounded-lg">
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Previous Predictions
            </h1>
            <div className="overflow-x-auto w-full max-w-6xl">
              <table className="w-full border-collapse bg-black text-white rounded-lg shadow-md">
                <thead className="text-sm sm:text-lg">
                  <tr>
                    <th className="p-2 sm:p-3 text-left">Game</th>
                    <th className="p-2 sm:p-3 text-left">Prediction</th>
                    <th className="p-2 sm:p-3 text-left">Odds</th>
                    <th className="p-2 sm:p-3 text-left">Result</th>
                    <th className="p-2 sm:p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {sortedGames.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-100 hover:text-black transition">
                      <td className="p-2 sm:p-3">{row.game}</td>
                      <td className="p-2 sm:p-3 text-blue-600 font-semibold">{row.pred}</td>
                      <td className='p-2 sm:p-3 text-green-600 font-bold'>{row.odds}</td>
                      <td className={`p-2 sm:p-3 text-${row.color}-600 font-semibold relative group`}>
                        {row.result}
                        <span className={`absolute left-1/2 -translate-x-1/2 -bottom-8 bg-${row.color}-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition`}>
                          {row.text}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">{formatDate(row.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming games table */}
          <div className="bg-gray-900 bg-opacity-50 flex flex-col items-center p-4 sm:p-6 mt-8 rounded-lg">
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Upcoming Predictions
            </h1>
            <div className="overflow-x-auto w-full max-w-6xl">
              <table className="w-full border-collapse bg-black text-white rounded-lg shadow-md">
                <thead className="text-sm sm:text-lg">
                  <tr>
                    <th className="p-2 sm:p-3 text-left">Game</th>
                    <th className="p-2 sm:p-3 text-left">Prediction</th>
                    <th className="p-2 sm:p-3 text-left">Odds</th>
                    <th className="p-2 sm:p-3 text-left">Result</th>
                    <th className="p-2 sm:p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-base">
                  {sortedUpcoming.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-100 hover:text-black transition">
                      <td className="p-2 sm:p-3">{row.game}</td>
                      <td className="p-2 sm:p-3 text-blue-600 font-semibold">{row.pred}</td>
                      <td className='p-2 sm:p-3 text-green-600 font-bold'>{row.odds}</td>
                      <td className={`p-2 sm:p-3 text-${row.color}-600 font-semibold relative group`}>
                        {row.result}
                        <span className={`absolute left-1/2 -translate-x-1/2 -bottom-8 bg-${row.color}-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition`}>
                          {row.text}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">{formatDate(row.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
