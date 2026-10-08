import React from "react";
import { motion } from "framer-motion";

import defaultHomeLogo from "../assets/images/pedri.jpg";
import defaultAwayLogo from "../assets/images/vini.jpg";

function formatKickoff(kickoff) {
  if (!kickoff) return "TBD";

  const date = new Date(kickoff);

  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MatchCard({ match, featured = false }) {
  const {
    homeTeam,
    awayTeam,
    homeLogo,
    awayLogo,
    prediction,
    kickoff,
    type = "free",
    league,
    odds,
    confidence,
    analysis,
  } = match;

  const isVIP = type === "vip";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl border ${
        featured
          ? "border-yellow-400/40 bg-gradient-to-br from-yellow-400/10 via-black to-black"
          : "border-white/10 bg-white/[0.04]"
      } p-5 shadow-xl shadow-black/20 backdrop-blur-sm`}
    >
      {featured && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
          Game of the Day
        </div>
      )}

      <div className="mb-5 flex items-center justify-between gap-3 text-xs">
        <span className="min-w-0 truncate font-semibold uppercase tracking-wider text-gray-400">
          {league || "Football"}
        </span>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 font-bold uppercase ${
            isVIP
              ? "bg-yellow-400/10 text-yellow-400"
              : "bg-emerald-400/10 text-emerald-400"
          }`}
        >
          {type}
        </span>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <img
            src={homeLogo || defaultHomeLogo}
            alt={homeTeam}
            className="mb-2 h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />

          <span className="text-sm font-bold text-white">{homeTeam}</span>
        </div>

        <div className="w-20 shrink-0 text-center">
          <span className="block text-[10px] font-bold leading-4 uppercase tracking-wide text-gray-500">
            {formatKickoff(kickoff)}
          </span>

          <span className="mt-1 block text-lg font-black text-gray-500">
            VS
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <img
            src={awayLogo || defaultAwayLogo}
            alt={awayTeam}
            className="mb-2 h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />

          <span className="text-sm font-bold text-white">{awayTeam}</span>
        </div>
      </div>

      <div className="rounded-xl border border-yellow-400/10 bg-black/50 p-4 text-center">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Prediction
        </p>

        <p
          className={`text-lg font-black ${
            isVIP ? "blur-sm text-yellow-400" : "text-yellow-400"
          }`}
        >
          {prediction}
        </p>

        {!isVIP && (odds || confidence) && (
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            {odds && (
              <span className="text-gray-400">
                Odds <strong className="text-white">{odds}</strong>
              </span>
            )}

            {confidence && (
              <span className="text-gray-400">
                Confidence{" "}
                <strong className="text-emerald-400">
                  {confidence}%
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {analysis && !isVIP && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-400">
          {analysis}
        </p>
      )}

      {isVIP && (
        <a
          href="https://t.me/+JVfBp3Q03OU5ZTk0"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-[44px] items-center justify-center rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black transition hover:bg-yellow-300"
        >
          Unlock VIP Prediction
        </a>
      )}
    </motion.article>
  );
}

export default MatchCard;
