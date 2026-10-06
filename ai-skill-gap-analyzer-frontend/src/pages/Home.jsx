import React from "react";
import { Link } from "react-router-dom";

import {
  Brain,
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  FileText,
  BarChart3,
  BookOpen,
  Award,
  Users,
  Zap,
  Code2,
  BriefcaseBusiness,
  Mail,
  ChevronRight,
} from "lucide-react";

import "../styles/home.css";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <Navbar />


      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={16} />
            AI-Powered Career Development
          </div>

          <h1>
            Discover Your
            <span> Skill Gaps.</span>
            <br />
            Build Your Future.
          </h1>

          <p className="hero-description">
            Upload your resume, choose your target career,
            and let AI analyze your skills to create a
            personalized roadmap for your professional growth.
          </p>


          {/* Buttons */}

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-btn"
            >
              Analyze My Skills
              <ArrowRight size={20} />
            </Link>

            <a
              href="#how-it-works"
              className="secondary-btn"
            >
              How It Works
              <ChevronRight size={18} />
            </a>

          </div>


          {/* Hero Points */}

          <div className="hero-points">

            <div>
              <CheckCircle size={18} />
              AI Resume Analysis
            </div>

            <div>
              <CheckCircle size={18} />
              Personalized Roadmap
            </div>

            <div>
              <CheckCircle size={18} />
              Career Recommendations
            </div>

          </div>

        </div>


        {/* =====================================================
            AI ANALYSIS CARD
        ===================================================== */}

        <div className="hero-visual">

          {/* Floating Icons */}

          <div className="floating-icon icon-one">
            <Brain size={22} />
          </div>

          <div className="floating-icon icon-two">
            <Target size={22} />
          </div>


          {/* Analysis Card */}

          <div className="analysis-card">

            {/* Header */}

            <div className="analysis-header">

              <div>

                <span className="analysis-title">
                  AI Skill Analysis
                </span>

                <small>
                  Career readiness report
                </small>

              </div>

              <span className="status">

                <span></span>

                Live

              </span>

            </div>


            {/* Score */}

            <div className="score-area">

              <div className="score-circle">

                <strong>
                  72%
                </strong>

                <small>
                  Job Match
                </small>

              </div>


              <div className="score-info">

                <h4>
                  Good Progress!
                </h4>

                <p>
                  You are getting closer to your
                  target role.
                </p>

              </div>

            </div>


            {/* Skills */}

            <div className="skills-list">


              {/* Java */}

              <div className="skill-item">

                <div className="skill-name">

                  <span>
                    Java
                  </span>

                  <strong>
                    92%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{ width: "92%" }}
                  ></div>

                </div>

              </div>


              {/* Spring Boot */}

              <div className="skill-item">

                <div className="skill-name">

                  <span>
                    Spring Boot
                  </span>

                  <strong>
                    78%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{ width: "78%" }}
                  ></div>

                </div>

              </div>


              {/* React */}

              <div className="skill-item">

                <div className="skill-name">

                  <span>
                    React
                  </span>

                  <strong>
                    64%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{ width: "64%" }}
                  ></div>

                </div>

              </div>


              {/* System Design */}

              <div className="skill-item">

                <div className="skill-name">

                  <span>
                    System Design
                  </span>

                  <strong className="low-score">
                    35%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill low"
                    style={{ width: "35%" }}
                  ></div>

                </div>

              </div>

            </div>


            {/* Recommendation */}

            <div className="recommendation">

              <Sparkles size={18} />

              <div>

                <strong>
                  AI Recommendation
                </strong>

                <p>
                  Focus on System Design to improve
                  your job match.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="stats-section">


        <div className="stat-card">

          <div className="stat-icon">
            <Users />
          </div>

          <div>

            <strong>
              10K+
            </strong>

            <span>
              Career Learners
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <FileText />
          </div>

          <div>

            <strong>
              25K+
            </strong>

            <span>
              Resumes Analyzed
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Target />
          </div>

          <div>

            <strong>
              50+
            </strong>

            <span>
              Career Roles
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Award />
          </div>

          <div>

            <strong>
              90%
            </strong>

            <span>
              Better Career Focus
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>
            POWERFUL FEATURES
          </span>

          <h2>

            Everything you need to

            <br />

            <strong>
              become career-ready
            </strong>

          </h2>

          <p>
            Turn your resume into a personalized
            career development plan with intelligent
            skill analysis.
          </p>

        </div>


        <div className="feature-grid">


          {/* Feature 1 */}

          <div className="feature-card">

            <div className="feature-icon">
              <Brain />
            </div>

            <h3>
              AI Resume Analysis
            </h3>

            <p>
              Analyze your resume and identify
              technical skills, soft skills,
              education and experience.
            </p>

            <Link to="/register">
              Explore Feature
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* Feature 2 */}

          <div className="feature-card">

            <div className="feature-icon">
              <Target />
            </div>

            <h3>
              Skill Gap Detection
            </h3>

            <p>
              Compare your existing skills with
              the requirements of your desired
              job role.
            </p>

            <Link to="/register">
              Explore Feature
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* Feature 3 */}

          <div className="feature-card">

            <div className="feature-icon">
              <TrendingUp />
            </div>

            <h3>
              Career Roadmap
            </h3>

            <p>
              Receive a personalized roadmap
              showing what you should learn next
              to reach your career goal.
            </p>

            <Link to="/register">
              Explore Feature
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* Feature 4 */}

          <div className="feature-card">

            <div className="feature-icon">
              <BookOpen />
            </div>

            <h3>
              Learning Recommendations
            </h3>

            <p>
              Get suggestions for courses,
              certifications, projects and
              important skills.
            </p>

            <Link to="/register">
              Explore Feature
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* Feature 5 */}

          <div className="feature-card">

            <div className="feature-icon">
              <BarChart3 />
            </div>

            <h3>
              Progress Tracking
            </h3>

            <p>
              Track your skill improvement and
              monitor your progress toward
              career readiness.
            </p>

            <Link to="/register">
              Explore Feature
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* Feature 6 */}

          <div className="feature-card">

            <div className="feature-icon">
              <Zap />
            </div>

            <h3>
              Career Insights
            </h3>

            <p>
              Understand your strengths,
              weaknesses and opportunities
              for your target career.
            </p>

            <Link to="/register">
              Explore Feature
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>

            Your journey to

            <strong>
              career readiness
            </strong>

          </h2>

          <p>
            Four simple steps to understand your
            skills and build a stronger career.
          </p>

        </div>


        <div className="steps">


          {/* Step 1 */}

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <FileText />
            </div>

            <h3>
              Upload Resume
            </h3>

            <p>
              Upload your existing resume and
              let the system understand your
              professional background.
            </p>

          </div>


          {/* Step 2 */}

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <Target />
            </div>

            <h3>
              Select Career
            </h3>

            <p>
              Choose the job role you want to
              prepare for and define your career
              goal.
            </p>

          </div>


          {/* Step 3 */}

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <Brain />
            </div>

            <h3>
              Analyze Skills
            </h3>

            <p>
              AI compares your current skills
              with the requirements of your
              target role.
            </p>

          </div>


          {/* Step 4 */}

          <div className="step">

            <div className="step-number">
              04
            </div>

            <div className="step-icon">
              <TrendingUp />
            </div>

            <h3>
              Follow Roadmap
            </h3>

            <p>
              Follow your personalized roadmap
              and continuously improve your
              career skills.
            </p>

          </div>

        </div>

      </section>


      
      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-main">


          {/* =================================================
              FOOTER BRAND
          ================================================= */}

          <div className="footer-brand">

            <div className="footer-logo">

              <div className="logo-icon">
                <Brain size={24} />
              </div>

              <span>
                Skill<span>Gap</span> AI
              </span>

            </div>

            <p>
              AI-powered career development platform
              helping you discover your skill gaps and
              build a better professional future.
            </p>


            {/* Social Links */}

            <div className="social-links">

              {/* GitHub */}

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <Code2 size={19} />
              </a>


              {/* LinkedIn */}

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <BriefcaseBusiness size={19} />
              </a>


              {/* Social */}

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                title="Twitter"
              >
                <Users size={19} />
              </a>


              {/* Email */}

              <a
                href="mailto:contact@skillgap.ai"
                aria-label="Email"
                title="Email"
              >
                <Mail size={19} />
              </a>

            </div>

          </div>


          {/* =================================================
              PRODUCT
          ================================================= */}

          <div className="footer-column">

            <h4>
              Product
            </h4>

            <Link to="/register">
              Resume Analysis
            </Link>

            <Link to="/register">
              Skill Gap Analysis
            </Link>

            <Link to="/register">
              Career Roadmap
            </Link>

            <Link to="/register">
              Progress Tracking
            </Link>

          </div>


          {/* =================================================
              COMPANY
          ================================================= */}

          <div className="footer-column">

            <h4>
              Company
            </h4>

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Create Account
            </Link>

          </div>


          {/* =================================================
              LEGAL
          ================================================= */}

          <div className="footer-column">

            <h4>
              Legal
            </h4>

            <Link to="/privacy-policy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms & Conditions
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

          </div>

        </div>


        {/* =================================================
            FOOTER BOTTOM
        ================================================= */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} SkillGap AI.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <Link to="/privacy-policy">
              Privacy Policy
            </Link>

            <span>
              •
            </span>

            <Link to="/terms">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;