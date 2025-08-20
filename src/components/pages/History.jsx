// src/components/pages/History.jsx
import React, { useState } from "react";

function History() {
  // Later: fetch this from Rails API
  const [history] = useState([
    { game: "Independiente vs River Plate", result: "Won", date: "2025-08-10" },
    { game: "Malmo FF vs FC Copenhagen", result: "Lost", date: "2025-08-05" },
    { game: "PSG vs Tottenham", result: "Won", date: "2025-07-30" },
    { game: "Naesby vs Horsens", result: "Lost", date: "2025-07-25" },
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
                <th className="p-3 text-left">Result</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3 text-sm sm:text-base">{row.game}</td>
                  <td
                    className={`p-3 font-semibold ${
                      row.result === "Won"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {row.result}
                  </td>
                  <td className="p-3 text-gray-400">{row.date}</td>
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
