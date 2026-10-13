import React, { useEffect, useState } from "react";
import api from "../../api/client";

const EMPTY_FORM = {
  leagueId: "",
  homeTeamId: "",
  awayTeamId: "",
  kickoff: "",
};

function MatchManager() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leagueResponse, teamResponse, matchResponse] = await Promise.all([
        api.get("/leagues"),
        api.get("/teams"),
        api.get("/matches"),
      ]);

      setLeagues(leagueResponse.data.filter((league) => league.active !== false));
      setTeams(teamResponse.data.filter((team) => team.active !== false));
      setMatches(matchResponse.data);
    } catch (err) {
      const detail = err.response?.data?.error;
      setError(Array.isArray(detail) ? detail.join(", ") : detail || "Unable to load leagues, teams, or matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changeField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.leagueId || !form.homeTeamId || !form.awayTeamId || !form.kickoff) {
      setError("Select a league, both teams, and the kickoff date and time.");
      return;
    }

    if (form.homeTeamId === form.awayTeamId) {
      setError("Home and away teams must be different.");
      return;
    }

    const kickoffDate = new Date(form.kickoff);
    if (Number.isNaN(kickoffDate.getTime())) {
      setError("Enter a valid kickoff date and time.");
      return;
    }

    try {
      setSaving(true);
      const response = await api.post("/matches", {
        leagueId: Number(form.leagueId),
        homeTeamId: Number(form.homeTeamId),
        awayTeamId: Number(form.awayTeamId),
        kickoff: kickoffDate.toISOString(),
        status: "scheduled",
      });

      const created = response.data?.match || response.data;
      setMatches((current) => [
        ...current.filter((match) => match.id !== created.id),
        created,
      ].sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff)));

      const home = teams.find((team) => String(team.id) === form.homeTeamId);
      const away = teams.find((team) => String(team.id) === form.awayTeamId);
      setMessage(`Fixture created: ${home?.name || "Home team"} vs ${away?.name || "Away team"}.`);
      setForm((current) => ({
        ...EMPTY_FORM,
        leagueId: current.leagueId,
      }));
      await loadData();
    } catch (err) {
      const detail = err.response?.data?.error;
      setError(Array.isArray(detail) ? detail.join(", ") : detail || "Unable to create fixture.");
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "mb-2 block text-sm font-bold text-gray-300";
  const inputClass = "w-full rounded-lg border border-white/10 bg-gray-950 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400";

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-yellow-400/20 bg-black/60 shadow-xl">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">Admin workspace</p>
        <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Match Management</h2>
        <p className="mt-1 text-sm text-gray-400">
          Create scheduled fixtures using your saved leagues and active teams.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
        {error && <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {message && <div role="status" className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">{message}</div>}

        {loading ? (
          <p className="text-sm text-gray-400">Loading leagues and teams…</p>
        ) : (
          <>
            <div>
              <label className={labelClass} htmlFor="fixture-league">League *</label>
              <select id="fixture-league" name="leagueId" value={form.leagueId} onChange={changeField} required className={inputClass}>
                <option value="">Select league</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>{league.name} · {league.country}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div>
                <label className={labelClass} htmlFor="fixture-home">Home team *</label>
                <select id="fixture-home" name="homeTeamId" value={form.homeTeamId} onChange={changeField} required className={inputClass}>
                  <option value="">Select home team</option>
                  {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
              </div>
              <span className="pb-3 text-center text-sm font-black text-yellow-400">VS</span>
              <div>
                <label className={labelClass} htmlFor="fixture-away">Away team *</label>
                <select id="fixture-away" name="awayTeamId" value={form.awayTeamId} onChange={changeField} required className={inputClass}>
                  <option value="">Select away team</option>
                  {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="fixture-kickoff">Kickoff date and time *</label>
              <input id="fixture-kickoff" name="kickoff" type="datetime-local" value={form.kickoff} onChange={changeField} required className={inputClass} />
              <p className="mt-2 text-xs text-gray-500">Choose the kickoff in your local time. It will be converted to UTC when saved.</p>
            </div>

            <button type="submit" disabled={saving || !leagues.length || teams.length < 2} className="min-h-[46px] rounded-lg bg-yellow-400 px-6 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Creating fixture…" : "Create Fixture"}
            </button>

            {!leagues.length && <p className="text-sm text-amber-300">No active leagues are available.</p>}
            {teams.length < 2 && <p className="text-sm text-amber-300">Add at least two active teams before creating a fixture.</p>}
          </>
        )}
      </form>

      <div className="border-t border-white/10 px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-bold text-white">Existing fixtures</h3>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">{matches.length} matches</span>
        </div>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-400">No fixtures found.</p>
        ) : (
          <div className="space-y-2">
            {matches.slice(0, 8).map((match) => (
              <div key={match.id} className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-words text-sm font-semibold text-white">
                  {match.homeTeam?.name || "Home"} <span className="text-yellow-400">vs</span> {match.awayTeam?.name || "Away"}
                </p>
                <p className="text-xs text-gray-400">
                  {match.league?.name || "League"} · {match.kickoff ? new Date(match.kickoff).toLocaleString() : "Kickoff not set"} · {match.status}
                </p>
              </div>
            ))}
            {matches.length > 8 && <p className="text-xs text-gray-500">Showing the next 8 fixtures by kickoff.</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default MatchManager;
