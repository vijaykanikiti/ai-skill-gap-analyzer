import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Award,
  Code2,
  Target,
  Clock3,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Filter,
  AlertTriangle,
  Loader2
} from "lucide-react";

import "../../styles/recommendations.css";

function Recommendations() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD RECOMMENDATIONS
  // =========================================================

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      // Get analysis from localStorage
      const storedAnalysis =
        localStorage.getItem("analysis");

      if (!storedAnalysis) {
        setError(
          "No skill analysis found. Please complete the Skill Gap analysis first."
        );

        setLoading(false);
        return;
      }

      const analysisData =
        JSON.parse(storedAnalysis);

      if (!analysisData.analysisId) {
        setError(
          "Analysis ID is missing. Please complete the Skill Gap analysis again."
        );

        setLoading(false);
        return;
      }

      setAnalysis(analysisData);

      // =====================================================
      // CALL SPRING BOOT BACKEND
      // =====================================================

      const response = await fetch(
        `http://localhost:8080/api/analysis/recommendations/${analysisData.analysisId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to generate recommendations."
        );
      }

      const data =
        await response.json();

      console.log(
        "Recommendations API Response:",
        data
      );

      // =====================================================
      // HANDLE DIFFERENT RESPONSE FORMATS
      // =====================================================

      let recommendationData = [];

      if (Array.isArray(data)) {
        recommendationData = data;
      } else if (
        Array.isArray(data.recommendations)
      ) {
        recommendationData =
          data.recommendations;
      } else if (
        Array.isArray(data.data)
      ) {
        recommendationData =
          data.data;
      }

      setRecommendations(
        recommendationData
      );

      // Save for future pages
      localStorage.setItem(
        "recommendations",
        JSON.stringify(
          recommendationData
        )
      );

    } catch (err) {
      console.error(
        "Recommendations error:",
        err
      );

      setError(
        err.message ||
          "Unable to load recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ICON
  // =========================================================

  const getIcon = (type) => {
    const recommendationType =
      String(type || "").toLowerCase();

    if (
      recommendationType.includes(
        "certification"
      )
    ) {
      return Award;
    }

    if (
      recommendationType.includes(
        "project"
      )
    ) {
      return Code2;
    }

    return BookOpen;
  };

  // =========================================================
  // COLOR
  // =========================================================

  const getColor = (type, index) => {
    const recommendationType =
      String(type || "").toLowerCase();

    if (
      recommendationType.includes(
        "certification"
      )
    ) {
      return "warning";
    }

    if (
      recommendationType.includes(
        "project"
      )
    ) {
      return "success";
    }

    const colors = [
      "primary",
      "info",
      "primary",
      "warning"
    ];

    return colors[index % colors.length];
  };

  // =========================================================
  // PROVIDER
  // =========================================================

  const getProvider = (item) => {
    const type =
      String(item.type || "").toLowerCase();

    if (type.includes("certification")) {
      return "Certification Path";
    }

    if (type.includes("project")) {
      return "Practical Project";
    }

    return "Recommended Learning";
  };

  // =========================================================
  // DURATION
  // =========================================================

  const getDuration = (item) => {
    if (item.duration) {
      return item.duration;
    }

    if (
      item.estimatedDays !== undefined &&
      item.estimatedDays !== null
    ) {
      const days =
        Number(item.estimatedDays);

      if (!Number.isNaN(days)) {
        if (days === 1) {
          return "1 day";
        }

        if (days < 7) {
          return `${days} days`;
        }

        const weeks =
          Math.ceil(days / 7);

        return weeks === 1
          ? "1 week"
          : `${weeks} weeks`;
      }
    }

    return "Flexible";
  };

  // =========================================================
  // PRIORITY
  // =========================================================

  const getPriority = (item, index) => {
    /*
     * Priority is generated for display based on
     * recommendation order.
     *
     * Backend does not currently provide a priority
     * field in the Recommendation entity.
     */

    if (item.priority) {
      return item.priority;
    }

    if (index < 3) {
      return "High";
    }

    if (index < 6) {
      return "Medium";
    }

    return "Low";
  };

  // =========================================================
  // SKILL NAME
  // =========================================================

  const getSkillName = (item) => {
    return (
      item.skillName ||
      item.skill ||
      "Skill"
    );
  };

  // =========================================================
  // FILTERS
  // =========================================================

  const filters = [
    "All",
    "Course",
    "Certification",
    "Project"
  ];

  const filteredRecommendations =
    activeFilter === "All"
      ? recommendations
      : recommendations.filter(
          (item) =>
            String(item.type || "")
              .toLowerCase() ===
            activeFilter.toLowerCase()
        );

  // =========================================================
  // LOADING PAGE
  // =========================================================

  if (loading) {
    return (
      <div className="recommendations-page">

        <div className="recommendations-header">

          <div>

            <div className="recommendations-title">

              <Sparkles size={25} />

              <h2>
                AI Recommendations
              </h2>

            </div>

            <p>
              Generating personalized
              recommendations based on your
              skill gaps...
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
            Creating Your Recommendations
          </h3>

          <p>
            Finding useful learning resources
            for your missing skills...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR PAGE
  // =========================================================

  if (error) {
    return (
      <div className="recommendations-page">

        <div className="recommendations-header">

          <div>

            <div className="recommendations-title">

              <Sparkles size={25} />

              <h2>
                AI Recommendations
              </h2>

            </div>

            <p>
              Personalized resources based
              on your skill gaps.
            </p>

          </div>

        </div>


        <div
          style={{
            padding: "50px",
            textAlign: "center"
          }}
        >

          <AlertTriangle
            size={48}
            style={{
              marginBottom: "15px"
            }}
          />

          <h3>
            Unable to Load Recommendations
          </h3>

          <p>
            {error}
          </p>


          <button
            className="recommendation-progress"
            onClick={() =>
              navigate("/skill-gap")
            }
            style={{
              marginTop: "20px"
            }}
          >
            Go to Skill Gap
            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="recommendations-page">

      {/* HEADER */}

      <div className="recommendations-header">

        <div>

          <div className="recommendations-title">

            <Sparkles size={25} />

            <h2>
              AI Recommendations
            </h2>

          </div>

          <p>
            Personalized learning resources
            based on your skill gaps and
            career goal.
          </p>

        </div>


        <div className="ai-recommendation-badge">

          <Sparkles size={15} />

          Personalized

        </div>

      </div>


      {/* AI INSIGHT */}

      <div className="recommendation-insight">

        <div className="insight-icon">

          <Lightbulb size={23} />

        </div>


        <div className="insight-content">

          <span>
            Learning Recommendation
          </span>


          <h3>
            Focus on your current skill gaps
          </h3>


          <p>

            These recommendations are
            generated from your resume analysis
            and selected target role.

            {analysis?.missingSkills?.length >
              0 && (
              <>
                {" "}
                Your identified gaps include{" "}
                <strong>
                  {analysis.missingSkills
                    .slice(0, 3)
                    .join(", ")}
                </strong>.
              </>
            )}

          </p>

        </div>


        <div className="insight-score">

          <strong>
            {analysis?.matchPercentage ??
              0}
            %
          </strong>

          <span>
            Current
            <br />
            Skill Match
          </span>

        </div>

      </div>


      {/* FILTER */}

      <div className="recommendations-toolbar">

        <div>

          <h3>
            Recommended Resources
          </h3>

          <p>
            {filteredRecommendations.length}{" "}
            resources selected for you
          </p>

        </div>


        <div className="filter-area">

          <Filter size={15} />

          {filters.map((filter) => (

            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>

          ))}

        </div>

      </div>


      {/* RECOMMENDATIONS GRID */}

      {filteredRecommendations.length ===
      0 ? (

        <div
          style={{
            padding: "50px",
            textAlign: "center"
          }}
        >

          <BookOpen
            size={45}
            style={{
              marginBottom: "15px"
            }}
          />

          <h3>
            No Recommendations Available
          </h3>

          <p>
            No recommendations were generated
            for this analysis.
          </p>

        </div>

      ) : (

        <div className="recommendations-grid">

          {filteredRecommendations.map(
            (item, index) => {

              const Icon =
                getIcon(item.type);

              const color =
                getColor(
                  item.type,
                  index
                );

              const priority =
                getPriority(
                  item,
                  index
                );

              const skill =
                getSkillName(item);

              return (

                <div
                  className="recommendation-card"
                  key={
                    item.id ||
                    `${item.title}-${index}`
                  }
                >

                  {/* CARD TOP */}

                  <div className="recommendation-card-top">

                    <div
                      className={`recommendation-icon ${color}`}
                    >
                      <Icon size={21} />
                    </div>


                    <span
                      className={`priority-badge ${priority.toLowerCase()}`}
                    >
                      {priority} Priority
                    </span>

                  </div>


                  {/* TYPE */}

                  <div className="recommendation-type">

                    {item.type ||
                      "Recommendation"}

                  </div>


                  {/* TITLE */}

                  <h3>
                    {item.title ||
                      "Recommended Resource"}
                  </h3>


                  {/* PROVIDER */}

                  <p className="recommendation-provider">

                    {item.provider ||
                      getProvider(item)}

                  </p>


                  {/* DESCRIPTION */}

                  <p className="recommendation-description">

                    {item.description ||
                      `Improve your ${skill} skills with this recommended learning resource.`}

                  </p>


                  {/* SKILL */}

                  <div className="recommended-skill">

                    <Target size={14} />

                    <span>

                      Skill Gap:

                      <strong>
                        {skill}
                      </strong>

                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="recommendation-details">

                    <span>

                      <BookOpen size={14} />

                      {item.level ||
                        "Recommended"}

                    </span>


                    <span>

                      <Clock3 size={14} />

                      {getDuration(item)}

                    </span>

                  </div>


                  {/* ACTION */}

                  <button
                    className="recommendation-action"
                    onClick={() =>
                      navigate(
                        "/roadmap"
                      )
                    }
                  >

                    View Recommendation

                    <ExternalLink
                      size={15}
                    />

                  </button>

                </div>

              );
            }
          )}

        </div>

      )}


      {/* PERSONALIZED PROJECT */}

      <div className="project-suggestion">

        <div className="project-suggestion-icon">

          <Code2 size={24} />

        </div>


        <div className="project-suggestion-content">

          <span>
            Personalized Project
          </span>


          <h3>
            Build a Practical Project
          </h3>


          <p>

            Build a practical project that
            uses the skills identified in your
            roadmap. This can help strengthen
            your technical skills and demonstrate
            your progress.

          </p>


          <div className="project-suggestion-tags">

            {analysis?.missingSkills
              ?.slice(0, 4)
              .map((skill, index) => (

                <span key={index}>

                  <CheckCircle2 size={13} />

                  {skill}

                </span>

              ))}

            {(!analysis?.missingSkills ||
              analysis.missingSkills
                .length === 0) && (
              <>
                <span>
                  <CheckCircle2 size={13} />
                  Practical Development
                </span>

                <span>
                  <CheckCircle2 size={13} />
                  Project Building
                </span>
              </>
            )}

          </div>

        </div>


        <button
          className="project-action"
          onClick={() =>
            navigate("/roadmap")
          }
        >

          Add to Roadmap

          <ArrowRight size={16} />

        </button>

      </div>


      {/* BOTTOM */}

      <div className="recommendations-bottom">

        <button
          className="recommendation-back"
          onClick={() =>
            navigate("/roadmap")
          }
        >

          <ArrowRight
            size={16}
            style={{
              transform:
                "rotate(180deg)"
            }}
          />

          Back to Roadmap

        </button>


        <button
          className="recommendation-progress"
          onClick={() =>
            navigate("/progress")
          }
        >

          Track My Progress

          <ArrowRight size={16} />

        </button>

      </div>

    </div>
  );
}

export default Recommendations;