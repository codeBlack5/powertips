import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TEAM_LOGOS = {
  arsenal: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
  chelsea: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
  barcelona: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
  "fc barcelona": "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
  "real madrid": "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
};

function TeamLogo({ teamName, logoUrl }) {
  const normalizedName = String(teamName || "").trim().toLowerCase();
  const fallbackLogo = TEAM_LOGOS[normalizedName] || null;
  const [src, setSrc] = useState(logoUrl || fallbackLogo);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(logoUrl || fallbackLogo);
    setFailed(false);
  }, [logoUrl, fallbackLogo]);

  const initials =
    String(teamName || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  const handleError = () => {
    if (fallbackLogo && src !== fallbackLogo) {
      setSrc(fallbackLogo);
    } else {
      setFailed(true);
    }
  };

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${teamName} crest unavailable`}
        className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/30 bg-white/10 text-xs font-black text-yellow-400"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${teamName} crest`}
      onError={handleError}
      className="mb-2 h-12 w-12 rounded-full bg-white p-1 object-contain ring-2 ring-white/10"
    />
  );
}


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
    status = "pending",
    locked = false,
  } = match;

  const isVIP = type === "vip";
  const isLocked = isVIP && locked;

  const statusStyles = {
    pending: {
      label: "Pending",
      className: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
    },
    won: {
      label: "Won",
      className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    },
    lost: {
      label: "Lost",
      className: "border-red-400/20 bg-red-400/10 text-red-400",
    },
    void: {
      label: "Void",
      className: "border-gray-400/20 bg-gray-400/10 text-gray-300",
    },
  };

  const currentStatus = statusStyles[status] || statusStyles.pending;

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

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 font-bold uppercase ${
              isVIP
                ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
            }`}
          >
            {type}
          </span>

          <span
            className={`rounded-full border px-2.5 py-1 font-bold uppercase ${currentStatus.className}`}
          >
            {currentStatus.label}
          </span>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <TeamLogo teamName={homeTeam} logoUrl={homeLogo} />

          <span className="text-sm font-bold text-white">{homeTeam}</span>
        </div>

        <div className="w-20 shrink-0 text-center">
          <span className="block text-[10px] font-bold uppercase leading-4 tracking-wide text-gray-500">
            {formatKickoff(kickoff)}
          </span>

          <span className="mt-1 block text-lg font-black text-gray-500">
            VS
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <TeamLogo teamName={awayTeam} logoUrl={awayLogo} />

          <span className="text-sm font-bold text-white">{awayTeam}</span>
        </div>
      </div>

      <div className="rounded-xl border border-yellow-400/10 bg-black/50 p-4 text-center">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Prediction
        </p>

        <p
          className={`text-lg font-black ${
            isLocked ? "text-gray-300" : "text-yellow-400"
          }`}
        >
          {prediction}
        </p>

        {!isLocked && (odds || confidence) && (
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

      {analysis && !isLocked && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-400">
          {analysis}
        </p>
      )}

      {isLocked && (
        <a
          href="https://t.me/+g6lqmcWDTpAxZTM0"
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
