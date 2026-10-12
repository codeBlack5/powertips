import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/client";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Refs for inputs
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) {
      await Swal.fire({ icon: "warning", title: "First name required", text: "Please enter your first name." });
      document.querySelector("#firstName")?.focus();
      return;
    }
    if (!lastName.trim()) {
      await Swal.fire({ icon: "warning", title: "Last name required", text: "Please enter your last name." });
      lastNameRef.current?.focus();
      return;
    }
    if (!email.trim()) {
      await Swal.fire({ icon: "warning", title: "Email required", text: "Please enter your email address." });
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      await Swal.fire({ icon: "warning", title: "Password required", text: "Please create a password." });
      passwordRef.current?.focus();
      return;
    }
    if (!passwordConfirmation || password !== passwordConfirmation) {
      await Swal.fire({ icon: "warning", title: "Passwords do not match", text: "Please confirm your password correctly." });
      passwordConfRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      if (!response.data?.token || !response.data?.user) {
        throw new Error("Registration succeeded, but authentication details were not returned. Please log in.");
      }

      login(response.data);

      await Swal.fire({
        icon: "success",
        title: "Welcome to Power Tips Predictions!",
        text: "Your account has been created successfully.",
        confirmButtonText: "Go to Dashboard",
        confirmButtonColor: "#ca8a04",
        background: "#111827",
        color: "#ffffff",
      });

      navigate("/", { replace: true });
    } catch (error) {
      const apiError = error.response?.data?.error;
      const message =
        Array.isArray(apiError) ? apiError.join(", ") :
        apiError || error.message ||
        "Registration failed. Please try again.";

      await Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: message,
        confirmButtonColor: "#ca8a04",
        background: "#111827",
        color: "#ffffff",
      });
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password &&
    passwordConfirmation &&
    password === passwordConfirmation;

  // Live validation helpers
  const inputClass = (value, required = true, matchValue = null) => {
    const base = "w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition ";
    const valid = "bg-gray-800 text-white focus:ring-green-500 border border-green-500";
    const invalid = "bg-gray-800 text-white focus:ring-red-500 border border-red-500";
    if (!value && required) return base + "bg-gray-800 text-white border border-gray-600";
    if (matchValue !== null) return value === matchValue ? base + valid : base + invalid;
    return value ? base + valid : base + invalid;
  };

  // Handle Enter key to move to next input or submit form
  const handleKeyDown = (e, nextRef, submitHandler = null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else if (submitHandler) {
        submitHandler(e);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className={inputClass(firstName)}
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
            required
          />

          <input
            ref={lastNameRef}
            type="text"
            placeholder="Last Name"
            className={inputClass(lastName)}
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, emailRef)}
            required
          />

          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className={inputClass(email)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
            required
          />

          <div className="relative">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={inputClass(password) + " pr-12"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, passwordConfRef)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 transition hover:text-blue-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <input
              ref={passwordConfRef}
              type={showPasswordConfirmation ? "text" : "password"}
              placeholder="Confirm Password"
              className={inputClass(passwordConfirmation, true, password) + " pr-12"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, null, handleRegister)}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswordConfirmation((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 transition hover:text-blue-400"
              aria-label={
                showPasswordConfirmation
                  ? "Hide password confirmation"
                  : "Show password confirmation"
              }
            >
              {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {password && passwordConfirmation && password !== passwordConfirmation && (
          <p className="text-red-500 text-sm mt-2 text-center">
            Passwords do not match
          </p>
        )}

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
