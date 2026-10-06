import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Target,
  BookOpen,
  Clock3,
  CheckCircle2,
  Trophy,
  Flame,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Award,
  Loader2,
  AlertTriangle
} from "lucide-react";

import "../../styles/progress.css";

function Progress() {
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROGRESS
  // =====================================================

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");
      const storedAnalysis = localStorage.getItem("analysis");

      if (!storedUser) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      if (!storedAnalysis) {
        setError(
          "No skill analysis found. Please complete the Skill Gap analysis first."
        );
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const analysisData = JSON.parse(storedAnalysis);

      setAnalysis(analysisData);

      const userId = user.id;
      const analysisId = analysisData.analysisId;

      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      if (!analysisId) {
        setError("Analysis ID is missing.");
        setLoading(false);
        return;
      }

      // =================================================
      // GET PROGRESS FOR THIS ANALYSIS
      // =================================================

      const response = await fetch(
        `http://localhost:8080/api/progress/analysis/${analysisId}`
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to load progress."
        );
      }

      const data = await response.json();

      console.log("Progress API Response:", data);

      const progressArray = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];

      setProgressData(progressArray);

      localStorage.setItem(
        "progress",
        JSON.stringify(progressArray)
      );
    } catch (err) {
      console.error("Progress error:", err);

      setError(
        err.message || "Unable to load learning progress."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getProgress = (item) => {
    const value =
      item.progressPercentage ??
      item.progress ??
      0;

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Math.min(100, Math.max(0, number));
  };

  const getStatus = (item) => {
    const progress = getProgress(item);

    if (item.status) {
      return item.status;
    }

    if (progress === 100) {
      return "COMPLETED";
    }

    if (progress > 0) {
      return "IN_PROGRESS";
    }

    return "NOT_STARTED";
  };

  const getDisplayStatus = (item) => {
    const status = getStatus(item);

    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "Completed";

      case "IN_PROGRESS":
        return "In Progress";

      case "NOT_STARTED":
        return "Not Started";

      default:
        return status;
    }
  };

  const getSkillStatus = (item) => {
    const progress = getProgress(item);

    if (progress >= 80) {
      return "Strong";
    }

    if (progress >= 60) {
      return "Good";
    }

    if (progress > 0) {
      return "Improving";
    }

    return "Needs Focus";
  };

  // =====================================================
  // OVERALL PROGRESS
  // =====================================================

  const overallProgress =
    progressData.length > 0
      ? Math.round(
          progressData.reduce(
            (sum, item) => sum + getProgress(item),
            0
          ) / progressData.length
        )
      : 0;

  // =====================================================
  // COMPLETED SKILLS
  // =====================================================

  const completedSkills = progressData.filter(
    (item) => getProgress(item) === 100
  ).length;

  // =====================================================
  // IN-PROGRESS SKILLS
  // =====================================================

  const inProgressSkills = progressData.filter(
    (item) => {
      const progress = getProgress(item);
      return progress > 0 && progress < 100;
    }
  ).length;

  // =====================================================
  // LEARNING STREAK
  // =====================================================

  /*
   * Your current backend does not store daily learning
   * activity, so we don't invent a streak.
   */
  const learningStreak = "—";

  // =====================================================
  // WEEKLY ACTIVITY
  // =====================================================

  /*
   * Your current backend does not have a daily activity
   * table/API. Therefore the weekly chart is kept empty
   * instead of displaying fake hours.
   */

  const weeklyActivity = [
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 }
  ];

  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  const achievements = [
    {
      icon: Trophy,
      title: "First Analysis",
      description: "Completed your first resume analysis",
      unlocked: !!analysis
    },
    {
      icon: Flame,
      title: "Learning Streak",
      description: "Track continuous learning activity",
      unlocked: false
    },
    {
      icon: Award,
      title: "Skill Builder",
      description: "Improve 3 technical skills",
      unlocked: completedSkills >= 3
    },
    {
      icon: Target,
      title: "Job Ready",
      description: "Reach 90% job readiness",
      unlocked: overallProgress >= 90
    }
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="progress-page">

        <div className="progress-header">

          <div>
            <div className="progress-title">
              <TrendingUp size={25} />
              <h2>My Progress</h2>
            </div>

            <p>
              Loading your learning progress...
            </p>
          </div>

        </div>

        <div
          style={{
            minHeight: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <Loader2
            size={42}
            className="loading-spinner"
          />

          <h3>
            Loading Your Progress
          </h3>

          <p>
            Fetching your latest skill progress...
          </p>
        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="progress-page">

        <div className="progress-header">

          <div>
            <div className="progress-title">
              <TrendingUp size={25} />
              <h2>My Progress</h2>
            </div>

            <p>
              Track your learning journey and improve
              your job readiness.
            </p>
          </div>

        </div>

        <div
          style={{
            minHeight: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "15px",
            textAlign: "center"
          }}
        >

          <AlertTriangle size={45} />

          <h3>
            Unable to Load Progress
          </h3>

          <p>
            {error}
          </p>

          <button
            className="progress-primary-btn"
            onClick={() =>
              navigate("/skill-gap")
            }
          >
            Go to Skill Gap
            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="progress-page">

      {/* HEADER */}

      <div className="progress-header">

        <div>

          <div className="progress-title">
            <TrendingUp size={25} />
            <h2>My Progress</h2>
          </div>

          <p>
            Track your learning journey and improve
            your job readiness.
          </p>

        </div>

        <div className="progress-date">
          <CalendarDays size={15} />
          Current Progress
        </div>

      </div>


      {/* TOP STATS */}

      <div className="progress-stats">

        {/* JOB READINESS */}

        <div className="progress-stat-card">

          <div className="progress-stat-icon purple">
            <Target size={21} />
          </div>

          <div>

            <span>
              Job Readiness
            </span>

            <strong>
              {analysis?.matchPercentage ??
                overallProgress}
              %
            </strong>

            <small>
              Current skill match
            </small>

          </div>

        </div>


        {/* SKILLS IMPROVED */}

        <div className="progress-stat-card">

          <div className="progress-stat-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>

            <span>
              Skills Completed
            </span>

            <strong>
              {completedSkills}
            </strong>

            <small>
              {progressData.length} tracked skills
            </small>

          </div>

        </div>


        {/* LEARNING HOURS */}

        <div className="progress-stat-card">

          <div className="progress-stat-icon blue">
            <Clock3 size={21} />
          </div>

          <div>

            <span>
              Learning Hours
            </span>

            <strong>
              —
            </strong>

            <small>
              Activity tracking not enabled
            </small>

          </div>

        </div>


        {/* STREAK */}

        <div className="progress-stat-card">

          <div className="progress-stat-icon orange">
            <Flame size={21} />
          </div>

          <div>

            <span>
              Learning Streak
            </span>

            <strong>
              {learningStreak}
            </strong>

            <small>
              Activity tracking not enabled
            </small>

          </div>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="progress-main-grid">

        {/* SKILLS */}

        <div className="progress-panel skills-panel">

          <div className="progress-panel-header">

            <div>

              <h3>
                Skill Progress
              </h3>

              <p>
                Your current learning progress
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/skill-gap")
              }
            >
              View Skill Gap
              <ArrowRight size={14} />
            </button>

          </div>


          <div className="skill-progress-list">

            {progressData.length === 0 ? (

              <div
                style={{
                  padding: "25px",
                  textAlign: "center"
                }}
              >
                <BookOpen size={35} />

                <p>
                  No skill progress has been
                  recorded yet.
                </p>
              </div>

            ) : (

              progressData.map((skill) => {

                const progress =
                  getProgress(skill);

                return (
                  <div
                    className="skill-progress-item"
                    key={
                      skill.id ||
                      skill.skillName
                    }
                  >

                    <div className="skill-progress-top">

                      <span>
                        {skill.skillName ||
                          "Skill"}
                      </span>

                      <div>

                        <small>
                          {getSkillStatus(
                            skill
                          )}
                        </small>

                        <strong>
                          {progress}%
                        </strong>

                      </div>

                    </div>


                    <div className="skill-progress-track">

                      <div
                        className="skill-progress-fill"
                        style={{
                          width:
                            `${progress}%`
                        }}
                      />

                    </div>

                  </div>
                );
              })

            )}

          </div>

        </div>


        {/* WEEKLY ACTIVITY */}

        <div className="progress-panel activity-panel">

          <div className="progress-panel-header">

            <div>

              <h3>
                Weekly Activity
              </h3>

              <p>
                Learning hours this week
              </p>

            </div>

            <BookOpen size={20} />

          </div>


          <div className="activity-chart">

            {weeklyActivity.map((item) => {

              const height =
                item.hours === 0
                  ? "0%"
                  : `${Math.min(
                      (item.hours / 4) *
                        100,
                      100
                    )}%`;

              return (
                <div
                  className="activity-column"
                  key={item.day}
                >

                  <span>
                    {item.hours}h
                  </span>

                  <div className="activity-bar-container">

                    <div
                      className="activity-bar"
                      style={{
                        height
                      }}
                    />

                  </div>

                  <small>
                    {item.day}
                  </small>

                </div>
              );
            })}

          </div>


          <div className="activity-summary">

            <div>

              <strong>
                —
              </strong>

              <span>
                Total this week
              </span>

            </div>

            <div>

              <strong>
                —
              </strong>

              <span>
                Daily average
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ROADMAP PROGRESS */}

      <div className="roadmap-progress-panel">

        <div className="progress-panel-header">

          <div>

            <h3>
              Learning Roadmap Progress
            </h3>

            <p>
              Your progress through the
              personalized learning path.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/roadmap")
            }
          >
            View Roadmap
            <ArrowRight size={14} />
          </button>

        </div>


        <div className="roadmap-progress-grid">

          {progressData.length === 0 ? (

            <div
              style={{
                padding: "25px"
              }}
            >
              No roadmap progress recorded yet.
            </div>

          ) : (

            progressData.map((item, index) => {

              const progress =
                getProgress(item);

              return (
                <div
                  className="roadmap-progress-item"
                  key={
                    item.id ||
                    `${item.skillName}-${index}`
                  }
                >

                  <div
                    className={
                      index % 2 === 0
                        ? "roadmap-progress-circle"
                        : "roadmap-progress-circle warning"
                    }
                  >
                    <strong>
                      {progress}%
                    </strong>
                  </div>

                  <div>

                    <h4>
                      {item.skillName}
                    </h4>

                    <span>
                      {getDisplayStatus(
                        item
                      )}
                    </span>

                  </div>

                </div>
              );
            })

          )}

        </div>

      </div>


      {/* AI INSIGHT */}

      <div className="progress-ai-card">

        <div className="progress-ai-icon">
          <Sparkles size={23} />
        </div>

        <div className="progress-ai-content">

          <span>
            Learning Progress Insight
          </span>

          <h3>
            {overallProgress >= 70
              ? "You're making good progress."
              : "Focus on improving your current skill gaps."}
          </h3>

          <p>

            Your current overall learning
            progress is{" "}
            <strong>
              {overallProgress}%
            </strong>
            .

            {analysis?.missingSkills?.length >
              0 && (
              <>
                {" "}
                Continue working on{" "}
                <strong>
                  {analysis.missingSkills
                    .slice(0, 3)
                    .join(", ")}
                </strong>
                .
              </>
            )}

          </p>

        </div>


        <button
          onClick={() =>
            navigate("/recommendations")
          }
        >
          View Recommendations
          <ArrowRight size={15} />
        </button>

      </div>


      {/* ACHIEVEMENTS */}

      <div className="achievements-section">

        <div className="progress-section-title">

          <div>

            <h3>
              Achievements
            </h3>

            <p>
              Milestones from your learning journey
            </p>

          </div>

        </div>


        <div className="achievements-grid">

          {achievements.map(
            (achievement) => {

              const Icon =
                achievement.icon;

              return (
                <div
                  className={
                    achievement.unlocked
                      ? "achievement-card unlocked"
                      : "achievement-card locked"
                  }
                  key={achievement.title}
                >

                  <div className="achievement-icon">

                    <Icon size={21} />

                  </div>

                  <div>

                    <h4>
                      {achievement.title}
                    </h4>

                    <p>
                      {achievement.description}
                    </p>

                  </div>

                  {achievement.unlocked && (
                    <CheckCircle2
                      className="achievement-check"
                      size={16}
                    />
                  )}

                </div>
              );
            }
          )}

        </div>

      </div>


      {/* BOTTOM */}

      <div className="progress-bottom-actions">

        <button
          className="progress-secondary-btn"
          onClick={() =>
            navigate("/recommendations")
          }
        >
          Explore Recommendations
        </button>


        <button
          className="progress-primary-btn"
          onClick={() =>
            navigate("/roadmap")
          }
        >
          Continue Learning
          <ArrowRight size={16} />
        </button>

      </div>

    </div>
  );
}

export default Progress;