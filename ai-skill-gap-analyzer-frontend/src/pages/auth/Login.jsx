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

import { GoogleLogin } from "@react-oauth/google";

import ThemeToggle from "../../components/ThemeToggle";

import "../../styles/auth.css";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
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
  // NORMAL EMAIL/PASSWORD LOGIN
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      const loginData = {
        email: formData.email
          .trim()
          .toLowerCase(),

        password: formData.password
      };

      console.log(
        "Login data:",
        loginData
      );


      // -----------------------------------------------------
      // CALL SPRING BOOT LOGIN API
      // -----------------------------------------------------

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(loginData)
        }
      );


      const data = await response.json();


      // -----------------------------------------------------
      // BACKEND ERROR
      // -----------------------------------------------------

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid email or password."
        );

        return;
      }


      console.log(
        "Login successful:",
        data
      );


      // -----------------------------------------------------
      // SAVE USER
      // -----------------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );


      // -----------------------------------------------------
      // REMEMBER ME
      // -----------------------------------------------------

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


      // -----------------------------------------------------
      // REDIRECT BASED ON ROLE
      // -----------------------------------------------------

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
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure Spring Boot is running on port 8080."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // GOOGLE LOGIN SUCCESS
  // =========================================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    try {

      setLoading(true);

      setError("");


      // Google returns an ID token/credential

      const credential =
        credentialResponse?.credential;


      if (!credential) {

        setError(
          "Google authentication failed. Please try again."
        );

        return;
      }


      console.log(
        "Google credential received"
      );


      // -----------------------------------------------------
      // SEND GOOGLE CREDENTIAL TO SPRING BOOT
      // -----------------------------------------------------

      const response = await fetch(
        "http://localhost:8080/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            credential: credential
          })
        }
      );


      const data = await response.json();


      // -----------------------------------------------------
      // BACKEND ERROR
      // -----------------------------------------------------

      if (!response.ok) {

        setError(
          data.message ||
          "Google login failed."
        );

        return;
      }


      console.log(
        "Google login successful:",
        data
      );


      // -----------------------------------------------------
      // SAVE GOOGLE USER
      // -----------------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );


      // -----------------------------------------------------
      // REDIRECT
      // -----------------------------------------------------

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
        "Google login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure Spring Boot is running on port 8080."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // GOOGLE LOGIN ERROR
  // =========================================================

  const handleGoogleError = () => {

    console.error(
      "Google Login Failed"
    );

    setError(
      "Google login failed. Please try again."
    );
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

                    Signing In...

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
                GOOGLE LOGIN
            ================================================= */}

            <div className="google-login-container">

              <GoogleLogin
                onSuccess={
                  handleGoogleSuccess
                }

                onError={
                  handleGoogleError
                }

                useOneTap={false}

                theme="outline"

                size="large"

                text="continue_with"

                shape="rectangular"

                width="100%"
              />

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