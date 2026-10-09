import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import PredictionForm from "./PredictionForm";

function PredictionManager() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [editingPrediction, setEditingPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [predictionsResponse, matchesResponse] = await Promise.all([
        api.get("/predictions"),
        api.get("/matches"),
      ]);

      setPredictions(predictionsResponse.data);
      setMatches(matchesResponse.data);
    } catch (err) {
      console.error("Failed to load admin prediction data:", err);
      setError(
        err.response?.data?.error ||
          "Unable to load prediction management data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingPrediction) {
        await api.patch(`/predictions/${editingPrediction.id}`, data);
        setEditingPrediction(null);
        setMessage("Prediction updated successfully.");
        await fetchData();
      } else {
        const response = await api.post("/predictions", data);
        const createdPrediction = response.data?.prediction || response.data;

        if (!createdPrediction?.id) {
          throw new Error("Prediction was saved, but its ID was not returned.");
        }

        setEditingPrediction(null);
        setOpen(false);

        navigate("/", {
          state: { focusPredictionId: createdPrediction.id },
        });
      }
    } catch (err) {
      console.error("Failed to save prediction:", err);
      setError(
        err.response?.data?.error ||
          "Unable to save the prediction."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      setMessage("");

      await api.delete(`/predictions/${id}`);

      setDeleteId(null);
      setMessage("Prediction deleted successfully.");

      if (editingPrediction?.id === id) {     setEditingPrediction(null);
      }

      await fetchData();
    } catch (err) {
      console.error("Failed to delete prediction:", err);
      setError(
        err.response?.data?.error ||
          "Unable to delete the prediction."
      );
    }
  };

  const handleEdit = (prediction) => {
    setMessage("");
    setError("");
    setEditingPrediction(prediction);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    setEditingPrediction(null);
  };

  return (
    <section className="mt-12">
      <div className="overflow-hidden rounded-2xl border border-yellow-400/20 bg-black/60 shadow-2xl shadow-black/20">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/[0.03] sm:px-6"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              Admin
            </p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
              Prediction Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create, edit and remove football predictions.
            </p>
          </div>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-yellow-400">
            {open ? "−" : "+"}
          </span>
        </button>

        {open && (
          <div className="border-t border-white/10 p-5 sm:p-6">
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {Array.isArray(error) ? error.join(", ") : error}
              </div>
            )}

            {message && (
              <div className="mb-5 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
                {message}
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                  {editingPrediction ? "Edit Prediction" : "New Prediction"}
                </p>
                <h3 className="mt-1 text-lg font-black text-white">
                  {editingPrediction
                    ? "Update prediction details"
                    : "Add a prediction"}
                </h3>
              </div>

              {loading && matches.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  Loading matches...
                </div>
              ) : (
                <PredictionForm
                  matches={matches}
                  initialData={editingPrediction}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelEdit}
                  saving={saving}
                />
              )}
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                    Existing Predictions
                  </p>
                  <h3 className="mt-1 text-lg font-black text-white">
                    Manage predictions
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-400">
                  {predictions.length}
                </span>
              </div>

              {loading && predictions.length === 0 ? (
                <div className="pt-card p-6 text-center text-sm text-gray-400">
                  Loading predictions...
                </div>
              ) : predictions.length === 0 ? (
                <div className="pt-card p-6 text-center text-sm text-gray-400">
                  No predictions available.
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-white">
                              {prediction.homeTeam} vs{" "}
                              {prediction.awayTeam}
                            </span>

                            <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-[10px] font-black uppercase text-yellow-400">
                              {prediction.type}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase text-gray-400">
                              {prediction.status}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-400">
                            {prediction.market} · {prediction.selection} ·{" "}
                            {prediction.odds}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Confidence: {prediction.confidence}%
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(prediction)}
                            className="min-h-[40px] rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-4 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(prediction.id)}
                            className="min-h-[40px] rounded-lg border border-red-400/20 bg-red-400/10 px-4 text-sm font-bold text-red-300 transition hover:bg-red-400 hover:text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {deleteId === prediction.id && (
                        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-bold text-red-200">
                            Delete this prediction?
                          </p>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDeleteId(null)}
                              className="min-h-[38px] rounded-lg border border-white/10 bg-white/5 px-4 text-xs font-bold text-gray-300 transition hover:bg-white/10"
                        >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(prediction.id)}
                              className="min-h-[38px] rounded-lg bg-red-500 px-4 text-xs font-black text-white transition hover:bg-red-400"
                            >
                              Confirm Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PredictionManager;
