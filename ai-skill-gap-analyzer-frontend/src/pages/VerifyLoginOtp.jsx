
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";

import "../styles/verify-otp.css";

function VerifyLoginOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verifyOtp = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must contain 6 digits");
      return;
    }

    if (!email) {
      setError("Login session expired. Please login again.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/verify-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            otp: otp
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "OTP verification failed"
        );
      }

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      setMessage("OTP verified successfully!");

      // Go to dashboard
      setTimeout(() => {

        navigate("/dashboard");

      }, 700);

    } catch (err) {

      setError(
        err.message || "Invalid OTP"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="verify-page">

      <div className="verify-card">

        <div className="verify-icon">
          <ShieldCheck size={42} />
        </div>

        <h1>Two-Step Verification</h1>

        <p className="verify-description">
          Enter the 6-digit verification code
          sent to your email address.
        </p>

        <div className="email-display">
          <Mail size={18} />
          <span>{email}</span>
        </div>

        <form onSubmit={verifyOtp}>

          <label htmlFor="otp">
            Verification Code
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {

              const value =
                e.target.value.replace(/\D/g, "");

              setOtp(value);
            }}
            autoFocus
          />

          {error && (
            <div className="verify-error">
              {error}
            </div>
          )}

          {message && (
            <div className="verify-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify & Login"}
          </button>

        </form>

        <button
          className="back-login"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={17} />
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default VerifyLoginOtp;

