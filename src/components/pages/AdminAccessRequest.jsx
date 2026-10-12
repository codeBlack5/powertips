import React, { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminAccessRequest() {
  const { user, updateStoredUser } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const refreshStatus = useCallback(async () => {
    try {
      setError("");
      const { data } = await api.get("/admin_requests/mine");
      setRequest(data.request);

      if (data.request?.status === "approved") {
        const response = await api.get("/auth/me");
        updateStoredUser(response.data.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to load your admin request status."
      );
    } finally {
      setLoading(false);
    }
  }, [updateStoredUser]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const submitRequest = async () => {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/admin_requests");
      setRequest(data.request);
      setMessage(data.message || "Your request has been submitted.");
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to submit your request."
      );
      await refreshStatus();
    } finally {
      setBusy(false);
    }
  };

  if (user?.role === "admin") return null;

  return (
    <section className="mt-6 rounded-2xl border border-yellow-400/20 bg-black/80 p-5 text-white sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
        Account permissions
      </p>
      <h3 className="mt-2 text-xl font-black">Admin Access</h3>
      <p className="mt-2 text-sm text-gray-400">
        Request administrator access to manage matches, predictions and other
        platform content. An existing administrator must approve your request.
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 text-sm text-green-300">
          {message}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {loading ? (
          <span className="text-sm text-gray-400">Loading status...</span>
        ) : request?.status === "pending" ? (
          <span className="rounded-full bg-yellow-400/10 px-3 py-2 text-sm font-bold text-yellow-300">
            Request pending approval
          </span>
        ) : request?.status === "approved" ? (
          <span className="rounded-full bg-green-400/10 px-3 py-2 text-sm font-bold text-green-300">
            Approved
          </span>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={submitRequest}
            className="min-h-11 rounded-xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {busy
              ? "Submitting..."
              : request?.status === "rejected"
                ? "Request Again"
                : "Request Admin Access"}
          </button>
        )}

        <button
          type="button"
          disabled={loading || busy}
          onClick={refreshStatus}
          className="min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/5 disabled:opacity-50"
        >
          Refresh Status
        </button>
      </div>
    </section>
  );
}
