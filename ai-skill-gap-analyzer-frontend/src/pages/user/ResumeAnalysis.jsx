import React, { useEffect, useState } from "react";

import {
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Brain,
  FolderKanban,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Loader2,
  AlertTriangle
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/resume-analysis.css";


function ResumeAnalysis() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analysisData, setAnalysisData] = useState(null);

  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [selectedJobRole, setSelectedJobRole] = useState(null);


  // ==========================================
  // LOAD USER + RESUME + JOB ROLE
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    const storedResume =
      localStorage.getItem("resume");

    const storedJobRole =
      localStorage.getItem("selectedJobRole");


    if (!storedUser) {

      setError("User information not found. Please login again.");

      setLoading(false);

      return;
    }


    if (!storedResume) {

      setError("Resume information not found. Please upload your resume again.");

      setLoading(false);

      return;
    }


    if (!storedJobRole) {

      setError("Target job role not selected. Please select a target job role.");

      setLoading(false);

      return;
    }


    try {

      const parsedUser =
        JSON.parse(storedUser);

      const parsedResume =
        JSON.parse(storedResume);

      const parsedJobRole =
        JSON.parse(storedJobRole);


      setUser(parsedUser);

      setResume(parsedResume);

      setSelectedJobRole(parsedJobRole);


      analyzeResume(
        parsedResume,
        parsedJobRole
      );

    } catch (err) {

      console.error(err);

      setError(
        "Failed to load saved information."
      );

      setLoading(false);
    }

  }, []);


  // ==========================================
  // ANALYZE RESUME
  // ==========================================

  const analyzeResume = async (
    resumeData,
    jobRoleData
  ) => {

    try {

      setLoading(true);

      setError("");


      const resumeId =
        resumeData.resumeId ||
        resumeData.id;


      const jobRoleId =
        jobRoleData.jobRoleId ||
        jobRoleData.id;


      if (!resumeId) {

        throw new Error(
          "Resume ID not found."
        );
      }


      if (!jobRoleId) {

        throw new Error(
          "Job role ID not found."
        );
      }


      console.log(
        "Resume ID:",
        resumeId
      );

      console.log(
        "Job Role ID:",
        jobRoleId
      );


      const response = await fetch(
        `http://localhost:8080/api/analysis/analyze/${resumeId}?jobRoleId=${jobRoleId}`,
        {
          method: "POST"
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Resume analysis failed."
        );
      }


      console.log(
        "Analysis Result:",
        data
      );


      setAnalysisData(data);


      // Save analysis result
      localStorage.setItem(
        "analysis",
        JSON.stringify(data)
      );


    } catch (err) {

      console.error(
        "Analysis error:",
        err
      );

      setError(
        err.message ||
        "Unable to analyze resume."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="resume-analysis-page">

        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px"
          }}
        >

          <Loader2
            size={42}
            className="loading-spinner"
          />

          <h3>
            Analyzing your resume...
          </h3>

          <p>
            Extracting skills and calculating your job match.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {

    return (

      <div className="resume-analysis-page">

        <div
          className="analysis-card"
          style={{
            textAlign: "center",
            padding: "40px"
          }}
        >

          <AlertTriangle
            size={45}
            style={{
              marginBottom: "15px"
            }}
          />

          <h3>
            Analysis Failed
          </h3>

          <p>
            {error}
          </p>


          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "20px",
              flexWrap: "wrap"
            }}
          >

            <button
              className="secondary-action"
              onClick={() =>
                navigate("/resume")
              }
            >
              Upload Resume Again
            </button>


            <button
              className="primary-action"
              onClick={() =>
                navigate("/target-role")
              }
            >
              Select Target Role
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // DATA
  // ==========================================

  const detectedSkills =
    analysisData?.detectedSkills || [];


  const matchedSkills =
    analysisData?.matchedSkills || [];


  const missingSkills =
    analysisData?.missingSkills || [];


  const matchPercentage =
    analysisData?.matchPercentage ?? 0;


  // Create technical skill list
  const technicalSkills =
    detectedSkills.map((skill) => {

      const isMatched =
        matchedSkills.some(
          (matchedSkill) =>
            matchedSkill.toLowerCase() ===
            skill.toLowerCase()
        );


      return {
        name: skill,
        level: isMatched ? 100 : 60
      };

    });


  // Soft skills
  const softSkills = [
    "Problem Solving",
    "Communication",
    "Teamwork",
    "Time Management",
    "Adaptability"
  ];


  return (

    <div className="resume-analysis-page">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="resume-analysis-header">

        <div>

          <div className="analysis-title-row">

            <Sparkles size={24} />

            <h2>
              Resume Analysis
            </h2>

          </div>

          <p>
            Resume analysis and job-role skill matching.
          </p>

        </div>


        <div className="analysis-status">

          <CheckCircle size={17} />

          Analysis Complete

        </div>

      </div>


      {/* ======================================
          PROFILE CARD
      ====================================== */}

      <div className="resume-profile-card">


        <div className="profile-avatar">

          {user?.name
            ? user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
            : "U"}

        </div>


        <div className="profile-information">

          <h3>
            {user?.name || "User"}
          </h3>


          <div className="profile-details">

            <span>

              <Mail size={15} />

              {user?.email ||
                "Email not available"}

            </span>


            <span>

              <MapPin size={15} />

              {user?.location ||
                "Location not available"}

            </span>


            <span>

              <Briefcase size={15} />

              {selectedJobRole?.roleName ||
                analysisData?.targetRole ||
                "Target role"}

            </span>

          </div>

        </div>


        <div className="profile-score">

          <TrendingUp size={18} />

          <div>

            <strong>
              {matchPercentage}%
            </strong>

            <span>
              Job Skill Match
            </span>

          </div>

        </div>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <section className="analysis-card">

        <div className="card-heading">

          <div className="heading-icon">

            <Brain size={20} />

          </div>


          <div>

            <h3>
              Resume Summary
            </h3>

            <p>
              Resume analysis overview
            </p>

          </div>

        </div>


        <p className="summary-text">

          Your resume has been analyzed against the selected target
          job role. The system detected{" "}

          <strong>
            {detectedSkills.length}
          </strong>{" "}

          technical skills and matched{" "}

          <strong>
            {matchedSkills.length}
          </strong>{" "}

          of them with the requirements for{" "}

          <strong>
            {analysisData?.targetRole ||
              selectedJobRole?.roleName ||
              "your target role"}
          </strong>.

        </p>

      </section>


      {/* ======================================
          TWO COLUMN SECTION
      ====================================== */}

      <div className="analysis-grid">


        {/* TECHNICAL SKILLS */}

        <section className="analysis-card">

          <div className="card-heading">

            <div className="heading-icon">

              <Code2 size={20} />

            </div>


            <div>

              <h3>
                Technical Skills
              </h3>

              <p>
                Skills detected from your resume
              </p>

            </div>

          </div>


          <div className="skills-list">

            {technicalSkills.length === 0 ? (

              <p>
                No technical skills detected.
              </p>

            ) : (

              technicalSkills.map((skill) => (

                <div
                  className="skill-item"
                  key={skill.name}
                >

                  <div className="skill-info">

                    <span>
                      {skill.name}
                    </span>

                    <strong>
                      {skill.level}%
                    </strong>

                  </div>


                  <div className="skill-progress">

                    <div
                      className="skill-progress-fill"
                      style={{
                        width: `${skill.level}%`
                      }}
                    />

                  </div>

                </div>

              ))

            )}

          </div>

        </section>


        {/* SOFT SKILLS */}

        <section className="analysis-card">

          <div className="card-heading">

            <div className="heading-icon">

              <Brain size={20} />

            </div>


            <div>

              <h3>
                Soft Skills
              </h3>

              <p>
                General professional strengths
              </p>

            </div>

          </div>


          <div className="soft-skills">

            {softSkills.map((skill) => (

              <span
                className="soft-skill"
                key={skill}
              >

                <CheckCircle size={15} />

                {skill}

              </span>

            ))}

          </div>

        </section>

      </div>


      {/* ======================================
          REQUIRED SKILLS
      ====================================== */}

      <section className="analysis-card">

        <div className="card-heading">

          <div className="heading-icon">

            <TrendingUp size={20} />

          </div>


          <div>

            <h3>
              Skill Gap
            </h3>

            <p>
              Skills matched and missing for your target role
            </p>

          </div>

        </div>


        {/* MATCHED SKILLS */}

        <div style={{ marginBottom: "25px" }}>

          <h4>
            <CheckCircle
              size={17}
              style={{
                verticalAlign: "middle",
                marginRight: "6px"
              }}
            />

            Matched Skills
          </h4>


          <div className="soft-skills">

            {matchedSkills.length === 0 ? (

              <span>
                No matched skills found.
              </span>

            ) : (

              matchedSkills.map((skill) => (

                <span
                  className="soft-skill"
                  key={skill}
                >

                  <CheckCircle size={15} />

                  {skill}

                </span>

              ))

            )}

          </div>

        </div>


        {/* MISSING SKILLS */}

        <div>

          <h4>
            Skills to Improve
          </h4>


          <div className="soft-skills">

            {missingSkills.length === 0 ? (

              <span>
                Great! No missing skills detected.
              </span>

            ) : (

              missingSkills.map((skill) => (

                <span
                  className="soft-skill"
                  key={skill}
                >

                  <TrendingUp size={15} />

                  {skill}

                </span>

              ))

            )}

          </div>

        </div>

      </section>


      {/* ======================================
          EDUCATION
      ====================================== */}

      <section className="analysis-card">

        <div className="card-heading">

          <div className="heading-icon">

            <GraduationCap size={20} />

          </div>


          <div>

            <h3>
              Education
            </h3>

            <p>
              Education information
            </p>

          </div>

        </div>


        <div className="education-item">

          <div className="education-icon">

            <GraduationCap size={22} />

          </div>


          <div>

            <h4>
              Education information
            </h4>

            <p>
              Education details will be displayed here
              after resume parsing is implemented.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          EXPERIENCE
      ====================================== */}

      <section className="analysis-card">

        <div className="card-heading">

          <div className="heading-icon">

            <Briefcase size={20} />

          </div>


          <div>

            <h3>
              Experience
            </h3>

            <p>
              Professional experience
            </p>

          </div>

        </div>


        <div className="experience-item">

          <div className="experience-dot" />


          <div>

            <h4>
              Resume Experience
            </h4>

            <p>
              Experience details will be displayed here
              after resume section parsing is implemented.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          PROJECTS
      ====================================== */}

      <section className="analysis-card">

        <div className="card-heading">

          <div className="heading-icon">

            <FolderKanban size={20} />

          </div>


          <div>

            <h3>
              Projects
            </h3>

            <p>
              Projects identified from your resume
            </p>

          </div>

        </div>


        <div className="projects-grid">

          <div className="project-item">

            <h4>
              Resume Projects
            </h4>

            <p>
              Project details will be displayed here
              after project section parsing is implemented.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          AI INSIGHT
      ====================================== */}

      <section className="ai-insight-card">

        <div className="ai-insight-icon">

          <Sparkles size={24} />

        </div>


        <div>

          <h3>
            Career Insight
          </h3>


          {missingSkills.length > 0 ? (

            <p>

              Your current resume matches{" "}

              <strong>
                {matchPercentage}%
              </strong>{" "}

              of the required skills for{" "}

              <strong>
                {analysisData?.targetRole}
              </strong>.

              Focus on improving{" "}

              <strong>
                {missingSkills.join(", ")}
              </strong>{" "}

              to increase your skill match.

            </p>

          ) : (

            <p>

              Your resume contains the required skills
              detected for the selected target role.

            </p>

          )}

        </div>

      </section>


      {/* ======================================
          ACTION BUTTONS
      ====================================== */}

      <div className="analysis-actions">

        <button
          className="secondary-action"
          onClick={() =>
            navigate("/resume")
          }
        >
          Analyze Another Resume
        </button>


        <button
          className="primary-action"
          onClick={() =>
            navigate("/target-role")
          }
        >

          Continue to Target Job

          <ArrowRight size={18} />

        </button>

      </div>


    </div>

  );

}


export default ResumeAnalysis;