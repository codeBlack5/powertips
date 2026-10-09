import React, { useEffect, useState } from "react";
import api from "../../api/client";

function TeamCrest({ url, name, shortName, sizeClass = "h-16 w-16" }) {
  const [failed, setFailed] = useState(false);
  const initials = (shortName || name || "?").slice(0, 3).toUpperCase();

  useEffect(() => {
    setFailed(false);
  }, [url]);

  return (
    <div className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gray-800`}>
      {url && !failed ? (
        <img
          key={url}
          src={url}
          alt={`${name || "Team"} crest`}
          className="h-full w-full object-contain"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-1 text-center text-xs font-bold text-gray-300">
          {url && failed ? "Logo unavailable" : initials}
        </span>
      )}
    </div>
  );
}

const EMPTY_TEAM = {
  name: "",
  shortName: "",
  country: "",
  logoUrl: "",
  active: true,
};

function TeamManager() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(EMPTY_TEAM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/teams");
      setTeams(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to load teams."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const changeField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_TEAM);
    setEditingId(null);
  };

  const editTeam = (team) => {
    setForm({
      name: team.name || "",
      shortName: team.shortName || "",
      country: team.country || "",
      logoUrl: team.logoUrl || "",
      active: team.active,
    });
    setEditingId(team.id);
    setError("");
    setMessage("");
    document.getElementById("team-manager-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const saveTeam = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      country: form.country.trim(),
      logoUrl: form.logoUrl.trim(),
      active: form.active,
    };

    try {
      if (editingId) {
        await api.patch(`/teams/${editingId}`, payload);
        setMessage("Team updated successfully.");
      } else {
        await api.post("/teams", payload);
        setMessage("Team added successfully.");
      }

      resetForm();
      await fetchTeams();
    } catch (err) {
      const details = err.response?.data?.error;
      setError(
        Array.isArray(details)
          ? details.join(", ")
          : details || "Unable to save the team."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (team) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`/teams/${team.id}`, {
        active: !team.active,
      });
      setMessage(`${team.name} ${team.active ? "deactivated" : "activated"}.`);
      await fetchTeams();
    } catch (err) {
      const details = err.response?.data?.error;
      setError(
        Array.isArray(details)
          ? details.join(", ")
          : details || "Unable to update team status."
      );
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-white/10 bg-gray-950 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400";
  const labelClass = "block text-sm font-semibold text-gray-300";

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-gray-900/80 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            Admin workspace
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Team Management
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Add clubs, manage team details and maintain their crest URLs.
          </p>
        </div>
        <span className="w-fit rounded-full border border-yellow-400/30 px-3 py-1 text-xs font-bold text-yellow-300">
          {teams.length} teams
        </span>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="mb-4 rounded-lg border border-green-500/30 bg-green-950/30 p-3 text-sm text-green-200">
          {message}
        </div>
      )}

      <form id="team-manager-form" onSubmit={saveTeam} className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-black/20 p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="font-bold text-white">
            {editingId ? "Edit team" : "Add a team"}
          </h3>
        </div>

        <label className={labelClass}>
          Team name *
          <input
            className={inputClass}
            name="name"
            value={form.name}
            onChange={changeField}
            placeholder="e.g. Arsenal"
            required
            maxLength={120}
          />
        </label>

        <label className={labelClass}>
          Short name
          <input
            className={inputClass}
            name="shortName"
            value={form.shortName}
            onChange={changeField}
            placeholder="e.g. ARS"
            maxLength={20}
          />
        </label>

        <label className={labelClass}>
          Country *
          <input
            className={inputClass}
            name="country"
            value={form.country}
            onChange={changeField}
            placeholder="e.g. England"
            required
            maxLength={100}
          />
        </label>

        <label className={labelClass}>
          Team logo URL
          <input
            className={inputClass}
            name="logoUrl"
            type="url"
            value={form.logoUrl}
            onChange={changeField}
            placeholder="https://example.com/team-logo.png"
          />
        </label>

        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-gray-950/70 p-3 md:col-span-2">
          <TeamCrest
            key={form.logoUrl.trim()}
            url={form.logoUrl.trim()}
            name={form.name}
            shortName={form.shortName}
          />
          <div className="min-w-0">
            <p className="font-bold text-white">
              {form.name || "Team crest preview"}
            </p>
            <p className="mt-1 break-all text-xs text-gray-400">
              {form.logoUrl || "Enter a public image URL to preview the crest."}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-300 md:col-span-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={changeField}
            className="h-4 w-4 accent-yellow-400"
          />
          Team is active and available for new match selection
        </label>

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Add team"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/5"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h3 className="mb-3 font-bold text-white">Existing teams</h3>

        {loading ? (
          <p className="py-6 text-sm text-gray-400">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="py-6 text-sm text-gray-400">No teams found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {teams.map((team) => (
              <article
                key={team.id}
                className="flex min-w-0 flex-col gap-4 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gray-800">
                    {team.logoUrl ? (
                      <img
                        src={team.logoUrl}
                        alt={`${team.name} crest`}
                        className="h-full w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">
                        {(team.shortName || team.name || "?").slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-bold text-white">{team.name}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {[team.shortName, team.country].filter(Boolean).join(" · ")}
                    </p>
                    <p className={`mt-1 text-xs font-bold ${team.active ? "text-green-400" : "text-gray-500"}`}>
                      {team.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editTeam(team)}
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(team)}
                    className="rounded-lg border border-yellow-400/30 px-3 py-2 text-xs font-bold text-yellow-300 hover:bg-yellow-400/10"
                  >
                    {team.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TeamManager;
