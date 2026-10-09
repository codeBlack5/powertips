import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaLock, FaSave, FaTimes, FaUserCircle } from "react-icons/fa";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user, updateStoredUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPasswordSaving, setIsChangingPasswordSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    password_confirmation: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    new_password: false,
    password_confirmation: false,
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/me");

        if (!mounted) return;

        const currentUser = data.user;

        setProfile({
          name: currentUser.name || "",
          email: currentUser.email || "",
        });

        updateStoredUser(currentUser);
      } catch (err) {
        if (!mounted) return;

        setError(
          err.response?.data?.error ||
            "Unable to load your profile."
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [updateStoredUser]);

  const handleChange = (event) => {
    setProfile((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !passwordForm.current_password ||
      !passwordForm.new_password ||
      !passwordForm.password_confirmation
    ) {
      setError("All password fields are required.");
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (
      passwordForm.new_password !==
      passwordForm.password_confirmation
    ) {
      setError("New passwords do not match.");
      return;
    }

    setIsChangingPasswordSaving(true);

    try {
      const { data } = await api.patch("/auth/password", passwordForm);

      setPasswordForm({
        current_password: "",
        new_password: "",
        password_confirmation: "",
      });

      setIsChangingPassword(false);
      setSuccess(data.message || "Password changed successfully.");
    } catch (err) {
      const apiError = err.response?.data?.error;

      setError(
        Array.isArray(apiError)
          ? apiError.join(", ")
          : apiError || "Unable to change your password."
      );
    } finally {
      setIsChangingPasswordSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!profile.name.trim() || !profile.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setIsSaving(true);

    try {
      const { data } = await api.patch("/auth/me", {
        name: profile.name.trim(),
        email: profile.email.trim(),
      });

      updateStoredUser(data.user);

      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      const apiError = err.response?.data?.error;

      setError(
        Array.isArray(apiError)
          ? apiError.join(", ")
          : apiError || "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm font-semibold text-gray-400">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            View and manage your PowerTips account details.
          </p>
        </div>

        {/* Profile card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
          {/* Profile banner */}
          <div className="border-b border-white/10 bg-gradient-to-r from-yellow-400/10 via-transparent to-transparent px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
                  <FaUserCircle size={34} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black text-white">
                    {user?.name || "PowerTips User"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          {(error || success) && (
            <div className="px-5 pt-5 sm:px-8">
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-300">
                  {success}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="p-5 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    className="pt-input w-full"
                    autoComplete="name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                  >
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="pt-input w-full"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Account Role
                  </p>

                  <p className="mt-1 text-sm font-bold capitalize text-yellow-400">
                    {user?.role || "user"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your account role is managed by PowerTips administrators.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaSave />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Full Name
                  </p>
                  <p className="mt-2 break-words text-base font-bold text-white">
                    {user?.name || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email Address
                  </p>
                  <p className="mt-2 break-words text-base font-bold text-white">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Account Role
                  </p>
                  <p className="mt-2 text-base font-bold capitalize text-yellow-400">
                    {user?.role || "user"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Account Status
                  </p>
                  <p className="mt-2 text-base font-bold text-green-400">
                    {user?.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Change password */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
          <div className="flex flex-col gap-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <div className="flex items-center gap-2">
                <FaLock className="text-yellow-400" />
                <h2 className="text-lg font-black text-white">
                  Change Password
                </h2>
              </div>

              <p className="mt-1 text-sm leading-6 text-gray-400">
                Keep your account secure by updating your password.
              </p>
            </div>

            {!isChangingPassword && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setIsChangingPassword(true);
                }}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-5 text-sm font-black text-yellow-400 transition hover:bg-yellow-400/20"
              >
                <FaLock />
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form
              onSubmit={handleChangePassword}
              className="space-y-5 p-5 sm:p-8"
            >
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Current Password
                </label>

                <div className="relative">
                  <input
                    id="current-password"
                    name="current_password"
                    type={showPasswords.current_password ? "text" : "password"}
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    className="pt-input w-full pr-12"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        current_password: !current.current_password,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 transition hover:text-yellow-400"
                    aria-label={
                      showPasswords.current_password
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showPasswords.current_password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="new-password"
                    name="new_password"
                    type={showPasswords.new_password ? "text" : "password"}
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    className="pt-input w-full pr-12"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        new_password: !current.new_password,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 transition hover:text-yellow-400"
                    aria-label={
                      showPasswords.new_password
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showPasswords.new_password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="password-confirmation"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    id="password-confirmation"
                    name="password_confirmation"
                    type={
                      showPasswords.password_confirmation
                        ? "text"
                        : "password"
                    }
                    value={passwordForm.password_confirmation}
                    onChange={handlePasswordChange}
                    className="pt-input w-full pr-12"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        password_confirmation:
                          !current.password_confirmation,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 transition hover:text-yellow-400"
                    aria-label={
                      showPasswords.password_confirmation
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                  >
                    {showPasswords.password_confirmation ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordForm({
                      current_password: "",
                      new_password: "",
                      password_confirmation: "",
                    });
                    setError("");
                    setSuccess("");
                    setIsChangingPassword(false);
                  }}
                  disabled={isChangingPasswordSaving}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isChangingPasswordSaving}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaSave />
                  {isChangingPasswordSaving
                    ? "Changing..."
                    : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Profile;
