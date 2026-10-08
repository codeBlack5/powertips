import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";
import MatchCard from "../files/MatchCard";

function formatResultDate(kickoff) {
  if (!kickoff) return "Date unavailable";

  const date = new Date(kickoff);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function outcomeStyles(outcome) {
  switch (outcome) {
    case "won":
      return {
        badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
        label: "WON",
      };
    case "lost":
      return {
        badge: "bg-red-400/10 text-red-400 border-red-400/20",
        label: "LOST",
      };
    case "void":
      return {
        badge: "bg-gray-400/10 text-gray-300 border-gray-400/20",
        label: "VOID",
      };
    default:
      return {
        badge: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
        label: "PENDING",
      };
  }
}

function ResultCard({ result }) {
  const outcome = outcomeStyles(result.outcome);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
            {result.league}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {formatResultDate(result.kickoff)}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-black ${outcome.badge}`}
        >
          {outcome.label}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-center">
          <p className="font-bold text-white">{result.homeTeam}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-center">
          <p className="text-2xl font-black text-white">
            {result.homeScore} - {result.awayScore}
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Final
          </p>
        </div>

        <div className="text-center">
          <p className="font-bold text-white">{result.awayTeam}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Prediction
            </p>

            <p className="mt-1 font-black text-white">
              {result.prediction}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Odds
            </p>

            <p className="mt-1 font-black text-yellow-400">
              {result.odds}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          <span className="text-gray-500">
            {result.market} · {result.type === "vip" ? "VIP" : "Free"}
          </span>

          <span className="font-bold text-gray-300">
            {result.confidence}% confidence
          </span>
        </div>
      </div>

      {result.analysis && (
        <p className="mt-4 text-sm leading-6 text-gray-400">
          {result.analysis}
        </p>
      )}
    </article>
  );
}

function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "predictions";

  const [predictions, setPredictions] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (view === "results") {
          const response = await api.get("/results");
          setResults(response.data);
        } else {
          const response = await api.get("/predictions");
          setPredictions(response.data);
        }
      } catch (err) {
        console.error(`Failed to load ${view}:`, err);
        setError(`Unable to load ${view} right now.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  const predictionCounts = useMemo(() => {
    return {
      total: predictions.length,
      free: predictions.filter(
        (prediction) => prediction.type === "free"
      ).length,
      vip: predictions.filter(
        (prediction) => prediction.type === "vip"
      ).length,
    };
  }, [predictions]);

  const resultCounts = useMemo(() => {
    return {
      total: results.length,
      won: results.filter((result) => result.outcome === "won").length,
      lost: results.filter((result) => result.outcome === "lost").length,
    };
  }, [results]);

  const switchView = (nextView) => {
    setSearchParams({ view: nextView });
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            PowerTips
          </p>

          <h1 className="text-3xl font-black sm:text-4xl">
            {view === "results"
              ? "Prediction Results"
              : "Football Predictions"}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            {view === "results"
              ? "Review completed predictions and track how PowerTips performs."
              : "Explore upcoming football predictions, confidence levels, odds and analysis."}
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
            <button
              type="button"
              onClick={() => switchView("predictions")}
              className={`min-h-[44px] flex-1 rounded-xl px-4 text-sm font-bold transition ${
                view === "predictions"
                  ? "bg-yellow-400 text-black"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Predictions
            </button>

            <button
              type="button"
              onClick={() => switchView("results")}
              className={`min-h-[44px] flex-1 rounded-xl px-4 text-sm font-bold transition ${
                view === "results"
                  ? "bg-yellow-400 text-black"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Results
            </button>
          </div>
        </div>

        {view === "results" ? (
          <>
            {!loading && !error && results.length > 0 && (
              <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="text-2xl font-black text-white">
                    {resultCounts.total}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Results
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">
                    {resultCounts.won}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Won
                  </p>
                </div>

                <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-4 text-center">
                  <p className="text-2xl font-black text-red-400">
                    {resultCounts.lost}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Lost
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
                <p className="text-sm font-semibold text-gray-400">
                  Loading results...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
                <p className="font-bold text-red-300">{error}</p>

                <p className="mt-2 text-sm text-gray-500">
                  Please try refreshing the page.
                </p>
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
                <p className="font-bold text-white">
                  No completed results yet
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Completed predicion results will appear here.
                </p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {!loading && !error && predictions.length > 0 && (
              <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="text-2xl font-black text-white">
                    {predictionCounts.total}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">
                    {predictionCounts.free}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Free
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4 text-center">
                  <p className="text-2xl font-black text-yellow-400">
                    {predictionCounts.vip}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    VIP
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
                <p className="text-sm font-semibold text-gray-400">
                  Loading predictions...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
                <p className="font-bold text-red-300">{error}</p>

                <p className="mt-2 text-sm text-gray-500">
                  Please try refreshing the page.
                </p>
              </div>
            )}

            {!loading && !error && predictions.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
                <p className="font-bold text-white">
                  No predictions available
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Check back soon for new football predictions.
                </p>
              </div>
            )}

            {!loading && !error && predictions.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {predictions.map((prediction) => (
                  <MatchCard
                    key={prediction.id}
                    match={prediction}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default History;
