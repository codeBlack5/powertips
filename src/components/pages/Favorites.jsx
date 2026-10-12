import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function formatDate(value) {
  if (!value) return "Kickoff to be confirmed";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Kickoff to be confirmed";
  }

  return date.toLocaleString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Favorites() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/favorites");
      setFavorites(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not load your favorites. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      loadFavorites();
    }
  }, [authLoading, loadFavorites]);

  const leagues = useMemo(() => {
    return [
      ...new Set(
        favorites
          .map((favorite) => favorite.item?.league)
          .filter(Boolean)
      ),
    ].sort();
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return favorites.filter((favorite) => {
      const item = favorite.item || {};
      const isPrediction = favorite.favoritableType === "prediction";

      const teams = `${item.homeTeam || ""} ${item.awayTeam || ""}`.toLowerCase();

      const searchableText = [
        teams,
        item.league || "",
        item.prediction || "",
        item.market || "",
        item.selection || "",
      ]
        .join(" ")
        .toLowerCase();

      if (query && !searchableText.includes(query)) {
        return false;
      }

      if (leagueFilter !== "all" && item.league !== leagueFilter) {
        return false;
      }

      if (typeFilter === "prediction" && !isPrediction) {
        return false;
      }

      if (typeFilter === "match" && isPrediction) {
        return false;
      }

      if (
        statusFilter !== "all" &&
        String(item.status || "").toLowerCase() !== statusFilter
      ) {
        return false;
      }

      if (dateFilter) {
        if (!item.kickoff) {
          return false;
        }

        const kickoffDate = new Date(item.kickoff);

        if (Number.isNaN(kickoffDate.getTime())) {
          return false;
        }

        const year = kickoffDate.getFullYear();
        const month = String(kickoffDate.getMonth() + 1).padStart(2, "0");
        const day = String(kickoffDate.getDate()).padStart(2, "0");
        const localDate = `${year}-${month}-${day}`;

        if (localDate !== dateFilter) {
          return false;
        }
      }

      return true;
    });
  }, [
    favorites,
    search,
    leagueFilter,
    typeFilter,
    statusFilter,
    dateFilter,
  ]);

  const removeFavorite = async (favorite) => {
    const item = favorite.item || {};
    const title = `${item.homeTeam || "This item"}${
      item.awayTeam ? ` vs ${item.awayTeam}` : ""
    }`;

    const confirmation = await Swal.fire({
      title: "Remove favorite?",
      text: `${title} will be removed from your favorites.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#b91c1c",
      background: "#111827",
      color: "#ffffff",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const previousFavorites = favorites;

    setRemovingId(favorite.id);
    setFavorites((current) =>
      current.filter((entry) => entry.id !== favorite.id)
    );

    try {
      await api.delete(`/favorites/${favorite.id}`);

      await Swal.fire({
        title: "Removed",
        text: "The favorite has been removed from your account.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
        background: "#111827",
        color: "#ffffff",
      });
    } catch (err) {
      setFavorites(previousFavorites);

      await Swal.fire({
        title: "Could not remove favorite",
        text: err.response?.data?.error || "Please try again.",
        icon: "error",
        background: "#111827",
        color: "#ffffff",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const shareFavorite = async (favorite) => {
    const item = favorite.item || {};

    const title = `${item.homeTeam || "Match"}${
      item.awayTeam ? ` vs ${item.awayTeam}` : ""
    }`;

    let details;

    if (favorite.favoritableType === "prediction") {
      details = item.locked
        ? "Prediction details are restricted."
        : `Prediction: ${
            item.selection || item.prediction || "Not available"
          }`;
    } else {
      details = `Match status: ${item.status || "upcoming"}`;
    }

    const message = [
      title,
      item.league || "",
      details,
      `Kickoff: ${formatDate(item.kickoff)}`,
      "POWER TIPS PREDICTIONS",
    ].join("\n");

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text: message });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);

        await Swal.fire({
          title: "Copied",
          text: "Favorite details copied to your clipboard.",
          icon: "success",
          timer: 1400,
          showConfirmButton: false,
          background: "#111827",
          color: "#ffffff",
        });
      } else {
        await Swal.fire({
          title,
          text: message,
          confirmButtonText: "Close",
          background: "#111827",
          color: "#ffffff",
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        await Swal.fire({
          title: "Sharing unavailable",
          text: "Your browser could not share this item.",
          icon: "error",
          background: "#111827",
          color: "#ffffff",
        });
      }
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLeagueFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFilter("");
  };

  if (authLoading) {
    return (
      <main className="min-h-screen px-4 pt-28 text-center text-gray-300">
        Checking your account...
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen px-4 pt-28 text-center text-white">
        <h1 className="mb-3 text-3xl font-black text-yellow-400">
          My Favorites
        </h1>

        <p className="mb-6 text-gray-300">
          Sign in to save matches and predictions to your account.
        </p>

        <Link
          to="/login"
          className="inline-block rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-24 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
              Your personal collection
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              My Favorites
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {favorites.length} saved{" "}
              {favorites.length === 1 ? "item" : "items"} in your account
            </p>
          </div>

          <Link
            to="/history"
            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
          >
            View prediction history →
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams, league, prediction..."
            aria-label="Search favorites"
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400 sm:col-span-2 lg:col-span-2"
          />

          <select
            value={leagueFilter}
            onChange={(event) => setLeagueFilter(event.target.value)}
            aria-label="Filter by league"
            className="rounded-lg border border-white/10 bg-gray-900 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400"
          >
            <option value="all">All leagues</option>
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by item type"
            className="rounded-lg border border-white/10 bg-gray-900 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400"
          >
            <option value="all">Matches &amp; predictions</option>
            <option value="match">Matches only</option>
            <option value="prediction">Predictions only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="rounded-lg border border-white/10 bg-gray-900 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="finished">Finished</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <div className="sm:col-span-2 lg:col-span-5">
            <label
              className="mb-1 block text-xs text-gray-400"
              htmlFor="favorite-date"
            >
              Kickoff date
            </label>

            <div className="flex flex-wrap gap-3">
              <input
                id="favorite-date"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-yellow-400"
              />

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center text-gray-300">
            Loading your favorites...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="mb-4 text-red-300">{error}</p>

            <button
              type="button"
              onClick={loadFavorites}
              className="rounded-lg bg-yellow-400 px-5 py-2 font-bold text-black hover:bg-yellow-300"
            >
              Try again
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-14 text-center">
            <div className="mb-3 text-4xl">♡</div>

            <h2 className="mb-2 text-xl font-bold">No favorites yet</h2>

            <p className="mx-auto mb-6 max-w-md text-sm text-gray-400">
              Save a match or prediction and it will appear here, linked to
              your account.
            </p>

            <Link
              to="/"
              className="inline-block rounded-lg bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
            >
              Explore predictions
            </Link>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-gray-400">
            No favorites match these filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredFavorites.map((favorite) => {
              const item = favorite.item || {};
              const isPrediction =
                favorite.favoritableType === "prediction";

              const title = `${item.homeTeam || "Home"} vs ${
                item.awayTeam || "Away"
              }`;

              return (
                <article
                  key={favorite.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/60 p-5 shadow-xl shadow-black/20"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                        {item.league || "Football"}
                      </span>

                      <h2 className="mt-1 text-lg font-bold sm:text-xl">
                        {title}
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(item.kickoff)}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                      {isPrediction ? "Prediction" : "Match"}
                    </span>
                  </div>

                  {isPrediction ? (
                    <div className="mb-4 rounded-xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        {item.market || "Prediction"}
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {item.locked
                          ? "VIP prediction locked"
                          : item.selection ||
                            item.prediction ||
                            "Prediction unavailable"}
                      </p>

                      {!item.locked && item.odds != null && (
                        <p className="mt-2 text-sm text-yellow-400">
                          Odds: {item.odds}
                        </p>
                      )}

                      {item.locked && (
                        <p className="mt-2 text-xs text-gray-400">
                          Restricted VIP details are hidden.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 rounded-xl border border-white/10 bg-black/30 p-4">
                      <p className="text-sm text-gray-300">
                        Status:{" "}
                        <span className="font-semibold text-white">
                          {item.status || "Scheduled"}
                        </span>
                      </p>

                      {item.status === "finished" &&
                        item.homeScore != null &&
                        item.awayScore != null && (
                          <p className="mt-2 text-lg font-black text-yellow-400">
                            {item.homeScore} - {item.awayScore}
                          </p>
                        )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/history", {
                          state: {
                            focusPredictionId: isPrediction
                              ? item.id
                              : undefined,
                            focusMatchId: !isPrediction
                              ? item.id
                              : undefined,
                          },
                        })
                      }
                      className="rounded-lg border border-yellow-400/40 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
                    >
                      View details
                    </button>

                    <button
                      type="button"
                      onClick={() => shareFavorite(favorite)}
                      className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-white/40"
                    >
                      Share
                    </button>

                    <button
                      type="button"
                      disabled={removingId === favorite.id}
                      onClick={() => removeFavorite(favorite)}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === favorite.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;