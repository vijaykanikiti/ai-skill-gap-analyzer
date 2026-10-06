import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from "lucide-react";

import ThemeToggle from "../../components/ThemeToggle";

import "../../styles/auth.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message || "Failed to send OTP."
        );

        return;
      }

      setSuccess(
        "OTP sent successfully to your email."
      );

      sessionStorage.setItem(
        "resetEmail",
        email.trim()
      );

      setTimeout(() => {
        navigate("/reset-password");
      }, 1200);

    } catch (error) {

      console.error(
        "Forgot password error:",
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

          {/* BRAND */}

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


          {/* MAIN INFORMATION */}

          <div className="auth-info-main">

            <div className="auth-small-badge">

              <Sparkles size={15} />

              Password Recovery

            </div>


            <h1>

              Recover your
              <span> account.</span>

            </h1>


            <p>

              Enter your registered email address
              and we will send you a secure OTP
              to reset your password.

            </p>


            <div className="auth-features">

              {/* FEATURE 1 */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <Mail size={18} />

                </div>

                <div>

                  <strong>
                    Email Verification
                  </strong>

                  <small>
                    We'll send a verification OTP
                    to your email
                  </small>

                </div>

              </div>


              {/* FEATURE 2 */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <ShieldCheck size={18} />

                </div>

                <div>

                  <strong>
                    Secure Recovery
                  </strong>

                  <small>
                    OTP is valid for 5 minutes
                  </small>

                </div>

              </div>

            </div>

          </div>


          {/* BOTTOM */}

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

        {/* THEME */}

        <div className="auth-form-top">

          <ThemeToggle />

        </div>


        {/* FORM CONTAINER */}

        <div className="auth-form-container">

          <div className="auth-form-card">


            {/* HEADER */}

            <div className="auth-form-header">

              <div className="auth-title-icon">

                <Mail size={22} />

              </div>

              <h2>
                Forgot Password
              </h2>

              <p>
                Enter your registered email
                to receive an OTP.
              </p>

            </div>


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    disabled={loading}
                    required
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (

                <div className="auth-error">

                  {error}

                </div>

              )}


              {/* SUCCESS */}

              {success && (

                <div className="auth-success">

                  {success}

                </div>

              )}


              {/* BUTTON */}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >

                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}

                <ArrowRight size={18} />

              </button>

            </form>


            {/* FOOTER */}

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

export default ForgotPassword;