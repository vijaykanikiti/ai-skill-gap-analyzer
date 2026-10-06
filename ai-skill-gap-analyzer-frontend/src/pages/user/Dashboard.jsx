import React, { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Target,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Code2,
  Sparkles,
  Loader2,
  FileText,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/dashboard.css";


function Dashboard() {

  const navigate = useNavigate();


  // ============================================================
  // STATE
  // ============================================================

  const [user, setUser] = useState(null);

  const [analysis, setAnalysis] = useState(null);

  const [progressData, setProgressData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  const loadDashboard = async () => {

    try {

      setLoading(true);

      setError("");


      // ========================================================
      // GET LOGGED USER
      // ========================================================

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        navigate("/login");

        return;
      }


      const loggedUser =
        JSON.parse(storedUser);


      setUser(loggedUser);


      if (!loggedUser.id) {

        throw new Error(
          "User ID not found. Please login again."
        );
      }


      // ========================================================
      // GET ANALYSIS HISTORY
      // ========================================================

      let latestAnalysis = null;


      try {

        const analysisResponse =
          await fetch(
            `http://localhost:8080/api/analysis/user/${loggedUser.id}`
          );


        if (analysisResponse.ok) {

          const analysisData =
            await analysisResponse.json();


          if (
            Array.isArray(analysisData) &&
            analysisData.length > 0
          ) {

            // Sort by ID so latest analysis is selected
            const sortedAnalyses =
              [...analysisData].sort(
                (a, b) =>
                  Number(b.id || b.analysisId || 0) -
                  Number(a.id || a.analysisId || 0)
              );


            latestAnalysis =
              sortedAnalyses[0];
          }
        }

      } catch (analysisError) {

        console.log(
          "Analysis history API unavailable:",
          analysisError
        );
      }


      // ========================================================
      // FALLBACK TO LOCAL STORAGE
      // ========================================================

      if (!latestAnalysis) {

        const storedAnalysis =
          localStorage.getItem("analysis");


        if (storedAnalysis) {

          try {

            latestAnalysis =
              JSON.parse(storedAnalysis);

          } catch (storageError) {

            console.log(
              "Invalid analysis in localStorage"
            );
          }
        }
      }


      // ========================================================
      // NORMALIZE ANALYSIS
      // ========================================================

      if (latestAnalysis) {

        const normalizedAnalysis = {
          ...latestAnalysis,

          analysisId:
            latestAnalysis.analysisId ||
            latestAnalysis.id,

          targetRole:
            latestAnalysis.targetRole ||
            latestAnalysis.jobRole ||
            loggedUser.targetRole ||
            "Target Role Not Selected",

          detectedSkills:
            Array.isArray(
              latestAnalysis.detectedSkills
            )
              ? latestAnalysis.detectedSkills
              : [],

          matchedSkills:
            Array.isArray(
              latestAnalysis.matchedSkills
            )
              ? latestAnalysis.matchedSkills
              : [],

          missingSkills:
            Array.isArray(
              latestAnalysis.missingSkills
            )
              ? latestAnalysis.missingSkills
              : [],

          requiredSkills:
            Array.isArray(
              latestAnalysis.requiredSkills
            )
              ? latestAnalysis.requiredSkills
              : [],

          matchPercentage:
            Number(
              latestAnalysis.matchPercentage || 0
            ),
        };


        setAnalysis(
          normalizedAnalysis
        );


        // Keep latest analysis in localStorage
        localStorage.setItem(
          "analysis",
          JSON.stringify(
            normalizedAnalysis
          )
        );


        // ======================================================
        // LOAD PROGRESS
        // ======================================================

        if (
          normalizedAnalysis.analysisId
        ) {

          try {

            const progressResponse =
              await fetch(
                `http://localhost:8080/api/progress/analysis/${normalizedAnalysis.analysisId}`
              );


            if (progressResponse.ok) {

              const progress =
                await progressResponse.json();


              console.log(
                "Dashboard Progress API:",
                progress
              );


              setProgressData(progress);
            }

          } catch (progressError) {

            console.log(
              "Progress API error:",
              progressError
            );
          }
        }
      }


    } catch (err) {

      console.error(
        "Dashboard loading error:",
        err
      );


      setError(
        err.message ||
        "Unable to load dashboard data."
      );


    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = () => {

    loadDashboard();
  };


  // ============================================================
  // CALCULATE VALUES
  // ============================================================

  const jobReadiness =
    analysis?.matchPercentage || 0;


  const detectedSkills =
    analysis?.detectedSkills || [];


  const matchedSkills =
    analysis?.matchedSkills || [];


  const missingSkills =
    analysis?.missingSkills || [];


  const requiredSkills =
    analysis?.requiredSkills || [];


  const totalSkills =
    detectedSkills.length;


  const totalSkillGaps =
    missingSkills.length;


  // ============================================================
  // LEARNING PROGRESS
  // ============================================================

  const learningProgress =
    progressData?.overallProgress !== undefined
      ? Number(progressData.overallProgress)
      : 0;


  const progressSkills =
    Array.isArray(progressData?.skills)
      ? progressData.skills
      : [];


  const completedSkills =
    progressSkills.filter(
      (skill) =>
        Number(
          skill.progressPercentage || 0
        ) >= 100
    ).length;


  const remainingSkills =
    Math.max(
      progressSkills.length -
        completedSkills,
      0
    );


  // ============================================================
  // CURRENT SKILLS FOR DISPLAY
  // ============================================================

  const displaySkills =
    useMemo(() => {

      if (
        detectedSkills.length === 0
      ) {

        return [];
      }


      return detectedSkills
        .slice(0, 6)
        .map((skill, index) => {

          let skillName = "";


          if (
            typeof skill === "string"
          ) {

            skillName = skill;

          } else if (
            skill?.name
          ) {

            skillName =
              skill.name;

          } else if (
            skill?.skillName
          ) {

            skillName =
              skill.skillName;

          } else {

            skillName =
              `Skill ${index + 1}`;
          }


          // Backend currently does not calculate
          // individual proficiency.
          // So use match status only.
          const isMatched =
            matchedSkills.some(
              (matched) => {

                const matchedName =
                  typeof matched === "string"
                    ? matched
                    : matched?.name ||
                      matched?.skillName ||
                      "";

                return (
                  matchedName.toLowerCase() ===
                  skillName.toLowerCase()
                );
              }
            );


          return {
            name: skillName,
            level: isMatched ? 100 : 50,
            icon: Code2,
          };

        });

    }, [
      detectedSkills,
      matchedSkills,
    ]);


  // ============================================================
  // SKILL GAPS FOR DISPLAY
  // ============================================================

  const displayGaps =
    useMemo(() => {

      return missingSkills
        .slice(0, 5)
        .map((skill, index) => {

          const name =
            typeof skill === "string"
              ? skill
              : skill?.name ||
                skill?.skillName ||
                `Skill ${index + 1}`;


          return {
            name,
            level: 0,
            priority:
              index < 2
                ? "High"
                : "Medium",
          };

        });

    }, [missingSkills]);


  // ============================================================
  // AI INSIGHT
  // ============================================================

  const aiInsight =
    missingSkills.length > 0
      ? `Focus on ${missingSkills
          .slice(0, 2)
          .map((skill) =>
            typeof skill === "string"
              ? skill
              : skill?.name ||
                skill?.skillName ||
                "missing skill"
          )
          .join(" and ")} next. Improving these skills can increase your readiness for ${analysis?.targetRole || "your target role"}.`
      : analysis
        ? `Great work! Your resume currently matches ${jobReadiness.toFixed(
            0
          )}% of the required skills for ${analysis.targetRole}. Continue improving your existing skills.`
        : "Upload and analyze your resume to receive personalized career recommendations.";


  // ============================================================
  // USER INITIAL
  // ============================================================

  const userInitial =
    user?.name
      ? user.name
          .charAt(0)
          .toUpperCase()
      : "U";


  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {

    return (

      <div className="dashboard-page">

        <div
          style={{
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >

          <Loader2
            size={40}
            className="loading-spinner"
          />

          <p>
            Loading your career dashboard...
          </p>

        </div>

      </div>
    );
  }


  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (

    <div className="dashboard-page">


      {/* ========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="dashboard-heading">

        <div>

          <span className="dashboard-label">
            CAREER OVERVIEW
          </span>

          <h1>
            Welcome, {user?.name || "User"}!
          </h1>

          <p>
            Track your skills, identify gaps,
            and become job-ready.
          </p>

        </div>


        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            className="upload-resume-btn"
            onClick={handleRefresh}
            style={{
              background: "transparent",
              color: "var(--primary-color)",
              border:
                "1px solid var(--border-color)",
            }}
          >

            <RefreshCw size={17} />

            Refresh

          </button>


          <button
            className="upload-resume-btn"
            onClick={() =>
              navigate("/resume")
            }
          >

            <Upload size={18} />

            Analyze Resume

          </button>

        </div>

      </div>


      {/* ========================================================
          ERROR
      ========================================================= */}

      {error && (

        <div
          style={{
            padding: "14px 18px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#dc2626",
          }}
        >

          {error}

        </div>

      )}


      {/* ========================================================
          NO ANALYSIS MESSAGE
      ========================================================= */}

      {!analysis && (

        <div
          className="dashboard-card"
          style={{
            marginBottom: "20px",
            textAlign: "center",
            padding: "40px",
          }}
        >

          <FileText
            size={45}
            style={{
              color: "var(--primary-color)",
              marginBottom: "12px",
            }}
          />

          <h2>
            No Resume Analysis Yet
          </h2>

          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "20px",
            }}
          >
            Upload your resume and select a
            target job role to start your
            personalized skill-gap analysis.
          </p>

          <button
            className="upload-resume-btn"
            onClick={() =>
              navigate("/resume")
            }
          >

            <Upload size={18} />

            Analyze My Resume

          </button>

        </div>

      )}


      {/* ========================================================
          STATS
      ========================================================= */}

      <div className="dashboard-stats">


        {/* JOB READINESS */}

        <div className="stat-card readiness-card">

          <div className="stat-card-top">

            <span>
              Job Readiness
            </span>

            <div className="stat-icon purple">

              <TrendingUp size={19} />

            </div>

          </div>


          <div className="readiness-content">

            <div className="readiness-circle">

              <strong>
                {jobReadiness.toFixed(0)}%
              </strong>

            </div>


            <div>

              <strong className="stat-main-value">

                {jobReadiness >= 80
                  ? "Excellent"
                  : jobReadiness >= 60
                    ? "Good Progress"
                    : jobReadiness > 0
                      ? "Needs Improvement"
                      : "Not Analyzed"}

              </strong>


              <p>

                {matchedSkills.length} matched skills

              </p>

            </div>

          </div>

        </div>


        {/* SKILLS IDENTIFIED */}

        <div className="stat-card">

          <div className="stat-card-top">

            <span>
              Skills Identified
            </span>

            <div className="stat-icon blue">

              <Code2 size={19} />

            </div>

          </div>


          <strong className="big-number">

            {totalSkills}

          </strong>


          <p className="stat-description">

            Technical & soft skills

          </p>

        </div>


        {/* SKILL GAPS */}

        <div className="stat-card">

          <div className="stat-card-top">

            <span>
              Skill Gaps
            </span>

            <div className="stat-icon orange">

              <AlertTriangle size={19} />

            </div>

          </div>


          <strong className="big-number">

            {totalSkillGaps}

          </strong>


          <p className="stat-description">

            Skills need improvement

          </p>

        </div>


        {/* LEARNING PROGRESS */}

        <div className="stat-card">

          <div className="stat-card-top">

            <span>
              Learning Progress
            </span>

            <div className="stat-icon green">

              <CheckCircle2 size={19} />

            </div>

          </div>


          <strong className="big-number">

            {learningProgress.toFixed(0)}%

          </strong>


          <p className="stat-description">

            Roadmap completed

          </p>

        </div>

      </div>


      {/* ========================================================
          MAIN GRID
      ========================================================= */}

      <div className="dashboard-grid">


        {/* ======================================================
            TARGET ROLE
        ======================================================= */}

        <section className="dashboard-card target-role-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                TARGET ROLE
              </span>

              <h2>

                {analysis?.targetRole ||
                  user?.targetRole ||
                  "Not Selected"}

              </h2>

            </div>


            <div className="target-icon">

              <Target size={21} />

            </div>

          </div>


          <p className="target-description">

            Your current skills are being
            compared with industry requirements
            for this role.

          </p>


          <div className="match-row">

            <div>

              <span>
                Skill Match
              </span>

              <strong>

                {jobReadiness.toFixed(0)}%

              </strong>

            </div>


            <div className="match-bar">

              <div
                style={{
                  width: `${Math.min(
                    Math.max(
                      jobReadiness,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          <button
            className="text-action"
            onClick={() =>
              navigate("/target-role")
            }
          >

            Change Target Role

            <ArrowRight size={16} />

          </button>

        </section>


        {/* ======================================================
            AI INSIGHT
        ======================================================= */}

        <section className="dashboard-card ai-card">

          <div className="ai-card-header">

            <div className="ai-icon">

              <Sparkles size={20} />

            </div>


            <div>

              <span>
                CAREER INSIGHT
              </span>

              <h3>
                Your next best step
              </h3>

            </div>

          </div>


          <p>
            {aiInsight}
          </p>


          <button
            className="ai-action"
            onClick={() =>
              navigate("/roadmap")
            }
          >

            View Personalized Roadmap

            <ArrowRight size={16} />

          </button>

        </section>


        {/* ======================================================
            CURRENT SKILLS
        ======================================================= */}

        <section className="dashboard-card skills-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                YOUR SKILLS
              </span>

              <h2>
                Current Skills
              </h2>

            </div>


            <button
              className="view-all-btn"
              onClick={() =>
                navigate("/skill-gap")
              }
            >
              View All
            </button>

          </div>


          {displaySkills.length === 0 ? (

            <div
              style={{
                padding: "30px 10px",
                textAlign: "center",
                color:
                  "var(--text-secondary)",
              }}
            >

              <Code2
                size={35}
                style={{
                  marginBottom: "10px",
                }}
              />

              <p>
                No skills detected yet.
              </p>

            </div>

          ) : (

            <div className="skills-list">

              {displaySkills.map(
                (skill) => {

                  const Icon =
                    skill.icon;


                  return (

                    <div
                      className="dashboard-skill"
                      key={skill.name}
                    >

                      <div className="skill-info">

                        <div className="skill-name">

                          <div className="skill-small-icon">

                            <Icon size={15} />

                          </div>

                          <span>
                            {skill.name}
                          </span>

                        </div>


                        <strong>

                          {skill.level === 100
                            ? "Matched"
                            : "Detected"}

                        </strong>

                      </div>


                      <div className="skill-progress">

                        <div
                          style={{
                            width:
                              `${skill.level}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </section>


        {/* ======================================================
            SKILL GAPS
        ======================================================= */}

        <section className="dashboard-card gaps-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                SKILL GAPS
              </span>

              <h2>
                Skills to Improve
              </h2>

            </div>


            <AlertTriangle
              size={20}
              className="warning-icon"
            />

          </div>


          {displayGaps.length === 0 ? (

            <div
              style={{
                padding: "30px 10px",
                textAlign: "center",
                color:
                  "var(--text-secondary)",
              }}
            >

              <CheckCircle2
                size={35}
                style={{
                  marginBottom: "10px",
                  color: "#22c55e",
                }}
              />

              <p>
                No skill gaps found.
              </p>

            </div>

          ) : (

            <div className="gap-list">

              {displayGaps.map(
                (gap) => (

                  <div
                    className="gap-item"
                    key={gap.name}
                  >

                    <div>

                      <strong>
                        {gap.name}
                      </strong>

                      <small>
                        Skill gap identified
                      </small>

                    </div>


                    <span
                      className={`priority ${
                        gap.priority === "High"
                          ? "high"
                          : "medium"
                      }`}
                    >

                      {gap.priority}

                    </span>

                  </div>

                )
              )}

            </div>

          )}


          <button
            className="text-action"
            onClick={() =>
              navigate("/skill-gap")
            }
          >

            View All Skill Gaps

            <ArrowRight size={16} />

          </button>

        </section>


        {/* ======================================================
            LEARNING PROGRESS
        ======================================================= */}

        <section className="dashboard-card learning-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                LEARNING ROADMAP
              </span>

              <h2>
                Your Progress
              </h2>

            </div>


            <BookOpen size={20} />

          </div>


          <div className="learning-progress">

            <div className="learning-circle">

              <strong>

                {learningProgress.toFixed(0)}%

              </strong>

            </div>


            <div>

              <strong>
                Roadmap Progress
              </strong>


              <p>

                {completedSkills} of{" "}
                {progressSkills.length}{" "}
                learning goals completed

              </p>


              <div className="learning-bar">

                <div
                  style={{
                    width:
                      `${Math.min(
                        Math.max(
                          learningProgress,
                          0
                        ),
                        100
                      )}%`,
                  }}
                />

              </div>

            </div>

          </div>


          <div className="learning-footer">

            <div>

              <CheckCircle2 size={16} />

              {completedSkills} Completed

            </div>


            <div>

              <Clock size={16} />

              {remainingSkills} Remaining

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


export default Dashboard;