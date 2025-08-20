import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function Home() {
  // State
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Games Data
  const gamesData = [
    { game: "Independiente vs River Plate", pred: "First Half Draw", odds: "3.45", result: "✅", color: "green", text: "Won", date: "2025-08-10", league: "Copa Libertadores", explanation: "Both teams are defensively strong in the first half." },
    { game: "Coritiba vs Chapecoense-SC", pred: "First Half Draw", odds: "2.95", result: "✅", color: "green", text: "Won", date: "2025-08-09", league: "Serie B", explanation: "Both teams are closely matched, strong defensive stats." },
    { game: "PSG vs Tottenham", pred: "First Half Draw", odds: "2.89", result: "❌", color: "red", text: "Lost", date: "2025-08-13", league: "Champions League", explanation: "PSG usually dominate at home, but Spurs pressed early." },
  ];

  const upcomingGames = [
    { game: "Aalborg vs Horsens", pred: "First Half Home", odds: "3.52", result: "⏳", color: "yellow", text: "Pending", date: "2025-08-15", league: "Superliga", explanation: "Aalborg has a strong first-half scoring record." },
  ];

  // Filtering
  const filterGames = (data) =>
    data.filter(
      (g) =>
        g.game.toLowerCase().includes(search.toLowerCase()) &&
        (filterDate ? g.date === filterDate : true)
    );

  const sortedGames = [...gamesData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedUpcoming = [...upcomingGames].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Win/Loss stats
  const winCount = gamesData.filter((g) => g.result === "✅").length;
  const lossCount = gamesData.filter((g) => g.result === "❌").length;
  const chartData = [
    { name: "Wins", value: winCount },
    { name: "Losses", value: lossCount },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="relative">
      <section className="px-2 sm:px-4 pt-24 pb-8">
        {/* Telegram Section */}
        <div className="bg-gray-900 bg-opacity-50 text-center p-4 sm:p-6 rounded-lg max-w-xl mx-auto">
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

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by game/league..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
          />
        </div>

        {/* Previous Predictions */}
        <div className="bg-gray-900 bg-opacity-50 flex flex-col items-center p-4 sm:p-6 rounded-lg mt-8">
          <h1 className="text-lg sm:text-2xl font-bold text-white mb-4">
            Previous Predictions
          </h1>
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="w-full border-collapse bg-black text-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="p-2 sm:p-3 text-left">Game</th>
                  <th className="p-2 sm:p-3 text-left">Prediction</th>
                  <th className="p-2 sm:p-3 text-left">Odds</th>
                  <th className="p-2 sm:p-3 text-left">Result</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filterGames(sortedGames).map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedGame(row)}
                    className="border-b hover:bg-gray-100 hover:text-black transition cursor-pointer"
                  >
                    <td className="p-2 sm:p-3">{row.game}</td>
                    <td className="p-2 sm:p-3 text-blue-600 font-semibold">{row.pred}</td>
                    <td className="p-2 sm:p-3 text-green-600 font-bold">{row.odds}</td>
                    <td className={`p-2 sm:p-3 text-${row.color}-600 font-semibold`}>
                      {row.result}
                    </td>
                    <td className="p-2 sm:p-3">{formatDate(row.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Predictions */}
        <div className="bg-gray-900 bg-opacity-50 flex flex-col items-center p-4 sm:p-6 mt-8 rounded-lg">
          <h1 className="text-lg sm:text-2xl font-bold text-white mb-4">
            Upcoming Predictions
          </h1>
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="w-full border-collapse bg-black text-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="p-2 sm:p-3 text-left">Game</th>
                  <th className="p-2 sm:p-3 text-left">Prediction</th>
                  <th className="p-2 sm:p-3 text-left">Odds</th>
                  <th className="p-2 sm:p-3 text-left">Result</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filterGames(sortedUpcoming).map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedGame(row)}
                    className="border-b hover:bg-gray-100 hover:text-black transition cursor-pointer"
                  >
                    <td className="p-2 sm:p-3">{row.game}</td>
                    <td className="p-2 sm:p-3 text-blue-600 font-semibold">{row.pred}</td>
                    <td className="p-2 sm:p-3 text-green-600 font-bold">{row.odds}</td>
                    <td className={`p-2 sm:p-3 text-${row.color}-600 font-semibold`}>
                      {row.result}
                    </td>
                    <td className="p-2 sm:p-3">{formatDate(row.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Win Rate Chart */}
        <div className="bg-gray-900 bg-opacity-50 flex flex-col items-center p-4 sm:p-6 mt-8 rounded-lg">
          <h1 className="text-lg sm:text-2xl font-bold text-white mb-4">
            Win Rate Stats
          </h1>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Modal for Game Details */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex justify-center items-end">
          {/* Background Overlay with Fade */}
          <div
            className="absolute inset-0 bg-black animate-fadeIn"
            onClick={() => setSelectedGame(null)}
          />
          {/* Modal Content */}
          <div className="bg-gray-900 text-gray-600 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 rounded-t-2xl animate-slideUp relative z-10">
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-2 right-4 text-gray-400 hover:text-red-500 transform transition duration-300 hover:scale-125 hover:rotate-90 bg-red-500/10 hover:bg-red-500 rounded-full p-2 shadow-md"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-white mb-2">{selectedGame.game}</h2>
            <p className="text-gray-400 mb-2">League: {selectedGame.league}</p>
            <p className="mb-2">
              Prediction: <span className="text-blue-400">{selectedGame.pred}</span>
            </p>
            <p className="mb-2">
              Odds: <span className="text-green-400">{selectedGame.odds}</span>
            </p>
            <p className="mb-2">Result: {selectedGame.result}</p>
            <p className="text-sm text-gray-300 italic">{selectedGame.explanation}</p>
          </div>
        </div>
      )}

      {/* Keyframe helpers for modal */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.7; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default Home;
