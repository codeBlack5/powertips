import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

function Register() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for inputs
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Auto-focus the first invalid/empty field
    if (!firstName.trim()) return document.querySelector("#firstName")?.focus();
    if (!lastName.trim()) return lastNameRef.current?.focus();
    if (!email.trim()) return emailRef.current?.focus();
    if (!password) return passwordRef.current?.focus();
    if (!passwordConfirmation || password !== passwordConfirmation) return passwordConfRef.current?.focus();

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      console.log("Registration successful:", response.data);

      alert("Registration successful! You can now log in.");
    } catch (error) {
      const message =
        error.response?.data?.error?.join?.(", ") ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";

      alert(message);
      console.error("Registration failed:", error);
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

          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className={inputClass(password)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, passwordConfRef)}
            required
          />

          <input
            ref={passwordConfRef}
            type="password"
            placeholder="Confirm Password"
            className={inputClass(passwordConfirmation, true, password)}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, null, handleRegister)} // Submit form on Enter
            required
          />

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
