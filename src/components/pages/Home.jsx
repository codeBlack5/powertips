import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import MatchCard from "../files/MatchCard";

const platformStats = [
  { label: "Predictions", value: "100+" },
  { label: "Winning Tips", value: "90+" },
  { label: "Leagues", value: "10+" },
  { label: "Analysis", value: "Daily" },
];

function Home() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  const featuredMatch = predictions[0];

  const todayPredictions = predictions.filter(
    (prediction) => prediction.type === "free"
  );

  return (
    <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pt-page">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/[0.08] via-black to-black px-5 py-12 shadow-2xl shadow-black/30 sm:px-10 sm:py-16 lg:px-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-yellow-400/5 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-400">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Football Prediction Platform
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Football predictions.
              <span className="block text-yellow-400">
                Backed by analysis.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Discover match predictions, team analysis and performance
              insights from PowerTips. Follow the matches that matter and
              track how our predictions perform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#today"
                className="pt-button-primary min-h-[48px] px-6"
              >
                Explore Today's Predictions
              </a>

              <Link
                to="/history"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 font-bold text-white transition hover:bg-white/10"
              >
                View Results
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {platformStats.map((stat) => (
            <div key={stat.label} className="pt-card p-4 text-center">
              <p className="text-xl font-black text-yellow-400 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Game of the Day */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                Featured
              </p>
              <h2 className="pt-section-title">Game of the Day</h2>
            </div>

            <span className="hidden text-sm text-gray-500 sm:block">
              Our featured prediction
            </span>
          </div>

          <div className="mx-auto max-w-2xl">
            {loading && (
              <div className="pt-card p-8 text-center text-gray-400">
                Loading featured prediction...
              </div>
            )}

            {!loading && error && (
              <div className="pt-card p-8 text-center text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && featuredMatch && (
              <MatchCard match={featuredMatch} featured />
            )}

            {!loading && !error && !featuredMatch && (
              <div className="pt-card p-8 text-center text-gray-400">
                No predictions available.
              </div>
            )}
          </div>
        </section>

        {/* Today's Predictions */}
        <section id="today" className="mt-12 scroll-mt-24">
          <div className="mb-5">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              Today's Board
            </p>

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <h2 className="pt-section-title">
                Today's Best Predictions
              </h2>

              <p className="text-sm text-gray-500">
                Free predictions available now
              </p>
            </div>
          </div>

          {loading && (
            <div className="pt-card p-8 text-center text-gray-400">
              Loading predictions...
            </div>
          )}

          {!loading && !error && todayPredictions.length === 0 && (
            <div className="pt-card p-8 text-center text-gray-400">
              No free predictions available.
            </div>
          )}

          {!loading && !error && todayPredictions.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {todayPredictions.map((match, index) => (
                <MatchCard
                  key={`${match.id}-${index}`}
                  match={match}
                />
              ))}
            </div>
          )}
        </section>

        {/* Platform Explanation */}
        <section className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="pt-card p-6 lg:col-span-2">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              More than tips
            </p>

            <h2 className="text-2xl font-black text-white sm:text-3xl">
              A prediction platform built around football.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              PowerTips brings predictions, match information, analysis and
              historical performance together in one place. The platform is
              designed to make every prediction easy to understand and easy
              to follow.
            </p>
          </div>

          <div className="pt-card flex flex-col justify-between p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                Track performance
              </p>

              <h3 className="mt-2 text-xl font-black text-white">
                See the results
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Review previous predictions and see how the platform performs
                over time.
              </p>
            </div>

            <Link
              to="/history"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              View Prediction History
            </Link>
          </div>
        </section>

        {/* Telegram Community */}
        <section className="relative mt-12 overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 via-black to-black p-6 sm:p-8">
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-sky-400">
                PowerTips Community
              </p>

              <h2 className="text-xl font-black text-white sm:text-2xl">
                Get more football prediction insights.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Join the PowerTips Telegram community for VIP predictions,
                match updates and additional football analysis.
              </p>
            </div>

            <a
              href="https://t.me/powertipsterbets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-400"
            >
              Join Telegram
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

export default Home;
