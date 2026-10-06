import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  Eye,
  Trash2
} from "lucide-react";

import "../styles/legal.css";

function PrivacyPolicy() {
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


      {/* Main */}
      <main className="legal-container">

        <div className="legal-hero">

          <div className="legal-icon">
            <ShieldCheck size={28} />
          </div>

          <span>YOUR PRIVACY MATTERS</span>

          <h1>
            Privacy Policy
          </h1>

          <p>
            Learn how SkillGap AI collects, uses and protects
            your information.
          </p>

          <small>
            Last updated: October 2026
          </small>

        </div>


        <div className="legal-content">

          <section>

            <h2>
              1. Introduction
            </h2>

            <p>
              SkillGap AI respects your privacy and is committed
              to protecting the information you provide while
              using our career development platform.
            </p>

          </section>


          <section>

            <h2>
              2. Information We Collect
            </h2>

            <p>
              Depending on the features you use, we may collect
              information such as:
            </p>

            <ul>

              <li>
                Name and account information.
              </li>

              <li>
                Email address.
              </li>

              <li>
                Resume information.
              </li>

              <li>
                Education and professional experience.
              </li>

              <li>
                Skills and career preferences.
              </li>

              <li>
                Career analysis and progress information.
              </li>

            </ul>

          </section>


          <section>

            <h2>
              3. Resume Information
            </h2>

            <p>
              When you upload a resume, information contained
              within the resume may be processed to identify
              skills, education, experience and other career
              information required for the analysis.
            </p>

            <div className="legal-notice">

              <Lock size={20} />

              <p>
                We recommend that you avoid uploading sensitive
                information that is not necessary for career
                analysis.
              </p>

            </div>

          </section>


          <section>

            <h2>
              4. How We Use Your Information
            </h2>

            <p>
              Information collected through the platform may
              be used to:
            </p>

            <ul>

              <li>
                Create and manage your account.
              </li>

              <li>
                Analyze your resume.
              </li>

              <li>
                Identify skill gaps.
              </li>

              <li>
                Generate career recommendations.
              </li>

              <li>
                Create personalized learning roadmaps.
              </li>

              <li>
                Track your career development progress.
              </li>

              <li>
                Improve the platform and its features.
              </li>

            </ul>

          </section>


          <section>

            <h2>
              5. Data Storage
            </h2>

            <p>
              Account and application information may be stored
              in the application's database. The platform uses
              appropriate technical measures intended to protect
              stored information.
            </p>

            <div className="privacy-feature-grid">

              <div>

                <Database />

                <h3>
                  Data Storage
                </h3>

                <p>
                  Application information may be stored
                  in the configured database.
                </p>

              </div>


              <div>

                <Lock />

                <h3>
                  Protection
                </h3>

                <p>
                  Reasonable technical measures are used
                  to protect application data.
                </p>

              </div>

            </div>

          </section>


          <section>

            <h2>
              6. Third-Party Services
            </h2>

            <p>
              Certain features may use third-party services,
              including AI services, authentication services,
              email services or other external APIs.
            </p>

            <p>
              When third-party services are used, information
              required for that service may be processed
              according to the applicable third-party terms
              and privacy policies.
            </p>

          </section>


          <section>

            <h2>
              7. Account Security
            </h2>

            <p>
              Users are responsible for keeping their account
              credentials confidential and should notify the
              platform administrator if they believe their
              account has been accessed without authorization.
            </p>

          </section>


          <section>

            <h2>
              8. Your Choices
            </h2>

            <p>
              You may review the information associated with
              your account and request correction of inaccurate
              information where applicable.
            </p>

            <div className="privacy-feature-grid">

              <div>

                <Eye />

                <h3>
                  Access
                </h3>

                <p>
                  Review information associated with your
                  account.
                </p>

              </div>


              <div>

                <UserCheck />

                <h3>
                  Correction
                </h3>

                <p>
                  Request correction of inaccurate information.
                </p>

              </div>

            </div>

          </section>


          <section>

            <h2>
              9. Data Deletion
            </h2>

            <p>
              Where applicable, users may request deletion of
              their account or associated information through
              the available application functionality or by
              contacting the platform administrator.
            </p>

            <div className="legal-notice">

              <Trash2 size={20} />

              <p>
                Deletion may be subject to technical,
                legal or operational requirements.
              </p>

            </div>

          </section>


          <section>

            <h2>
              10. Children's Privacy
            </h2>

            <p>
              The platform is intended for users who are able
              to legally use online career development services.
              We do not knowingly request unnecessary personal
              information from children.
            </p>

          </section>


          <section>

            <h2>
              11. Changes to This Privacy Policy
            </h2>

            <p>
              This Privacy Policy may be updated from time to
              time. Any changes will be reflected on this page
              along with the updated date.
            </p>

          </section>


          <section>

            <h2>
              12. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy
              or how your information is handled, please
              contact the SkillGap AI support team.
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

export default PrivacyPolicy;