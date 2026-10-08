import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";
import MatchCard from "../files/MatchCard";

function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "predictions";

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (view !== "predictions") return;

    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/predictions");
        setPredictions(response.data);
      } catch (err) {
        console.error("Failed to load predictions:", err);
        setError("Unable to load predictions right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
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
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-lg font-bold text-white">
              Results are coming next
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-400">
              The predictions API is now connected. We will connect completed
              match results to this section in the next phase.
            </p>

            <button
              type="button"
              onClick={() => switchView("predictions")}
              className="mt-5 min-h-[44px] rounded-xl bg-yellow-400 px-5 py-2 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              View Predictions
            </button>
          </div>
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
