import React, { useCallback, useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminRequestsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setError("");
      const { data } = await api.get("/admin_requests");
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to load admin requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const reviewRequest = async (requestId, status) => {
    setBusyId(requestId);
    setError("");
    setMessage("");

    try {
      const { data } = await api.patch(`/admin_requests/${requestId}`, {
        status,
      });

      setMessage(data.message || `Request ${status}.`);
      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to review this request."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-10 rounded-3xl border border-yellow-400/20 bg-black/80 p-5 text-white shadow-xl sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
          Administration
        </p>
        <h2 className="mt-2 text-2xl font-black">Admin Access Requests</h2>
        <p className="mt-2 text-sm text-gray-400">
          Review users requesting administrator access.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="mb-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-300">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="rounded-xl border border-white/10 p-5 text-sm text-gray-400">
          There are no admin access requests.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="break-words font-bold">
                  {request.user?.name || "Unknown user"}
                </h3>
                <p className="break-all text-sm text-gray-400">
                  {request.user?.email}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Submitted:{" "}
                  {request.createdAt
                    ? new Date(request.createdAt).toLocaleString()
                    : "Unknown"}
                </p>
                <p className="mt-1 text-sm">
                  Status:{" "}
                  <span
                    className={
                      request.status === "pending"
                        ? "font-bold text-yellow-400"
                        : request.status === "approved"
                          ? "font-bold text-green-400"
                          : "font-bold text-red-400"
                    }
                  >
                    {request.status}
                  </span>
                </p>
              </div>

              {request.status === "pending" && (
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => reviewRequest(request.id, "approved")}
                    className="min-h-11 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {busyId === request.id ? "Saving..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => reviewRequest(request.id, "rejected")}
                    className="min-h-11 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
