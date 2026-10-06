import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Mail,
  ShieldCheck
} from "lucide-react";

import ThemeToggle from "../../components/ThemeToggle";

import "../../styles/auth.css";

function ResetPassword() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState(
    sessionStorage.getItem("resetEmail") || ""
  );

  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [otpVerified, setOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = async () => {

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email address is missing.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must contain 6 digits.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message || "Invalid OTP."
        );

        return;
      }

      setOtpVerified(true);

      setSuccess(
        "OTP verified successfully. You can now create a new password."
      );

    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // RESET PASSWORD
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otpVerified) {

      setError(
        "Please verify the OTP first."
      );

      return;
    }

    if (!formData.password) {

      setError(
        "Please enter a new password."
      );

      return;
    }

    if (formData.password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            newPassword: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Password reset failed."
        );

        return;
      }

      setSuccess(
        "Password reset successfully. Redirecting to login..."
      );

      // Remove temporary email
      sessionStorage.removeItem("resetEmail");

      // Redirect to login
      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="auth-page">

      {/* ================= LEFT SIDE ================= */}

      <section className="auth-info-panel">

        <div className="auth-info-content">

          <Link
            to="/"
            className="auth-brand"
          >

            <div className="auth-brand-icon">

              <Brain size={25} />

            </div>

            <span>
              Skill<span>Gap AI</span>
            </span>

          </Link>


          <div className="auth-info-main">

            <div className="auth-small-badge">

              <Sparkles size={15} />

              Reset Your Password

            </div>


            <h1>

              Secure your
              <span> account.</span>

            </h1>


            <p>

              Verify your email with the OTP
              and create a new password for
              your SkillGap AI account.

            </p>


            <div className="auth-features">


              {/* OTP */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <ShieldCheck size={18} />

                </div>

                <div>

                  <strong>
                    OTP Verification
                  </strong>

                  <small>
                    Verify your registered email
                  </small>

                </div>

              </div>


              {/* PASSWORD */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <Lock size={18} />

                </div>

                <div>

                  <strong>
                    New Password
                  </strong>

                  <small>
                    Create a new secure password
                  </small>

                </div>

              </div>


            </div>

          </div>


          <div className="auth-info-bottom">

            <CheckCircle2 size={16} />

            <span>
              Continue building your career
              with SkillGap AI.
            </span>

          </div>

        </div>

      </section>


      {/* ================= RIGHT SIDE ================= */}

      <section className="auth-form-panel">

        <div className="auth-form-top">

          <ThemeToggle />

        </div>


        <div className="auth-form-container">

          <div className="auth-form-card">


            <div className="auth-form-header">

              <div className="auth-title-icon">

                <Lock size={22} />

              </div>

              <h2>
                Reset Password
              </h2>

              <p>
                Verify your OTP and create
                a new password.
              </p>

            </div>


            {/* ================= EMAIL ================= */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  disabled={otpVerified}
                />

              </div>

            </div>


            {/* ================= OTP ================= */}

            <div className="form-group">

              <label>
                OTP
              </label>

              <div className="input-wrapper">

                <ShieldCheck size={18} />

                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  disabled={otpVerified}
                />

              </div>

            </div>


            {/* VERIFY OTP BUTTON */}

            {!otpVerified && (

              <button
                type="button"
                className="auth-submit-btn"
                onClick={handleVerifyOtp}
                disabled={loading}
              >

                {loading
                  ? "Verifying..."
                  : "Verify OTP"}

                <ShieldCheck size={18} />

              </button>

            )}


            {/* ================= PASSWORD FORM ================= */}

            {otpVerified && (

              <form onSubmit={handleSubmit}>


                {/* PASSWORD */}

                <div className="form-group">

                  <label>
                    New Password
                  </label>

                  <div className="input-wrapper">

                    <Lock size={18} />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="form-group">

                  <label>
                    Confirm Password
                  </label>

                  <div className="input-wrapper">

                    <Lock size={18} />

                    <input
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirm(
                          !showConfirm
                        )
                      }
                    >

                      {showConfirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>


                {/* RESET BUTTON */}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}

                  <ArrowRight size={18} />

                </button>

              </form>

            )}


            {/* ================= ERROR ================= */}

            {error && (

              <div className="auth-error">

                {error}

              </div>

            )}


            {/* ================= SUCCESS ================= */}

            {success && (

              <div className="auth-success">

                {success}

              </div>

            )}


            {/* ================= FOOTER ================= */}

            <div className="auth-footer">

              <span>
                Remember your password?
              </span>

              <Link to="/login">
                Sign In
              </Link>

            </div>


          </div>

        </div>

      </section>

    </div>

  );
}

export default ResetPassword;