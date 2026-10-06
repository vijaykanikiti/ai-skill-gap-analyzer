import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Code2,
  Cloud,
  Database,
  Container,
  BrainCircuit,
  Sparkles,
  Loader2
} from "lucide-react";

import "../../styles/skill-gap.css";


function SkillGap() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const [selectedRole, setSelectedRole] = useState(null);


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    loadAnalysis();

  }, []);


  // ==========================================
  // ANALYZE RESUME
  // ==========================================

  const loadAnalysis = async () => {

    try {

      setLoading(true);

      setError("");


      // Get uploaded resume
      const storedResume =
        localStorage.getItem("resume");


      // Get selected job role
      const storedJobRole =
        localStorage.getItem("selectedJobRole");


      if (!storedResume) {

        throw new Error(
          "Resume information not found. Please upload your resume first."
        );

      }


      if (!storedJobRole) {

        throw new Error(
          "Target job role not found. Please select a target job role."
        );

      }


      const resumeData =
        JSON.parse(storedResume);


      const jobRoleData =
        JSON.parse(storedJobRole);


      setSelectedRole(
        jobRoleData
      );


      // Resume ID
      const resumeId =
        resumeData.resumeId ||
        resumeData.id;


      // Job Role ID
      const jobRoleId =
        jobRoleData.id ||
        jobRoleData.jobRoleId;


      if (!resumeId) {

        throw new Error(
          "Resume ID is missing."
        );

      }


      if (!jobRoleId) {

        throw new Error(
          "Job role ID is missing."
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


      // ======================================
      // CALL SPRING BOOT
      // ======================================

      const response = await fetch(
        `http://localhost:8080/api/analysis/analyze/${resumeId}?jobRoleId=${jobRoleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
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
        "Backend Analysis:",
        data
      );


      setAnalysis(data);


      // Save analysis
      localStorage.setItem(
        "analysis",
        JSON.stringify(data)
      );


    } catch (err) {

      console.error(
        "Skill gap error:",
        err
      );


      setError(
        err.message ||
        "Failed to analyze your resume."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // GET ICON
  // ==========================================

  const getSkillIcon = (skillName) => {

    const name =
      skillName.toLowerCase();


    if (
      name.includes("aws") ||
      name.includes("cloud")
    ) {

      return Cloud;

    }


    if (
      name.includes("mysql") ||
      name.includes("sql") ||
      name.includes("database")
    ) {

      return Database;

    }


    if (
      name.includes("docker") ||
      name.includes("container")
    ) {

      return Container;

    }


    if (
      name.includes("system") ||
      name.includes("machine") ||
      name.includes("ai")
    ) {

      return BrainCircuit;

    }


    return Code2;

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="skill-gap-page">

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
            Analyzing your skill gap...
          </h3>

          <p>
            Comparing your resume with the selected career role.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="skill-gap-page">

        <div
          className="skill-ai-card"
          style={{
            marginTop: "30px"
          }}
        >

          <div className="skill-ai-icon">

            <AlertTriangle size={24} />

          </div>


          <div className="skill-ai-content">

            <h3>
              Skill Gap Analysis Failed
            </h3>

            <p>
              {error}
            </p>


            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap"
              }}
            >

              <button
                className="secondary-gap-button"
                onClick={() =>
                  navigate("/resume")
                }
              >
                Upload Resume
              </button>


              <button
                className="primary-gap-button"
                onClick={() =>
                  navigate("/target-role")
                }
              >
                Select Target Job
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // BACKEND DATA
  // ==========================================

  const detectedSkills =
    analysis?.detectedSkills || [];


  const matchedSkills =
    analysis?.matchedSkills || [];


  const missingSkills =
    analysis?.missingSkills || [];


  const requiredSkills =
    analysis?.requiredSkills || [];


  const matchPercentage =
    analysis?.matchPercentage ?? 0;


  // ==========================================
  // STRONG SKILLS
  // ==========================================

  const strongSkills =
    matchedSkills.map((skill) => ({

      name: skill,

      level: 100,

      icon: getSkillIcon(skill)

    }));


  // ==========================================
  // SKILL GAPS
  // ==========================================

  const skillGaps =
    missingSkills.map((skill) => ({

      name: skill,

      current: detectedSkills.some(
        (detected) =>
          detected.toLowerCase() ===
          skill.toLowerCase()
      )
        ? 60
        : 0,

      required: 100,

      gap: 100,

      priority: "High",

      icon: getSkillIcon(skill)

    }));


  // ==========================================
  // RECOMMENDATION ORDER
  // ==========================================

  const recommendedSkills =
    missingSkills.slice(0, 3);


  return (

    <div className="skill-gap-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="skill-gap-header">

        <div>

          <div className="skill-gap-title">

            <Target size={25} />

            <h2>
              Skill Gap Analysis
            </h2>

          </div>


          <p>
            Compare your current skills with your target career requirements.
          </p>

        </div>


        <div className="skill-gap-ai-status">

          <Sparkles size={16} />

          Skill Analysis

        </div>

      </div>


      {/* ======================================
          TARGET ROLE
      ====================================== */}

      <div className="target-role-summary">

        <div className="target-role-icon">

          <Target size={23} />

        </div>


        <div className="target-role-details">

          <span>
            Target Career
          </span>


          <h3>

            {analysis?.targetRole ||
              selectedRole?.roleName ||
              "Selected Job Role"}

          </h3>


          <p>

            Your resume skills are being compared
            with the requirements of this role.

          </p>

        </div>


        <div className="match-score">

          <div className="score-circle">

            <strong>
              {matchPercentage}%
            </strong>

          </div>


          <div>

            <span>
              Skill Match
            </span>

            <strong>

              {matchPercentage >= 80
                ? "Excellent Match"
                : matchPercentage >= 60
                ? "Good Progress"
                : matchPercentage >= 40
                ? "Needs Improvement"
                : "Needs Development"}

            </strong>

          </div>

        </div>

      </div>


      {/* ======================================
          OVERVIEW
      ====================================== */}

      <div className="gap-overview-grid">


        {/* STRONG SKILLS */}

        <div className="overview-card">

          <div className="overview-icon success">

            <CheckCircle2 size={21} />

          </div>


          <div>

            <span>
              Matched Skills
            </span>

            <strong>
              {matchedSkills.length}
            </strong>

          </div>

        </div>


        {/* SKILL GAPS */}

        <div className="overview-card">

          <div className="overview-icon warning">

            <AlertTriangle size={21} />

          </div>


          <div>

            <span>
              Skill Gaps
            </span>

            <strong>
              {missingSkills.length}
            </strong>

          </div>

        </div>


        {/* OVERALL MATCH */}

        <div className="overview-card">

          <div className="overview-icon primary">

            <TrendingUp size={21} />

          </div>


          <div>

            <span>
              Overall Match
            </span>

            <strong>
              {matchPercentage}%
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================
          STRONG SKILLS
      ====================================== */}

      <section className="skill-section">

        <div className="section-heading">

          <div>

            <h3>

              <CheckCircle2 size={19} />

              Your Strong Skills

            </h3>


            <p>
              Skills from your resume that match the target role.
            </p>

          </div>

        </div>


        <div className="strong-skills-grid">


          {strongSkills.length === 0 ? (

            <p>
              No matching skills were detected.
            </p>

          ) : (

            strongSkills.map((skill) => {

              const Icon =
                skill.icon;


              return (

                <div
                  className="strong-skill-card"
                  key={skill.name}
                >

                  <div className="strong-skill-top">

                    <div className="skill-icon">

                      <Icon size={19} />

                    </div>


                    <CheckCircle2
                      size={18}
                      className="skill-check"
                    />

                  </div>


                  <h4>
                    {skill.name}
                  </h4>


                  <div className="skill-level">

                    <div className="skill-level-track">

                      <div
                        className="skill-level-fill"
                        style={{
                          width: `${skill.level}%`
                        }}
                      />

                    </div>


                    <span>
                      Matched
                    </span>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </section>


      {/* ======================================
          SKILL GAPS
      ====================================== */}

      <section className="skill-section">

        <div className="section-heading">

          <div>

            <h3>

              <AlertTriangle size={19} />

              Skills You Need to Improve

            </h3>


            <p>

              These skills are required for your
              selected role but were not detected
              in your resume.

            </p>

          </div>

        </div>


        <div className="gap-list">


          {skillGaps.length === 0 ? (

            <div className="gap-card">

              <div className="gap-main">

                <div className="gap-icon">

                  <CheckCircle2 size={20} />

                </div>


                <div className="gap-name">

                  <h4>
                    No major skill gaps detected
                  </h4>

                  <p>
                    Your resume contains the required skills
                    detected for this role.
                  </p>

                </div>

              </div>

            </div>

          ) : (

            skillGaps.map((skill) => {

              const Icon =
                skill.icon;


              return (

                <div
                  className="gap-card"
                  key={skill.name}
                >

                  <div className="gap-main">

                    <div className="gap-icon">

                      <Icon size={20} />

                    </div>


                    <div className="gap-name">

                      <div className="gap-title-row">

                        <h4>
                          {skill.name}
                        </h4>


                        <span className="priority high">

                          High

                        </span>

                      </div>


                      <div className="gap-bars">


                        <div className="gap-bar-row">

                          <span>
                            Current
                          </span>


                          <div className="gap-track">

                            <div
                              className="current-bar"
                              style={{
                                width: `${skill.current}%`
                              }}
                            />

                          </div>


                          <strong>
                            {skill.current}%
                          </strong>

                        </div>


                        <div className="gap-bar-row">

                          <span>
                            Required
                          </span>


                          <div className="gap-track">

                            <div
                              className="required-bar"
                              style={{
                                width: `${skill.required}%`
                              }}
                            />

                          </div>


                          <strong>
                            {skill.required}%
                          </strong>

                        </div>

                      </div>

                    </div>

                  </div>


                  <div className="gap-value">

                    <span>
                      Gap
                    </span>


                    <strong>
                      {skill.gap}%
                    </strong>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </section>


      {/* ======================================
          REQUIRED SKILLS
      ====================================== */}

      <section className="skill-section">

        <div className="section-heading">

          <div>

            <h3>

              <TrendingUp size={19} />

              Target Role Requirements

            </h3>


            <p>
              Skills required for your selected career role.
            </p>

          </div>

        </div>


        <div className="strong-skills-grid">

          {requiredSkills.map((skill) => {

            const isMatched =
              matchedSkills.some(
                (matched) =>
                  matched.toLowerCase() ===
                  skill.toLowerCase()
              );


            const Icon =
              getSkillIcon(skill);


            return (

              <div
                className="strong-skill-card"
                key={skill}
              >

                <div className="strong-skill-top">

                  <div className="skill-icon">

                    <Icon size={19} />

                  </div>


                  {isMatched ? (

                    <CheckCircle2
                      size={18}
                      className="skill-check"
                    />

                  ) : (

                    <AlertTriangle
                      size={18}
                    />

                  )}

                </div>


                <h4>
                  {skill}
                </h4>


                <div className="skill-level">

                  <div className="skill-level-track">

                    <div
                      className="skill-level-fill"
                      style={{
                        width:
                          isMatched
                            ? "100%"
                            : "30%"
                      }}
                    />

                  </div>


                  <span>

                    {isMatched
                      ? "Matched"
                      : "Missing"}

                  </span>

                </div>

              </div>

            );

          })}

        </div>

      </section>


      {/* ======================================
          CAREER RECOMMENDATION
      ====================================== */}

      <section className="skill-ai-card">

        <div className="skill-ai-icon">

          <Sparkles size={24} />

        </div>


        <div className="skill-ai-content">

          <h3>
            Career Recommendation
          </h3>


          {recommendedSkills.length > 0 ? (

            <>

              <p>

                Based on your current skill gap,
                focus on the following skills first:

                {" "}

                <strong>
                  {recommendedSkills.join(", ")}
                </strong>.

                These skills were identified as missing
                from your resume for the selected role.

              </p>


              <div className="recommended-order">

                {recommendedSkills.map(
                  (skill, index) => (

                    <React.Fragment key={skill}>

                      <span>

                        <b>
                          {index + 1}
                        </b>

                        {skill}

                      </span>


                      {index <
                        recommendedSkills.length - 1 && (

                        <ArrowRight size={15} />

                      )}

                    </React.Fragment>

                  )
                )}

              </div>

            </>

          ) : (

            <p>

              Your resume contains the required skills
              detected for this target role. Continue
              improving your existing skills and building
              relevant projects.

            </p>

          )}

        </div>

      </section>


      {/* ======================================
          ACTION
      ====================================== */}

      <div className="skill-gap-actions">


        <button
          className="secondary-gap-button"
          onClick={() =>
            navigate("/target-role")
          }
        >

          Change Target Job

        </button>


        <button
          className="primary-gap-button"
          onClick={() =>
            navigate("/roadmap")
          }
        >

          Build My Learning Roadmap

          <ArrowRight size={18} />

        </button>

      </div>


    </div>

  );

}


export default SkillGap;