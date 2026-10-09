import React, { useEffect, useState } from "react";
import api from "../../api/client";

function MatchResultsManager({ onResultSaved }) {
  const [matches, setMatches] = useState([]);
  const [matchId, setMatchId] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/matches");
      const latestMatches = response.data;
      setMatches(latestMatches);

      setMatchId((currentId) => {
        if (currentId && latestMatches.some((match) => String(match.id) === String(currentId))) {
          return currentId;
        }
        return latestMatches.length ? String(latestMatches[0].id) : "";
      });
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const selectedMatch = matches.find(
    (match) => String(match.id) === String(matchId)
  );

  useEffect(() => {
    if (!selectedMatch) return;
    setHomeScore(selectedMatch.homeScore ?? "");
    setAwayScore(selectedMatch.awayScore ?? "");
  }, [matchId, selectedMatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedMatch) return;

    const home = Number(homeScore);
    const away = Number(awayScore);

    if (
      homeScore === "" ||
      awayScore === "" ||
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0
    ) {
      setError("Enter valid whole-number scores of zero or more.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.patch(`/matches/${selectedMatch.id}`, {
        homeScore: home,
        awayScore: away,
        status: "finished",
      });

      const updatedMatch = response.data?.match || response.data;

      // Update local match state immediately; don't wait for another fetch.
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          String(match.id) === String(selectedMatch.id)
            ? {
                ...match,
                ...(updatedMatch && typeof updatedMatch === "object" ? updatedMatch : {}),
                homeScore: home,
                awayScore: away,
                status: "finished",
              }
            : match
        )
      );

      setMessage(
        `Final score saved: ${selectedMatch.homeTeam.name} ${home}–${away} ${selectedMatch.awayTeam.name}. Predictions for this match have been recalculated.`
      );

      // Ask the parent page to refresh its predictions, if supported.
      if (onResultSaved) {
        await onResultSaved(selectedMatch.id);
      }
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(
        Array.isArray(apiError)
          ? apiError.join(", ")
          : apiError || "Unable to save match result."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-yellow-400/20 bg-black/60 shadow-xl">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
          Admin
        </p>
        <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
          Match Results
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Enter a final score to settle every prediction linked to that match.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300"
          >
            {message}
          </div>
        )}

        <div>
          <label
            htmlFor="results-match"
            className="mb-2 block text-sm font-bold text-gray-300"
          >
            Match
          </label>
          <select
            id="results-match"
            value={matchId}
            onChange={(event) => {
              setMatchId(event.target.value);
              setMessage("");
              setError("");
            }}
            required
            className="pt-input w-full"
          >
            <option value="">Select match</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.homeTeam.name} vs {match.awayTeam.name} — {match.league.name}
                {match.status === "finished" ? " (Finished)" : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedMatch && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div>
              <label
                htmlFor="home-score"
                className="mb-2 block text-sm font-bold text-gray-300"
              >
                {selectedMatch.homeTeam.name} — Home score
              </label>
              <input
                id="home-score"
                type="number"
                min="0"
                step="1"
                required
                value={homeScore}
                onChange={(event) => setHomeScore(event.target.value)}
                className="pt-input w-full"
              />
            </div>

            <span className="pb-3 text-center text-xl font-black text-yellow-400">
              —
            </span>

            <div>
              <label
                htmlFor="away-score"
                className="mb-2 block text-sm font-bold text-gray-300"
              >
                {selectedMatch.awayTeam.name} — Away score
              </label>
              <input
                id="away-score"
                type="number"
                min="0"
                step="1"
                required
                value={awayScore}
                onChange={(event) => setAwayScore(event.target.value)}
                className="pt-input w-full"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || loading || !selectedMatch}
          className="pt-button-primary min-h-[46px] px-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving result..." : "Save Final Score & Settle Predictions"}
        </button>

        <p className="text-xs leading-5 text-gray-500">
          Saving marks the match as finished. Correcting a score recalculates the
          outcomes for that match's predictions.
        </p>
      </form>
    </section>
  );
}

export default MatchResultsManager;
