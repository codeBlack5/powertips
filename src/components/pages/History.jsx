import React, { useState } from "react";

function History() {
  // Later: fetch this from Rails API
  const [history] = useState([
    {
      game: "Inter Miami vs Atlanta United",
      result: "Won",
      date: "2025-10-11",
      league: "MLS",
      explanation: "Messi and Suarez led Inter Miami to a convincing 4-0 victory.",
      score: "4-0",
    },
    {
      game: "Orlando City vs Vancouver Whitecaps",
      result: "Won",
      date: "2025-10-11",
      league: "MLS",
      explanation: "Vancouver overcame Orlando with a 2-1 away win, thanks to late goals.",
      score: "1-2",
    },
    {
      game: "Seattle Sounders vs Real Salt Lake",
      result: "Won",
      date: "2025-10-11",
      league: "MLS",
      explanation: "Seattle secured a narrow 1-0 home win with solid defense.",
      score: "1-0",
    },
    {
      game: "Los Angeles FC vs Dallas",
      result: "Won",
      date: "2025-10-11",
      league: "MLS",
      explanation: "LAFC edged out Dallas 2-1 in a competitive match.",
      score: "2-1",
    },
    {
      game: "Almeria vs Zaragoza",
      result: "Won",
      date: "2025-10-11",
      league: "LaLiga 2",
      explanation: "Almeria dominated with a 4-2 victory at home.",
      score: "4-2",
    },
    {
      game: "Real Sociedad B vs FC Andorra",
      result: "Won",
      date: "2025-10-11",
      league: "LaLiga 2",
      explanation: "A 3-0 win for Real Sociedad B, showcasing young talent.",
      score: "3-0",
    },
    {
      game: "Real Oviedo vs Espanyol",
      result: "Won",
      date: "2025-10-17",
      league: "LaLiga 2",
      explanation: "Espanyol won 2-0 away, with strong defensive performance.",
      score: "0-2",
    },
    {
      game: "Mirandes vs Leganes",
      result: "Won",
      date: "2025-10-11",
      league: "LaLiga 2",
      explanation: "The match ended in a goalless 0-0 draw as predicted.",
      score: "0-0",
    },
    {
      game: "Northampton vs Rotherham",
      result: "Won",
      date: "2025-10-11",
      league: "League One",
      explanation: "Rotherham came from behind to win 2-1.",
      score: "1-2",
    },
    {
      game: "Leyton Orient vs Doncaster",
      result: "Won",
      date: "2025-10-11",
      league: "League One",
      explanation: "A dominant 4-0 home win for Leyton Orient.",
      score: "4-0",
    },
  ]);

  return (
    <div className="min-h-screen text-white px-4 pt-24 pb-6">
      {/* Push content down because of fixed navbar (pt-24) */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        📜 My Viewing History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-400">No history yet.</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="w-full border-collapse bg-gray-900 text-white rounded-xl shadow-lg">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3 text-left">Game</th>
                <th className="p-3 text-left">League</th>
                <th className="p-3 text-left">Result</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Analysis</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3 text-sm sm:text-base">{row.game}</td>
                  <td className="p-3 text-sm sm:text-base">{row.league}</td>
                  <td
                    className={`p-3 font-semibold ${
                      row.result === "Won"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {row.result}
                  </td>
                  <td className="p-3 text-sm sm:text-base">{row.score}</td>
                  <td className="p-3 text-gray-400">{row.date}</td>
                  <td className="p-3 text-sm sm:text-base">{row.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;