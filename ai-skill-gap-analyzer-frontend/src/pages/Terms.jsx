import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UserCheck,
  Sparkles
} from "lucide-react";

import "../styles/legal.css";

function Terms() {
  return (
    <div className="legal-page">

      {/* Header */}
      <header className="legal-header">

        <Link to="/" className="legal-logo">
          <div className="legal-logo-icon">
            <Brain size={22} />
          </div>

          <span>
            Skill<span>Gap</span> AI
          </span>
        </Link>

        <Link to="/" className="back-home">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

      </header>


      {/* Main Content */}
      <main className="legal-container">

        <div className="legal-hero">

          <div className="legal-icon">
            <FileText size={28} />
          </div>

          <span>LEGAL INFORMATION</span>

          <h1>
            Terms & Conditions
          </h1>

          <p>
            Please read these terms carefully before using
            the SkillGap AI platform.
          </p>

          <small>
            Last updated: October 2026
          </small>

        </div>


        <div className="legal-content">

          <section>
            <h2>
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using SkillGap AI, you agree
              to comply with these Terms & Conditions. If you
              do not agree with any part of these terms,
              please do not use the platform.
            </p>
          </section>


          <section>
            <h2>
              2. About SkillGap AI
            </h2>

            <p>
              SkillGap AI is a career development platform
              designed to analyze resumes, identify potential
              skill gaps, provide career insights and generate
              personalized learning recommendations.
            </p>
          </section>


          <section>
            <h2>
              3. User Account
            </h2>

            <p>
              Users may be required to create an account to
              access certain features of the platform.
            </p>

            <ul>
              <li>
                You should provide accurate information during registration.
              </li>

              <li>
                You are responsible for maintaining access to your account.
              </li>

              <li>
                You should not intentionally provide false information.
              </li>

              <li>
                You are responsible for activity performed through your account.
              </li>
            </ul>
          </section>


          <section>
            <h2>
              4. Resume Upload and Analysis
            </h2>

            <p>
              SkillGap AI allows users to upload resumes for
              analysis. The platform may process information
              such as education, skills, experience and career
              preferences to generate analysis results.
            </p>

            <div className="legal-notice">

              <AlertTriangle size={20} />

              <p>
                AI-generated analysis is intended to provide
                guidance and should not be considered a guarantee
                of employment or career success.
              </p>

            </div>

          </section>


          <section>
            <h2>
              5. AI Recommendations
            </h2>

            <p>
              SkillGap AI may provide recommendations about
              skills, courses, certifications, projects and
              career opportunities.
            </p>

            <p>
              These recommendations are generated using
              available information and may not always be
              completely accurate or suitable for every user.
            </p>
          </section>


          <section>
            <h2>
              6. Prohibited Use
            </h2>

            <p>
              Users agree not to misuse the platform.
              Prohibited activities include:
            </p>

            <ul>
              <li>Using the platform for illegal activities.</li>

              <li>
                Attempting to damage or disrupt the platform.
              </li>

              <li>
                Uploading malicious files or harmful content.
              </li>

              <li>
                Attempting to access another user's account.
              </li>

              <li>
                Using the platform to distribute misleading or harmful content.
              </li>
            </ul>
          </section>


          <section>
            <h2>
              7. Intellectual Property
            </h2>

            <p>
              The SkillGap AI name, interface, design,
              software and original content are protected
              intellectual property of the platform owner,
              unless otherwise stated.
            </p>
          </section>


          <section>
            <h2>
              8. Third-Party Services
            </h2>

            <p>
              The platform may use third-party services or
              APIs to provide certain functionality. Such
              services may have their own terms and privacy
              policies.
            </p>
          </section>


          <section>
            <h2>
              9. Disclaimer
            </h2>

            <p>
              SkillGap AI provides career-related information
              and analysis for educational and informational
              purposes. The platform does not guarantee
              employment, interviews, salary increases or
              career outcomes.
            </p>
          </section>


          <section>
            <h2>
              10. Changes to These Terms
            </h2>

            <p>
              We may update these Terms & Conditions when
              necessary. Updated terms will be displayed on
              this page with a revised update date.
            </p>
          </section>


          <section>
            <h2>
              11. Contact
            </h2>

            <p>
              If you have questions regarding these Terms &
              Conditions, please contact the SkillGap AI
              support team.
            </p>
          </section>

        </div>

      </main>


      {/* Footer */}
      <footer className="legal-footer">

        <div className="legal-footer-brand">

          <Brain size={18} />

          <span>
            SkillGap AI
          </span>

        </div>

        <div className="legal-footer-links">

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/">
            Home
          </Link>

        </div>

        <p>
          © {new Date().getFullYear()} SkillGap AI.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Terms;