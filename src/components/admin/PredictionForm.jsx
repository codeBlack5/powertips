import React, { useEffect, useMemo, useState } from "react";

const MARKET_OPTIONS = [
  "Match Result",
  "Double Chance",
  "Draw No Bet",
  "Over/Under",
  "Both Teams To Score",
  "Correct Score",
  "Total Goals Odd/Even",
  "Exact Total Goals",
  "Home Team Goals",
  "Away Team Goals",
  "Home Team To Score",
  "Away Team To Score",
  "Winning Margin",
  "Win to Nil",
  "Result & BTTS",
];

const GOAL_LINES = ["0.5", "1.5", "2.5", "3.5", "4.5"];

const SELECTION_OPTIONS = {
  "Match Result": ["Home Win", "Draw", "Away Win"],
  "Double Chance": ["Home or Draw", "Home or Away", "Draw or Away"],
  "Draw No Bet": ["Home Win", "Away Win"],
  "Over/Under": GOAL_LINES.flatMap((line) => [`Over ${line}`, `Under ${line}`]),
  "Both Teams To Score": ["Yes", "No"],
  "Correct Score": [
    "0-0", "1-0", "0-1", "1-1", "2-0", "0-2", "2-1", "1-2",
    "2-2", "3-0", "0-3", "3-1", "1-3", "3-2", "2-3", "3-3",
    "Other Score",
  ],
  "Total Goals Odd/Even": ["Odd", "Even"],
  "Exact Total Goals": ["0", "1", "2", "3", "4", "5", "6+"],
  "Home Team Goals": GOAL_LINES.flatMap((line) => [`Over ${line}`, `Under ${line}`]),
  "Away Team Goals": GOAL_LINES.flatMap((line) => [`Over ${line}`, `Under ${line}`]),
  "Home Team To Score": ["Yes", "No"],
  "Away Team To Score": ["Yes", "No"],
  "Winning Margin": [
    "Home by 1", "Home by 2", "Home by 3+", "Draw",
    "Away by 1", "Away by 2", "Away by 3+",
  ],
  "Win to Nil": ["Home Win to Nil", "Away Win to Nil", "Neither Team"],
  "Result & BTTS": [
    "Home Win & Yes", "Home Win & No",
    "Draw & Yes", "Draw & No",
    "Away Win & Yes", "Away Win & No",
  ],
};

const EMPTY_FORM = {
  match_id: "",
  market: "Match Result",
  selection: "Home Win",
  odds: "",
  confidence: "",
  prediction_type: "free",
  analysis: "",
};

function PredictionForm({
  matches,
  initialData,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const editing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        match_id: initialData.matchId || "",
        market: initialData.market || "Match Result",
        selection:
          initialData.selection ||
          initialData.prediction ||
          (SELECTION_OPTIONS[initialData.market || "Match Result"] || SELECTION_OPTIONS["Match Result"])[0],
        odds: initialData.odds ?? "",
        confidence: initialData.confidence ?? "",
        prediction_type:
          initialData.predictionType || initialData.type || "free",
        analysis: initialData.analysis || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData]);

  const selections = useMemo(
    () => SELECTION_OPTIONS[form.market] || [],
    [form.market]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "market") {
      setForm((current) => ({
        ...current,
        market: value,
        selection: SELECTION_OPTIONS[value]?.[0] || "",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      match_id: Number(form.match_id),
      market: form.market,
      selection: form.selection,
      odds: Number(form.odds),
      confidence: Number(form.confidence),
      prediction_type: form.prediction_type,
      analysis: form.analysis,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-300">
          Match
        </label>
        <select
          name="match_id"
          value={form.match_id}
          onChange={handleChange}
          required
          className="pt-input w-full"
        >
          <option value="">Select match</option>

          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.homeTeam.name} vs {match.awayTeam.name} —{" "}
              {match.league.name} —{" "}
              {new Date(match.kickoff).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-300">
            Market
          </label>
          <select
            name="market"
            value={form.market}
            onChange={handleChange}
            className="pt-input w-full"
          >
            {MARKET_OPTIONS.map((market) => (
              <option key={market} value={market}>
                {market}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-300">
            Selection
          </label>
          <select
            name="selection"
            value={form.selection}
            onChange={handleChange}
            className="pt-input w-full"
          >
            {selections.map((selection) => (
              <option key={selection} value={selection}>
                {selection}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-300">
            Odds
          </label>
          <input
            type="number"
            name="odds"
            min="1.01"
            step="0.01"
            value={form.odds}
            onChange={handleChange}
            required
            className="pt-input w-full"
            placeholder="1.85"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-300">
            Confidence %
          </label>
          <input
            type="number"
            name="confidence"
            min="0"
            max="100"
            value={form.confidence}
            onChange={handleChange}
            required
            className="pt-input w-full"
            placeholder="80"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-300">
            Type
          </label>
          <select
            name="prediction_type"
            value={form.prediction_type}
            onChange={handleChange}
            className="pt-input w-full"
          >
            <option value="free">Free</option>
            <option value="vip">VIP</option>
          </select>
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-300">
          Analysis
        </label>
        <textarea
          name="analysis"
          value={form.analysis}
          onChange={handleChange}
          rows="4"
          className="pt-input w-full resize-none"
          placeholder="Explain the reasoning behind this prediction..."
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={saving}
          className="pt-button-primary min-h-[44px] px-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : editing
              ? "Update Prediction"
              : "Add Prediction"}
        </button>
      </div>
    </form>
  );
}

export default PredictionForm;
