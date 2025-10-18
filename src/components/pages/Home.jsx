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
    {
    game: "Inter Miami vs Atlanta United",
    pred: "Inter Miami Win",
    odds: "1.80",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "MLS",
    explanation: "Messi and Suarez led Inter Miami to a convincing 4-0 victory.",
    score: "4-0",
    },
    {
    game: "Orlando City vs Vancouver Whitecaps",
    pred: "Vancouver Win",
    odds: "3.50",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "MLS",
    explanation: "Vancouver overcame Orlando with a 2-1 away win, thanks to late goals.",
    score: "1-2",
    },
    {
    game: "Seattle Sounders vs Real Salt Lake",
    pred: "Seattle Win",
    odds: "2.20",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "MLS",
    explanation: "Seattle secured a narrow 1-0 home win with solid defense.",
    score: "1-0",
    },
    {
    game: "Los Angeles FC vs Dallas",
    pred: "Los Angeles Win",
    odds: "1.90",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "MLS",
    explanation: "LAFC edged out Dallas 2-1 in a competitive match.",
    score: "2-1",
    },
    {
    game: "Almeria vs Zaragoza",
    pred: "Almeria Win",
    odds: "2.50",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "LaLiga 2",
    explanation: "Almeria dominated with a 4-2 victory at home.",
    score: "4-2",
    },
    {
    game: "Real Sociedad B vs FC Andorra",
    pred: "Real Sociedad B Win",
    odds: "3.00",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "LaLiga 2",
    explanation: "A 3-0 win for Real Sociedad B, showcasing young talent.",
    score: "3-0",
    },
    {
    game: "Real Oviedo vs Espanyol",
    pred: "Espanyol Win",
    odds: "2.40",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-17",
    league: "LaLiga 2",
    explanation: "Espanyol won 2-0 away, with strong defensive performance.",
    score: "0-2",
    },
    {
    game: "Mirandes vs Leganes",
    pred: "Draw",
    odds: "3.10",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "LaLiga 2",
    explanation: "The match ended in a goalless 0-0 draw as predicted.",
    score: "0-0",
    },
    {
    game: "Northampton vs Rotherham",
    pred: "Rotherham Win",
    odds: "2.30",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "League One",
    explanation: "Rotherham came from behind to win 2-1.",
    score: "1-2",
    },
    {
    game: "Leyton Orient vs Doncaster",
    pred: "Leyton Orient Win",
    odds: "2.10",
    result: "✅",
    color: "green",
    text: "Won",
    date: "2025-10-11",
    league: "League One",
    explanation: "A dominant 4-0 home win for Leyton Orient.",
    score: "4-0",
    },
    ];
  const upcomingGames = [
    {
    game: "Nottingham Forest vs Chelsea",
    pred: "Chelsea Win",
    odds: "1.85",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "Premier League",
    explanation: "Chelsea's attacking depth and recent form should overpower Forest for a 1-2 away win.",
    score: "1-2",
    },
    {
    game: "Charlotte FC vs Philadelphia Union",
    pred: "Charlotte FC Win",
    odds: "2.40",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "MLS",
    explanation: "Home advantage on Fan Appreciation Night leads to a 2-1 victory for Charlotte.",
    score: "2-1",
    },
    {
    game: "New England Revolution vs Chicago Fire FC",
    pred: "New England Win",
    odds: "2.10",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "MLS",
    explanation: "Strong home finale on Decision Day secures a 3-1 win for the Revolution.",
    score: "3-1",
    },
    {
    game: "Colombia vs France",
    pred: "France Win",
    odds: "2.20",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "FIFA U-20 World Cup",
    explanation: "France's technical superiority predicts a 1-2 win in the third-place match.",
    score: "1-2",
    },
    {
    game: "Inter Miami vs Columbus Crew",
    pred: "Inter Miami Win",
    odds: "1.95",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "MLS",
    explanation: "Messi's influence at home on Decision Day leads to a 3-1 victory.",
    score: "3-1",
    },
    {
    game: "LA Galaxy vs Vancouver Whitecaps",
    pred: "LA Galaxy Win",
    odds: "1.70",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "MLS",
    explanation: "Defending champs secure top spot with a 2-0 home win.",
    score: "2-0",
    },
    {
    game: "Seattle Sounders vs Minnesota United",
    pred: "Seattle Win",
    odds: "2.00",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "MLS",
    explanation: "Sounders' playoff push results in a 2-1 home triumph.",
    score: "2-1",
    },
    {
    game: "Real Madrid vs Villarreal",
    pred: "Real Madrid Win",
    odds: "1.60",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "La Liga",
    explanation: "Madrid's firepower overwhelms Villarreal in a 3-1 home win.",
    score: "3-1",
    },
    {
    game: "Atletico Madrid vs Las Palmas",
    pred: "Atletico Madrid Win",
    odds: "1.45",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-18",
    league: "La Liga",
    explanation: "Solid defense secures a 2-0 clean sheet victory.",
    score: "2-0",
    },
    {
    game: "Tottenham vs Aston Villa",
    pred: "Tottenham Win",
    odds: "2.50",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Premier League",
    explanation: "Tottenham's strong home form and attacking prowess should secure a 2-1 win.",
    score: "2-1",
    },
    {
    game: "Liverpool vs Manchester United",
    pred: "Liverpool Win",
    odds: "1.80",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Premier League",
    explanation: "Liverpool's superior squad depth predicts a 2-0 victory over rivals.",
    score: "2-0",
    },
    {
    game: "Dundee vs Celtic",
    pred: "Celtic Win",
    odds: "1.50",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Scottish Premiership",
    explanation: "Celtic's dominance in the league points to a 2-0 away win.",
    score: "0-2",
    },
    {
    game: "Elche vs Athletic Bilbao",
    pred: "Elche Win",
    odds: "3.20",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "La Liga",
    explanation: "Home advantage for Elche could lead to a surprising 2-0 win.",
    score: "2-0",
    },
    {
    game: "Celta Vigo vs Real Sociedad",
    pred: "Celta Vigo Win",
    odds: "2.90",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "La Liga",
    explanation: "Celta's recent form suggests a narrow 1-0 home victory.",
    score: "1-0",
    },
    {
    game: "Freiburg vs Eintracht Frankfurt",
    pred: "Freiburg Win",
    odds: "2.40",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Bundesliga",
    explanation: "Freiburg's solid defense predicts a 3-1 win.",
    score: "3-1",
    },
    {
    game: "Como vs Juventus",
    pred: "Como Win",
    odds: "4.50",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Serie A",
    explanation: "Upset potential with Como winning 2-0 at home.",
    score: "2-0",
    },
    {
    game: "Lens vs PSG",
    pred: "Lens Win",
    odds: "5.00",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Ligue 1",
    explanation: "Lens could surprise PSG with a 2-0 victory.",
    score: "2-0",
    },
    {
    game: "Flamengo vs Palmeiras",
    pred: "Flamengo Win",
    odds: "2.07",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "Brazilian Serie A",
    explanation: "High-scoring affair with Flamengo winning 3-2.",
    score: "3-2",
    },
    {
    game: "Vancouver Whitecaps vs Dallas",
    pred: "Vancouver Win",
    odds: "1.90",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "MLS",
    explanation: "Vancouver's momentum leads to a 3-1 home win.",
    score: "3-1",
    },
    {
    game: "Argentina vs Morocco",
    pred: "Argentina Win",
    odds: "2.10",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-19",
    league: "FIFA U-20 World Cup",
    explanation: "Argentina's flair and experience edge out Morocco in a 2-1 final thriller.",
    score: "2-1",
    },
    {
    game: "West Ham vs Brentford",
    pred: "Draw",
    odds: "3.30",
    result: "⏳",
    color: "yellow",
    text: "Pending",
    date: "2025-10-20",
    league: "Premier League",
    explanation: "London derby intensity leads to a balanced 1-1 draw.",
    score: "1-1",
    },
  ];

  // Filtering
  const filterGames = (data) =>
    data.filter(
      (g) =>
        g.game.toLowerCase().includes(search.toLowerCase()) &&
        (filterDate ? g.date === filterDate : true)
    );

  const sortedGames = [...gamesData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const sortedUpcoming = [...upcomingGames].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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
                {filterGames(sortedGames).map((row, i) => {
                  const isFavorite = favorites.some((f) => f.game === row.game);
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedGame(row)}
                      className="border-b hover:bg-gray-100 hover:text-black transition cursor-pointer"
                    >
                      <td className="p-2 sm:p-3 flex items-center justify-between">
                        {row.game}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFavorite) {
                              setFavorites(
                                favorites.filter((f) => f.game !== row.game)
                              );
                            } else {
                              setFavorites([...favorites, row]);
                            }
                          }}
                          className={`ml-2 text-lg transition ${
                            isFavorite
                              ? "text-yellow-400 scale-110"
                              : "text-gray-400 hover:text-yellow-900"
                          }`}
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>
                      </td>
                      <td className="p-2 sm:p-3 text-blue-600 font-semibold">
                        {row.pred}
                      </td>
                      <td className="p-2 sm:p-3 text-green-600 font-bold">
                        {row.odds}
                      </td>
                      <td
                        className={`p-2 sm:p-3 text-${row.color}-600 font-semibold`}
                      >
                        {row.result}
                      </td>
                      <td className="p-2 sm:p-3">{formatDate(row.date)}</td>
                    </tr>
                  );
                })}
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
                {filterGames(sortedUpcoming).map((row, i) => {
                  const isFavorite = favorites.some((f) => f.game === row.game);
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedGame(row)}
                      className="border-b hover:bg-gray-100 hover:text-black transition cursor-pointer"
                    >
                      <td className="p-2 sm:p-3 flex items-center justify-between">
                        {row.game}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFavorite) {
                              setFavorites(
                                favorites.filter((f) => f.game !== row.game)
                              );
                            } else {
                              setFavorites([...favorites, row]);
                            }
                          }}
                          className={`ml-2 text-lg transition ${
                            isFavorite
                              ? "text-yellow-400 scale-110"
                              : "text-gray-400 hover:text-yellow-900"
                          }`}
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>
                      </td>
                      <td className="p-2 sm:p-3 text-blue-600 font-semibold">
                        {row.pred}
                      </td>
                      <td className="p-2 sm:p-3 text-green-600 font-bold">
                        {row.odds}
                      </td>
                      <td
                        className={`p-2 sm:p-3 text-${row.color}-600 font-semibold`}
                      >
                        {row.result}
                      </td>
                      <td className="p-2 sm:p-3">{formatDate(row.date)}</td>
                    </tr>
                  );
                })}
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
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
          {/* Modal Content with Slide Up */}
          <div className="relative z-10 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
            <div className="bg-gray-900 text-gray-600 p-6 rounded-t-2xl animate-slideUp shadow-lg">
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-2 right-4 text-gray-400 hover:text-red-500 transform transition duration-300 hover:scale-125 hover:rotate-90 bg-red-500/10 hover:bg-red-500 rounded-full p-2 shadow-md"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold text-white mb-2">
                {selectedGame.game}
              </h2>
              <p className="text-gray-400 mb-2">
                League: {selectedGame.league}
              </p>
              <p className="mb-2">
                Prediction:{" "}
                <span className="text-blue-400">{selectedGame.pred}</span>
              </p>
              <p className="mb-2">
                Odds: <span className="text-green-400">{selectedGame.odds}</span>
              </p>
              <p className="mb-2">Result: {selectedGame.result}</p>
              <p className="text-sm text-gray-300 italic">
                {selectedGame.explanation}
              </p>
            </div>
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
