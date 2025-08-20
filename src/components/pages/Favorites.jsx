// src/components/pages/Favorites.jsx
import React, { useState, useEffect } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      const defaultFavorites = [
        { game: "PSG vs Tottenham", pred: "First Half Draw", odds: "4.45" },
        { game: "Naesby vs Horsens", pred: "First Half Draw", odds: "3.12" },
      ];
      setFavorites(defaultFavorites);
      localStorage.setItem("favorites", JSON.stringify(defaultFavorites));
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Remove a favorite
  const removeFavorite = (index) => {
    const updatedFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(updatedFavorites);
  };

  return (
    <div className="text-white min-h-screen pt-24 px-4">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        ⭐ My Favorite Predictions
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">No favorites yet.</p>
      ) : (
        <div className="max-w-3xl mx-auto h-[70vh] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {favorites.map((fav, i) => (
            <div
              key={i}
              className="bg-gray-900 p-4 sm:p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
            >
              {/* Game Info */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">{fav.game}</h2>
                <p className="text-blue-400 text-sm sm:text-base">
                  Prediction: {fav.pred}
                </p>
                <p className="text-green-400 text-sm sm:text-base">
                  Odds: {fav.odds}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFavorite(i)}
                className="self-start sm:self-auto px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 rounded-lg shadow transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
