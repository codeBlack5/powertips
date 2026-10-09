import React, { useEffect, useState } from "react";
import api from "../../api/client";

const EMPTY_FORM = {
  name: "",
  country: "",
  logoUrl: "",
  active: true,
};

function LeagueManager() {
  const [leagues, setLeagues] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);

  const loadLeagues = async () => {
    setError("");
    try {
      const response = await api.get("/leagues");
      setLeagues(response.data);
    } catch (err) {
      const detail = err.response?.data?.error;
      setError(Array.isArray(detail) ? detail.join(", ") : detail || "Unable to load leagues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "logoUrl") setLogoFailed(false);
    setError("");
    setMessage("");
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setLogoFailed(false);
    setError("");
    setMessage("");
  };

  const editLeague = (league) => {
    setEditingId(league.id);
    setForm({
      name: league.name || "",
      country: league.country || "",
      logoUrl: league.logoUrl || "",
      active: league.active !== false,
    });
    setLogoFailed(false);
    setError("");
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      country: form.country.trim(),
      logoUrl: form.logoUrl.trim() || null,
      active: form.active,
    };

    if (!payload.name || !payload.country) {
      setError("League name and country are required.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await api.patch(`/leagues/${editingId}`, payload);
        setMessage("League updated successfully.");
      } else {
        await api.post("/leagues", payload);
        setMessage("League created successfully.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setLogoFailed(false);
      await loadLeagues();
    } catch (err) {
      const detail = err.response?.data?.error;
      setError(Array.isArray(detail) ? detail.join(", ") : detail || "Unable to save league. Confirm you are signed in as an admin.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (league) => {
    setError("");
    setMessage("");
    try {
      await api.patch(`/leagues/${league.id}`, { active: !league.active });
      setMessage(`${league.name} ${league.active ? "deactivated" : "activated"}.`);
      await loadLeagues();
    } catch (err) {
      const detail = err.response?.data?.error;
      setError(Array.isArray(detail) ? detail.join(", ") : detail || "Unable to change league status.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-gray-950 px-3 py-3 text-sm text-white outline-none focus:border-yellow-400";
  const labelClass = "mb-2 block text-sm font-bold text-gray-300";

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-yellow-400/20 bg-black/60 shadow-xl">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
          Admin workspace
        </p>
        <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
          League Management
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Add competitions, edit league details, and control which leagues are available for new fixtures.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
        {error && (
          <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {message && (
          <div role="status" className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="league-name" className={labelClass}>League name *</label>
            <input
              id="league-name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Bundesliga"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="league-country" className={labelClass}>Country / region *</label>
            <input
              id="league-country"
              name="country"
              value={form.country}
              onChange={updateField}
              placeholder="e.g. Germany"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="league-logo" className={labelClass}>League logo URL (optional)</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="league-logo"
              name="logoUrl"
              type="url"
              value={form.logoUrl}
              onChange={updateField}
              placeholder="https://example.com/league-logo.png"
              className={inputClass}
            />
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gray-800">
              {form.logoUrl.trim() && !logoFailed ? (
                <img
                  key={form.logoUrl.trim()}
                  src={form.logoUrl.trim()}
                  alt="League logo preview"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="px-1 text-center text-xs text-gray-400">
                  {form.logoUrl.trim() && logoFailed ? "Unavailable" : "No logo"}
                </span>
              )}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={updateField}
            className="h-4 w-4 accent-yellow-400"
          />
          League is active and available for new fixtures
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="min-h-[44px] rounded-lg bg-yellow-400 px-5 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add League"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[44px] rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/5"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="border-t border-white/10 px-5 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-bold text-white">Existing leagues</h3>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">
            {leagues.length} total
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading leagues…</p>
        ) : leagues.length === 0 ? (
          <p className="text-sm text-gray-400">No leagues found.</p>
        ) : (
          <div className="space-y-3">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gray-800">
                    {league.logoUrl ? (
                      <img
                        src={league.logoUrl}
                        alt={`${league.name} logo`}
                        className="h-full w-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xs font-black text-yellow-400">
                        {league.name.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-bold text-white">{league.name}</p>
                    <p className="text-sm text-gray-400">{league.country}</p>
                    <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${league.active ? "bg-green-400/10 text-green-300" : "bg-gray-500/15 text-gray-400"}`}>
                      {league.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editLeague(league)}
                    className="min-h-[40px] rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(league)}
                    className={`min-h-[40px] rounded-lg border px-3 py-2 text-sm font-semibold ${league.active ? "border-red-400/30 text-red-300 hover:bg-red-400/10" : "border-green-400/30 text-green-300 hover:bg-green-400/10"}`}
                  >
                    {league.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LeagueManager;
