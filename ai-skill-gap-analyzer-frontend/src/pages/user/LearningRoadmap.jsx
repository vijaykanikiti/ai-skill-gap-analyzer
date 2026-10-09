import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Map,
  Sparkles,
  CheckCircle2,
  Clock3,
  BookOpen,
  Code2,
  Cloud,
  Container,
  BrainCircuit,
  ArrowRight,
  PlayCircle,
  Target,
  AlertTriangle,
  Loader2
} from "lucide-react";

import "../../styles/roadmap.css";

function LearningRoadmap() {

  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD ROADMAP
  // =========================================================

  useEffect(() => {
    generateRoadmap();
  }, []);

  // =========================================================
  // GENERATE ROADMAP
  // =========================================================

  const generateRoadmap = async () => {

    try {

      setLoading(true);
      setError("");

      // -----------------------------------------------------
      // GET SKILL GAP ANALYSIS
      // -----------------------------------------------------

      const storedAnalysis =
        localStorage.getItem("analysis");

      if (!storedAnalysis) {

        setError(
          "No skill analysis found. Please complete the Skill Gap analysis first."
        );

        setLoading(false);
        return;
      }

      let analysisData;

      try {

        analysisData =
          JSON.parse(storedAnalysis);

      } catch (parseError) {

        console.error(
          "Analysis JSON error:",
          parseError
        );

        setError(
          "Invalid skill analysis data. Please complete the Skill Gap analysis again."
        );

        setLoading(false);
        return;
      }

      console.log(
        "===================================="
      );

      console.log(
        "Stored Analysis:",
        analysisData
      );

      console.log(
        "===================================="
      );

      // -----------------------------------------------------
      // RESUME ID
      // -----------------------------------------------------

      if (!analysisData.resumeId) {

        setError(
          "Resume ID is missing. Please complete the Resume Analysis again."
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------------------
      // USER ID
      // -----------------------------------------------------

      const storedUser =
        localStorage.getItem("user");

      let userId =
        analysisData.userId;

      if (!userId && storedUser) {

        try {

          const userData =
            JSON.parse(storedUser);

          userId =
            userData.id ||
            userData.userId;

        } catch (userError) {

          console.error(
            "User JSON error:",
            userError
          );
        }
      }

      if (!userId) {

        setError(
          "User ID is missing. Please login again."
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------------------
      // MISSING SKILLS
      // -----------------------------------------------------

      let missingSkills =
        analysisData.missingSkills || [];

      /*
       * Backend can return:
       *
       * [
       *   "Spring Boot",
       *   "Docker"
       * ]
       *
       * OR:
       *
       * [
       *   { skillName: "Spring Boot" },
       *   { skillName: "Docker" }
       * ]
       *
       * OR:
       *
       * "Spring Boot,Docker"
       */

      if (
        Array.isArray(
          missingSkills
        )
      ) {

        missingSkills =
          missingSkills
            .map(
              (skill) => {

                if (
                  typeof skill ===
                  "string"
                ) {
                  return skill;
                }

                if (
                  typeof skill ===
                    "object" &&
                  skill !== null
                ) {

                  return (
                    skill.skillName ||
                    skill.name ||
                    skill.skill ||
                    ""
                  );
                }

                return "";
              }
            )
            .filter(
              Boolean
            )
            .join(",");

      } else if (
        typeof missingSkills !==
        "string"
      ) {

        missingSkills =
          String(
            missingSkills || ""
          );
      }

      // -----------------------------------------------------
      // NO MISSING SKILLS
      // -----------------------------------------------------

      if (
        !missingSkills.trim()
      ) {

        setAnalysis(
          analysisData
        );

        setRoadmap([]);

        setError(
          "No missing skills were found. Your resume already matches the required skills."
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------------------
      // SAVE ANALYSIS
      // -----------------------------------------------------

      setAnalysis(
        analysisData
      );

      // -----------------------------------------------------
      // DEBUG
      // -----------------------------------------------------

      console.log(
        "Resume ID:",
        analysisData.resumeId
      );

      console.log(
        "User ID:",
        userId
      );

      console.log(
        "Missing Skills:",
        missingSkills
      );

      console.log(
        "Target Role:",
        analysisData.targetRole
      );

      console.log(
        "Location:",
        analysisData.location
      );

      // -----------------------------------------------------
      // BUILD REQUEST PARAMETERS
      // -----------------------------------------------------

      const params =
        new URLSearchParams();

      params.append(
        "resumeId",
        analysisData.resumeId
      );

      params.append(
        "userId",
        userId
      );

      params.append(
        "missingSkills",
        missingSkills
      );

      // -----------------------------------------------------
      // API URL
      // -----------------------------------------------------

      const apiUrl =
        `http://localhost:8080/api/roadmap/generate?${params.toString()}`;

      console.log(
        "Roadmap API URL:",
        apiUrl
      );

      // -----------------------------------------------------
      // CALL SPRING BOOT
      // -----------------------------------------------------

      const response =
        await fetch(
          apiUrl,
          {
            method: "POST"
          }
        );

      // -----------------------------------------------------
      // ERROR RESPONSE
      // -----------------------------------------------------

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Roadmap API Error:",
          errorText
        );

        throw new Error(
          errorText ||
          "Failed to generate learning roadmap."
        );
      }

      // -----------------------------------------------------
      // RESPONSE
      // -----------------------------------------------------

      const data =
        await response.json();

      console.log(
        "===================================="
      );

      console.log(
        "Learning Roadmap API Response:",
        data
      );

      console.log(
        "===================================="
      );

      // -----------------------------------------------------
      // HANDLE RESPONSE
      // -----------------------------------------------------

      let roadmapData = [];

      if (
        Array.isArray(data)
      ) {

        roadmapData =
          data;

      } else if (
        Array.isArray(
          data.roadmap
        )
      ) {

        roadmapData =
          data.roadmap;

      } else if (
        Array.isArray(
          data.data
        )
      ) {

        roadmapData =
          data.data;

      }

      // -----------------------------------------------------
      // SAVE ROADMAP
      // -----------------------------------------------------

      setRoadmap(
        roadmapData
      );

      localStorage.setItem(
        "roadmap",
        JSON.stringify(
          roadmapData
        )
      );

    } catch (err) {

      console.error(
        "Learning Roadmap Error:",
        err
      );

      setError(
        err.message ||
        "Unable to generate learning roadmap."
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // ICON
  // =========================================================

  const getIcon = (
    skillName
  ) => {

    const skill =
      String(
        skillName || ""
      ).toLowerCase();

    if (
      skill.includes("aws") ||
      skill.includes("cloud") ||
      skill.includes("azure")
    ) {

      return Cloud;
    }

    if (
      skill.includes("docker") ||
      skill.includes("container")
    ) {

      return Container;
    }

    if (
      skill.includes("react") ||
      skill.includes("javascript") ||
      skill.includes("frontend")
    ) {

      return Code2;
    }

    if (
      skill.includes("system") ||
      skill.includes("architecture") ||
      skill.includes("machine") ||
      skill.includes("ai") ||
      skill.includes("tensorflow")
    ) {

      return BrainCircuit;
    }

    return BookOpen;
  };

  // =========================================================
  // COLOR
  // =========================================================

  const getColor = (
    index
  ) => {

    const colors = [
      "primary",
      "warning",
      "info",
      "success"
    ];

    return colors[
      index %
      colors.length
    ];
  };

  // =========================================================
  // SKILL NAME
  // =========================================================

  const getSkillName = (
    item
  ) => {

    return (
      item.skillName ||
      item.skill ||
      item.title ||
      item.name ||
      "Skill"
    );
  };

  // =========================================================
  // DESCRIPTION
  // =========================================================

  const getDescription = (
    item
  ) => {

    if (
      item.description
    ) {

      return item.description;
    }

    if (
      item.subtitle
    ) {

      return item.subtitle;
    }

    if (
      item.projectSuggestion
    ) {

      return `Build a project: ${item.projectSuggestion}`;
    }

    return (
      `Improve your ${getSkillName(
        item
      )} skills to become job-ready.`
    );
  };

  // =========================================================
  // DURATION
  // =========================================================

  const getDuration = (
    item
  ) => {

    if (
      item.duration
    ) {

      return item.duration;
    }

    if (
      item.estimatedDays
    ) {

      return `${item.estimatedDays} days`;
    }

    return "2 weeks";
  };

  // =========================================================
  // TOPICS
  // =========================================================

  const getTopics = (
    item
  ) => {

    const rawTopics =
      item.topics ||
      item.subtopics ||
      item.skills ||
      [];

    // Array
    if (
      Array.isArray(
        rawTopics
      )
    ) {

      return rawTopics;
    }

    // String
    if (
      typeof rawTopics ===
      "string"
    ) {

      return rawTopics
        .split(",")
        .map(
          (topic) =>
            topic.trim()
        )
        .filter(
          Boolean
        );
    }

    // Object
    if (
      typeof rawTopics ===
        "object" &&
      rawTopics !== null
    ) {

      return Object.values(
        rawTopics
      );
    }

    return [];
  };

  // =========================================================
  // PROGRESS
  // =========================================================

  const getItemProgress = (
    item
  ) => {

    const progress =
      item.progressPercentage ??
      item.progress ??
      0;

    const numericProgress =
      Number(
        progress
      );

    if (
      Number.isNaN(
        numericProgress
      )
    ) {

      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        numericProgress
      )
    );
  };

  // =========================================================
  // OVERALL PROGRESS
  // =========================================================

  const getOverallProgress =
    () => {

      if (
        roadmap.length === 0
      ) {

        return 0;
      }

      const total =
        roadmap.reduce(
          (
            sum,
            item
          ) => {

            return (
              sum +
              getItemProgress(
                item
              )
            );
          },
          0
        );

      return Math.round(
        total /
        roadmap.length
      );
    };

  const overallProgress =
    getOverallProgress();

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="roadmap-page">

        <div className="roadmap-header">

          <div>

            <div className="roadmap-title">

              <Map size={25} />

              <h2>
                Learning Roadmap
              </h2>

            </div>

            <p>
              Generating your personalized
              learning roadmap...
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
            Creating Your Learning Roadmap
          </h3>

          <p>
            Analyzing your skill gaps and
            preparing your learning path...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="roadmap-page">

        <div className="roadmap-header">

          <div>

            <div className="roadmap-title">

              <Map size={25} />

              <h2>
                Learning Roadmap
              </h2>

            </div>

            <p>
              Your personalized learning path.
            </p>

          </div>

        </div>

        <div
          style={{
            padding: "40px",
            textAlign: "center"
          }}
        >

          <AlertTriangle
            size={45}
            style={{
              marginBottom:
                "15px"
            }}
          />

          <h3>
            Unable to Load Roadmap
          </h3>

          <p>
            {error}
          </p>

          <button
            className="roadmap-primary-btn"
            onClick={() =>
              navigate(
                "/skill-gap"
              )
            }
            style={{
              marginTop:
                "20px"
            }}
          >

            Go to Skill Gap

            <ArrowRight
              size={17}
            />

          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="roadmap-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="roadmap-header">

        <div>

          <div className="roadmap-title">

            <Map size={25} />

            <h2>
              Learning Roadmap
            </h2>

          </div>

          <p>
            Follow your personalized
            learning path to become
            job-ready.
          </p>

        </div>

        <div className="roadmap-ai-badge">

          <Sparkles
            size={16}
          />

          Personalized

        </div>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="roadmap-summary">

        <div className="roadmap-summary-main">

          <div className="summary-icon">

            <Target
              size={22}
            />

          </div>

          <div>

            <span>
              Learning Path For
            </span>

            <h3>
              {analysis?.targetRole ||
                "Target Role"}
            </h3>

            <p>
              Personalized roadmap based
              on your resume and skill gaps.
            </p>

            {analysis?.location && (

              <p>
                Location:{" "}
                <strong>
                  {analysis.location}
                </strong>
              </p>

            )}

          </div>

        </div>

        <div className="roadmap-summary-stats">

          <div>

            <strong>
              {roadmap.length}
            </strong>

            <span>
              Skills
            </span>

          </div>

          <div>

            <strong>
              {roadmap.length}
            </strong>

            <span>
              Stages
            </span>

          </div>

          <div>

            <strong>
              {overallProgress}%
            </strong>

            <span>
              Complete
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          OVERALL PROGRESS
      ===================================================== */}

      <div className="roadmap-progress-card">

        <div className="progress-heading">

          <div>

            <h3>
              Your Learning Progress
            </h3>

            <p>
              Track your progress as you
              complete each learning stage.
            </p>

          </div>

          <strong>
            {overallProgress}%
          </strong>

        </div>

        <div className="roadmap-progress-track">

          <div
            className="roadmap-progress-fill"
            style={{
              width:
                `${overallProgress}%`
            }}
          />

        </div>

        <div className="progress-footer">

          <span>
            Started
          </span>

          <span>
            Target: Job Ready
          </span>

        </div>

      </div>

      {/* =====================================================
          ROADMAP SECTION
      ===================================================== */}

      <section className="roadmap-section">

        <div className="section-title">

          <div>

            <h3>

              <BookOpen
                size={19}
              />

              Your Personalized Learning Path

            </h3>

            <p>
              Complete each stage to improve
              your missing skills.
            </p>

          </div>

        </div>

        {roadmap.length === 0 ? (

          <div
            style={{
              padding:
                "40px",
              textAlign:
                "center"
            }}
          >

            <BookOpen
              size={42}
              style={{
                marginBottom:
                  "15px"
              }}
            />

            <h3>
              No Learning Roadmap Available
            </h3>

            <p>
              No roadmap items were generated
              for this analysis.
            </p>

          </div>

        ) : (

          <div className="roadmap-list">

            {roadmap.map(
              (
                item,
                index
              ) => {

                const skillName =
                  getSkillName(
                    item
                  );

                const Icon =
                  getIcon(
                    skillName
                  );

                const color =
                  getColor(
                    index
                  );

                const progress =
                  getItemProgress(
                    item
                  );

                const status =
                  item.status ||
                  (
                    progress > 0
                      ? "In Progress"
                      : "Upcoming"
                  );

                const topics =
                  getTopics(
                    item
                  );

                return (

                  <div
                    className="roadmap-item"
                    key={
                      item.id ||
                      `${skillName}-${index}`
                    }
                  >

                    {/* TIMELINE */}

                    <div className="roadmap-timeline">

                      <div
                        className={`roadmap-number ${color}`}
                      >
                        {index + 1}
                      </div>

                      {index !==
                        roadmap.length -
                        1 && (

                        <div
                          className="timeline-line"
                        />

                      )}

                    </div>

                    {/* CARD */}

                    <div className="roadmap-card">

                      {/* CARD TOP */}

                      <div className="roadmap-card-top">

                        <div className="roadmap-card-title">

                          <div
                            className={`roadmap-icon ${color}`}
                          >

                            <Icon
                              size={21}
                            />

                          </div>

                          <div>

                            <div className="roadmap-name-row">

                              <h4>
                                {skillName}
                              </h4>

                              <span
                                className={`roadmap-status ${String(
                                  status
                                )
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                              >
                                {status}
                              </span>

                            </div>

                            <p>
                              {getDescription(
                                item
                              )}
                            </p>

                          </div>

                        </div>

                        <div className="roadmap-duration">

                          <Clock3
                            size={15}
                          />

                          {getDuration(
                            item
                          )}

                        </div>

                      </div>

                      {/* LEVEL */}

                      {item.level && (

                        <div
                          style={{
                            marginTop:
                              "14px"
                          }}
                        >

                          <strong>
                            Level:
                          </strong>{" "}

                          <span>
                            {item.level}
                          </span>

                        </div>

                      )}

                      {/* PROJECT */}

                      {item.projectSuggestion && (

                        <div
                          style={{
                            marginTop:
                              "14px",
                            padding:
                              "12px 14px",
                            borderRadius:
                              "10px",
                            background:
                              "var(--card-secondary, #f8fafc)"
                          }}
                        >

                          <strong>
                            Recommended Project:
                          </strong>{" "}

                          {item.projectSuggestion}

                        </div>

                      )}

                      {/* PROGRESS */}

                      <div className="roadmap-card-progress">

                        <div className="roadmap-progress-label">

                          <span>
                            Progress
                          </span>

                          <strong>
                            {progress}%
                          </strong>

                        </div>

                        <div className="roadmap-small-track">

                          <div
                            className={`roadmap-small-fill ${color}`}
                            style={{
                              width:
                                `${progress}%`
                            }}
                          />

                        </div>

                      </div>

                      {/* TOPICS */}

                      {topics.length >
                        0 && (

                        <div className="roadmap-topics">

                          <span>
                            Topics:
                          </span>

                          <div className="topic-list">

                            {topics.map(
                              (
                                topic,
                                topicIndex
                              ) => (

                                <span
                                  key={
                                    topicIndex
                                  }
                                >

                                  {typeof topic ===
                                  "string"

                                    ? topic

                                    : typeof topic ===
                                        "object" &&
                                      topic !==
                                        null

                                    ? (
                                      topic.name ||
                                      topic.title ||
                                      topic.topic ||
                                      "Topic"
                                    )

                                    : String(
                                        topic
                                      )}

                                </span>

                              )
                            )}

                          </div>

                        </div>

                      )}

                      {/* BOTTOM */}

                      <div className="roadmap-card-bottom">

                        <div className="roadmap-learning-info">

                          {progress >
                          0 ? (

                            <>
                              <CheckCircle2
                                size={15}
                              />

                              Continue your
                              learning
                            </>

                          ) : (

                            <>
                              <PlayCircle
                                size={15}
                              />

                              Ready to start
                            </>

                          )}

                        </div>

                        <button
                          className="start-learning-btn"
                          onClick={() =>
                            navigate(
                              "/recommendations"
                            )
                          }
                        >

                          {progress >
                          0

                            ? "Continue Learning"

                            : "Start Learning"}

                          <ArrowRight
                            size={16}
                          />

                        </button>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          AI RECOMMENDATION
      ===================================================== */}

      <div className="roadmap-ai-card">

        <div className="roadmap-ai-icon">

          <Sparkles
            size={23}
          />

        </div>

        <div className="roadmap-ai-content">

          <h3>
            Learning Recommendation
          </h3>

          <p>

            Your roadmap is generated from
            the missing skills identified
            during your resume and target-role
            analysis.

            {analysis?.missingSkills && (

              <>

                {" "}
                Your current priority skills
                include{" "}

                <strong>

                  {Array.isArray(
                    analysis.missingSkills
                  )

                    ? analysis.missingSkills
                        .slice(
                          0,
                          3
                        )
                        .map(
                          (
                            skill
                          ) =>
                            typeof skill ===
                            "string"

                              ? skill

                              : (
                                skill.skillName ||
                                skill.name ||
                                skill.skill ||
                                ""
                              )
                        )
                        .filter(
                          Boolean
                        )
                        .join(
                          ", "
                        )

                    : analysis.missingSkills}

                </strong>.

              </>

            )}

          </p>

          <div className="ai-roadmap-points">

            <span>

              <CheckCircle2
                size={15}
              />

              Practice with real projects

            </span>

            <span>

              <CheckCircle2
                size={15}
              />

              Complete one skill at a time

            </span>

            <span>

              <CheckCircle2
                size={15}
              />

              Track your progress regularly

            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM ACTIONS
      ===================================================== */}

      <div className="roadmap-bottom-actions">

        <button
          className="roadmap-secondary-btn"
          onClick={() =>
            navigate(
              "/skill-gap"
            )
          }
        >

          <ArrowRight
            size={17}
            style={{
              transform:
                "rotate(180deg)"
            }}
          />

          Back to Skill Gap

        </button>

        <button
          className="roadmap-primary-btn"
          onClick={() =>
            navigate(
              "/recommendations"
            )
          }
        >

          Explore Recommendations

          <ArrowRight
            size={17}
          />

        </button>

      </div>

    </div>
  );
}

export default LearningRoadmap;