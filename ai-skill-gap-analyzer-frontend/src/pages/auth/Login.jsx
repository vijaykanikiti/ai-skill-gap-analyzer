
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Home
} from "lucide-react";

import ThemeToggle from "../../components/ThemeToggle";

import {
  loginWithGoogle
} from "../../firebase/authService";

import "../../styles/auth.css";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      remember: false
    });


  // =========================================================
  // HANDLE INPUT CHANGES
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setFormData((previousData) => ({
      ...previousData,

      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

    setError("");
  };


  // =========================================================
  // EMAIL + PASSWORD LOGIN
  // TWO-STEP AUTHENTICATION
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      const email =
        formData.email
          .trim()
          .toLowerCase();

      const password =
        formData.password;


      // =====================================================
      // STEP 1
      // SEND EMAIL + PASSWORD TO SPRING BOOT
      // =====================================================

      const response =
        await fetch(
          "http://localhost:8080/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email: email,
              password: password
            })
          }
        );


      // =====================================================
      // READ BACKEND RESPONSE
      // =====================================================

      const data =
        await response.json();


      // =====================================================
      // LOGIN ERROR
      // =====================================================

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid email or password."
        );

        return;
      }


      // =====================================================
      // TWO-STEP AUTHENTICATION
      // OTP REQUIRED
      // =====================================================

      if (data.requiresOtp === true) {

        // Remember me
        if (formData.remember) {

          localStorage.setItem(
            "rememberMe",
            "true"
          );

        } else {

          localStorage.removeItem(
            "rememberMe"
          );
        }


        // Go to OTP verification page
        navigate(
          "/verify-login-otp",
          {
            state: {
              email: data.email
            }
          }
        );

        return;
      }


      // =====================================================
      // FALLBACK
      // =====================================================

      setError(
        "Two-step verification could not be started."
      );

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // FIREBASE GOOGLE LOGIN
  // =========================================================

  const handleGoogleLogin = async () => {

    try {

      setLoading(true);

      setError("");


      // =====================================================
      // STEP 1
      // LOGIN USING FIREBASE GOOGLE
      // =====================================================

      const firebaseUser =
        await loginWithGoogle();

      console.log(
        "Firebase Google login successful:",
        firebaseUser
      );


      // =====================================================
      // STEP 2
      // GET FIREBASE ID TOKEN
      // =====================================================

      const idToken =
        await firebaseUser.getIdToken();

      console.log(
        "Firebase Google ID token received."
      );


      // =====================================================
      // STEP 3
      // SEND TOKEN TO SPRING BOOT
      // =====================================================

      const response =
        await fetch(
          "http://localhost:8080/api/auth/firebase",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              idToken: idToken,

              name:
                firebaseUser.displayName ||
                ""
            })
          }
        );


      // =====================================================
      // STEP 4
      // READ BACKEND RESPONSE
      // =====================================================

      const data =
        await response.json();


      // =====================================================
      // BACKEND ERROR
      // =====================================================

      if (!response.ok) {

        setError(
          data.message ||
          "Firebase Google authentication failed."
        );

        return;
      }


      console.log(
        "Firebase Google backend login successful:",
        data
      );


      // =====================================================
      // STEP 5
      // SAVE USER
      // =====================================================

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );


      // =====================================================
      // STEP 6
      // REDIRECT BASED ON ROLE
      // =====================================================

      if (data.role === "ADMIN") {

        navigate(
          "/admin/dashboard"
        );

      } else {

        navigate(
          "/dashboard"
        );
      }


    } catch (error) {

      console.error(
        "Firebase Google Login Error:",
        error
      );


      // =====================================================
      // GOOGLE FIREBASE ERROR HANDLING
      // =====================================================

      if (
        error.code ===
        "auth/popup-closed-by-user"
      ) {

        setError(
          "Google login was cancelled."
        );

      } else if (
        error.code ===
        "auth/popup-blocked"
      ) {

        setError(
          "Google login popup was blocked by the browser."
        );

      } else if (
        error.code ===
        "auth/account-exists-with-different-credential"
      ) {

        setError(
          "An account already exists with this email using a different login method."
        );

      } else if (
        error.code ===
        "auth/network-request-failed"
      ) {

        setError(
          "Network error. Please check your internet connection."
        );

      } else {

        setError(
          error.message ||
          "Google login failed. Please try again."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="auth-page">


      {/* =====================================================
          LEFT INFORMATION PANEL
      ===================================================== */}

      <section className="auth-info-panel">

        <div className="auth-info-content">


          {/* LOGO */}

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


          {/* MAIN CONTENT */}

          <div className="auth-info-main">


            {/* BADGE */}

            <div className="auth-small-badge">

              <Sparkles size={15} />

              AI-Powered Career Development

            </div>


            {/* HEADING */}

            <h1>

              Discover your
              <span> skill gaps.</span>

              <br />

              Build your future.

            </h1>


            {/* DESCRIPTION */}

            <p>

              Analyze your resume, discover missing skills,
              and create a personalized roadmap to become
              career-ready.

            </p>


            {/* FEATURES */}

            <div className="auth-features">


              {/* FEATURE 1 */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <Brain size={18} />

                </div>

                <div>

                  <strong>
                    AI Resume Analysis
                  </strong>

                  <small>
                    Extract skills and experience automatically
                  </small>

                </div>

              </div>


              {/* FEATURE 2 */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <Target size={18} />

                </div>

                <div>

                  <strong>
                    Skill Gap Detection
                  </strong>

                  <small>
                    Find the skills you need for your target role
                  </small>

                </div>

              </div>


              {/* FEATURE 3 */}

              <div className="auth-feature">

                <div className="feature-icon">

                  <TrendingUp size={18} />

                </div>

                <div>

                  <strong>
                    Personalized Roadmap
                  </strong>

                  <small>
                    Get a learning path designed for your career
                  </small>

                </div>

              </div>


            </div>

          </div>


          {/* BOTTOM */}

          <div className="auth-info-bottom">

            <CheckCircle2 size={16} />

            <span>
              Turn your current skills into your career goals.
            </span>

          </div>


        </div>

      </section>


      {/* =====================================================
          RIGHT LOGIN PANEL
      ===================================================== */}

      <section className="auth-form-panel">


        {/* THEME TOGGLE */}

        <div className="auth-form-top">

          <ThemeToggle />

        </div>


        <div className="auth-form-container">

          <div className="auth-form-card">


            {/* =================================================
                BACK TO HOME
            ================================================= */}

            <Link
              to="/"
              className="back-home-btn"
            >

              <Home size={17} />

              <span>
                Back to Home
              </span>

            </Link>


            {/* HEADER */}

            <div className="auth-form-header">

              <div className="auth-title-icon">

                <Sparkles size={22} />

              </div>

              <h2>
                Welcome Back
              </h2>

              <p>
                Sign in to continue your career journey.
              </p>

            </div>


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <Mail size={18} />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <div className="password-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>

                </div>


                <div className="input-wrapper">

                  <Lock size={18} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />


                  {/* PASSWORD TOGGLE */}

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


              {/* ERROR MESSAGE */}

              {error && (

                <div className="auth-error">

                  {error}

                </div>

              )}


              {/* REMEMBER ME */}

              <div className="remember-row">

                <label className="remember-label">

                  <input
                    type="checkbox"
                    name="remember"
                    checked={
                      formData.remember
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Remember me
                  </span>

                </label>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >

                {loading ? (

                  <>

                    <Loader2
                      size={18}
                      className="loading-spinner"
                    />

                    Sending Verification Code...

                  </>

                ) : (

                  <>

                    Sign In

                    <ArrowRight
                      size={18}
                    />

                  </>

                )}

              </button>


            </form>


            {/* DIVIDER */}

            <div className="auth-divider">

              <span>
                OR
              </span>

            </div>


            {/* =================================================
                FIREBASE GOOGLE LOGIN
            ================================================= */}

            <div className="google-login-container">

              <button
                type="button"
                className="google-login-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >

                <span className="google-icon">
                  G
                </span>

                <span>
                  Continue with Google
                </span>

              </button>

            </div>


            {/* REGISTER */}

            <div className="auth-footer">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create Account
              </Link>

            </div>


          </div>

        </div>

      </section>


    </div>
  );
}

export default Login;

