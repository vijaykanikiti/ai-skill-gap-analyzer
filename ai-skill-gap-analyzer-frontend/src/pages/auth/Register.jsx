import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Loader2
} from "lucide-react";

import ThemeToggle from "../../components/ThemeToggle";

import "../../styles/auth.css";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });


  // Handle input changes
  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value
    }));

    setError("");
    setSuccess("");
  };


  // Submit registration
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Check password
    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match.");
      return;
    }


    // Check terms
    if (!formData.terms) {

      setError(
        "Please accept the Terms and Conditions."
      );

      return;
    }


    try {

      setLoading(true);


      /*
       * Data sent to Spring Boot
       *
       * Only the required registration
       * information is collected here.
       */
      const registrationData = {

        name: formData.name.trim(),

        email: formData.email
          .trim()
          .toLowerCase(),

        password: formData.password,

        // These will be completed later
        targetRole: "",
        phone: "",
        location: ""
      };


      console.log(
        "Registration data:",
        registrationData
      );


      // Call Spring Boot Register API
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(registrationData)
        }
      );


      const data = await response.json();


      // Backend error
      if (!response.ok) {

        setError(
          data.message ||
          "Registration failed. Please try again."
        );

        return;
      }


      // Registration successful
      console.log(
        "Registration successful:",
        data
      );


      setSuccess(
        "Account created successfully! Redirecting to login..."
      );


      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false
      });


      // Redirect to login
      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      setError(
        "Unable to connect to the server. Please make sure Spring Boot is running on port 8080."
      );


    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="auth-page">


      {/* =====================================================
          LEFT PANEL
      ===================================================== */}

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


            {/* BADGE */}

            <div className="auth-small-badge">

              <Sparkles size={15} />

              Start Your Career Journey

            </div>


            {/* HEADING */}

            <h1>

              Turn your
              <span> skills</span>
              <br />
              into opportunities.

            </h1>


            {/* DESCRIPTION */}

            <p>

              Create your account and discover exactly
              what skills you need to reach your target
              career.

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
                    Smart Resume Analysis
                  </strong>

                  <small>
                    Let AI understand your professional profile
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
                    Personalized Skill Gaps
                  </strong>

                  <small>
                    Know exactly which skills you need
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
                    Career Growth Roadmap
                  </strong>

                  <small>
                    Follow a roadmap built around your goals
                  </small>

                </div>

              </div>


            </div>

          </div>


          {/* BOTTOM MESSAGE */}

          <div className="auth-info-bottom">

            <CheckCircle2 size={16} />

            <span>
              Your career journey starts here.
            </span>

          </div>


        </div>

      </section>


      {/* =====================================================
          RIGHT REGISTER PANEL
      ===================================================== */}

      <section className="auth-form-panel">


        {/* THEME TOGGLE */}

        <div className="auth-form-top">

          <ThemeToggle />

        </div>


        {/* FORM CONTAINER */}

        <div className="auth-form-container">

          <div className="auth-form-card">


            {/* HEADER */}

            <div className="auth-form-header">

              <div className="auth-title-icon">

                <Sparkles size={22} />

              </div>

              <h2>
                Create Account
              </h2>

              <p>
                Start building your personalized career roadmap.
              </p>

            </div>


            {/* =================================================
                REGISTER FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>


              {/* FULL NAME */}

              <div className="form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="input-wrapper">

                  <User size={18} />

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


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

                <label htmlFor="password">
                  Password
                </label>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />


                  {/* PASSWORD VISIBILITY */}

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

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="input-wrapper">

                  <Lock size={18} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />


                  {/* CONFIRM PASSWORD VISIBILITY */}

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >

                    {showConfirmPassword ? (

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


              {/* SUCCESS MESSAGE */}

              {success && (

                <div className="auth-success">

                  {success}

                </div>

              )}


              {/* TERMS */}

              <div className="remember-row">

                <label className="remember-label">

                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                  />

                  <span>
                    I agree to the Terms & Conditions
                  </span>

                </label>

              </div>


              {/* REGISTER BUTTON */}

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

                    Creating Account...
                  </>

                ) : (

                  <>
                    Create Account

                    <ArrowRight size={18} />

                  </>

                )}

              </button>


            </form>


            {/* LOGIN LINK */}

            <div className="auth-footer">

              <span>
                Already have an account?
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

export default Register;