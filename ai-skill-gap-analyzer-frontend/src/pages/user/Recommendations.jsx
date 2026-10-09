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
  Loader2,
  Building2,
  MapPin,
  Globe2,
  Star
} from "lucide-react";

import "../../styles/recommendations.css";

function Recommendations() {

  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [recommendations, setRecommendations] =
    useState([]);

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // REAL JOBS
  // =========================================================

  const [jobListings, setJobListings] =
    useState([]);

  const [jobLoading, setJobLoading] =
    useState(true);

  const [jobError, setJobError] =
    useState("");

  // =========================================================
  // RECOMMENDED COMPANIES
  // =========================================================

  const [companies, setCompanies] =
    useState([]);

  const [companyLoading, setCompanyLoading] =
    useState(true);

  const [companyError, setCompanyError] =
    useState("");

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {

    loadRecommendations();

  }, []);

  // =========================================================
  // LOAD REAL JOB RECOMMENDATIONS
  // =========================================================

  const loadJobRecommendations = async (
    targetRole,
    preferredLocation
  ) => {

    try {

      setJobLoading(true);
      setJobError("");

      if (
        !targetRole ||
        !preferredLocation
      ) {

        setJobListings([]);

        setJobError(
          "Target role or preferred location is missing."
        );

        return;
      }

      console.log(
        "===================================="
      );

      console.log(
        "Loading Real Jobs"
      );

      console.log(
        "Target Role:",
        targetRole
      );

      console.log(
        "Location:",
        preferredLocation
      );

      console.log(
        "===================================="
      );

      const params =
        new URLSearchParams();

      params.append(
        "role",
        targetRole
      );

      params.append(
        "location",
        preferredLocation
      );

      const response =
        await fetch(
          `http://localhost:8080/api/jobs/recommendations?${params.toString()}`
        );

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Failed to fetch job listings."
        );
      }

      const data =
        await response.json();

      console.log(
        "Real Jobs API Response:",
        data
      );

      if (
        Array.isArray(data)
      ) {

        setJobListings(data);

      } else if (
        Array.isArray(data.jobs)
      ) {

        setJobListings(
          data.jobs
        );

      } else {

        setJobListings([]);
      }

    } catch (err) {

      console.error(
        "Job API Error:",
        err
      );

      setJobListings([]);

      setJobError(
        err.message ||
        "Unable to load real job opportunities."
      );

    } finally {

      setJobLoading(false);
    }
  };

  // =========================================================
  // LOAD RECOMMENDED COMPANIES
  // =========================================================

  const loadCompanyRecommendations = async (
    targetRole,
    preferredLocation
  ) => {

    try {

      setCompanyLoading(true);
      setCompanyError("");

      if (
        !targetRole ||
        !preferredLocation
      ) {

        setCompanies([]);

        setCompanyError(
          "Target role or preferred location is missing."
        );

        return;
      }

      console.log(
        "===================================="
      );

      console.log(
        "Loading Recommended Companies"
      );

      console.log(
        "Target Role:",
        targetRole
      );

      console.log(
        "Location:",
        preferredLocation
      );

      console.log(
        "===================================="
      );

      const params =
        new URLSearchParams();

      params.append(
        "role",
        targetRole
      );

      params.append(
        "location",
        preferredLocation
      );

      const response =
        await fetch(
          `http://localhost:8080/api/jobs/companies?${params.toString()}`
        );

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Failed to fetch recommended companies."
        );
      }

      const data =
        await response.json();

      console.log(
        "Recommended Companies API Response:",
        data
      );

      if (
        Array.isArray(data)
      ) {

        setCompanies(data);

      } else if (
        Array.isArray(data.companies)
      ) {

        setCompanies(
          data.companies
        );

      } else {

        setCompanies([]);

      }

    } catch (err) {

      console.error(
        "Company API Error:",
        err
      );

      setCompanies([]);

      setCompanyError(
        err.message ||
        "Unable to load recommended companies."
      );

    } finally {

      setCompanyLoading(false);

    }

  };

  // =========================================================
  // LOAD RECOMMENDATIONS
  // =========================================================

  const loadRecommendations = async () => {

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
          "Analysis parse error:",
          parseError
        );

        setError(
          "Invalid analysis data. Please complete the Skill Gap analysis again."
        );

        setLoading(false);
        return;
      }

      console.log(
        "===================================="
      );

      console.log(
        "Stored Skill Gap Analysis:",
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
          "Resume ID is missing. Please complete the Skill Gap analysis again."
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------------------
      // USER
      // -----------------------------------------------------

      let userId =
        analysisData.userId;

      if (!userId) {

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {

          try {

            const user =
              JSON.parse(
                storedUser
              );

            userId =
              user.id ||
              user.userId;

          } catch (userError) {

            console.error(
              "User parse error:",
              userError
            );

          }

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
       * Convert:
       *
       * ["Docker", "Spring Boot"]
       *
       * into:
       *
       * Docker,Spring Boot
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

      } else {

        missingSkills =
          String(
            missingSkills
          );
      }

      // -----------------------------------------------------
      // SAVE ANALYSIS
      // -----------------------------------------------------

      setAnalysis(
        analysisData
      );

      // -----------------------------------------------------
      // LOAD REAL JOBS
      // -----------------------------------------------------

      const targetRole =
        analysisData.targetRole;

      const preferredLocation =
        analysisData.location;

      await Promise.all([
        loadJobRecommendations(
          targetRole,
          preferredLocation
        ),
        loadCompanyRecommendations(
          targetRole,
          preferredLocation
        )
      ]);

      // -----------------------------------------------------
      // CHECK MISSING SKILLS
      // -----------------------------------------------------

      if (
        !missingSkills.trim()
      ) {

        setRecommendations([]);

        setError("");

        setLoading(false);
        return;
      }

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
      // REQUEST PARAMETERS
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
        `http://localhost:8080/api/recommendations/generate?${params.toString()}`;

      console.log(
        "Recommendations API URL:",
        apiUrl
      );

      // -----------------------------------------------------
      // CALL BACKEND
      // -----------------------------------------------------

      const response =
        await fetch(
          apiUrl,
          {
            method: "POST"
          }
        );

      // -----------------------------------------------------
      // ERROR
      // -----------------------------------------------------

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Recommendation API error:",
          errorText
        );

        throw new Error(
          errorText ||
          "Failed to generate recommendations."
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
        "Recommendations API Response:",
        data
      );

      console.log(
        "===================================="
      );

      // -----------------------------------------------------
      // HANDLE RESPONSE
      // -----------------------------------------------------

      let recommendationData =
        [];

      if (
        Array.isArray(data)
      ) {

        recommendationData =
          data;

      } else if (
        Array.isArray(
          data.recommendations
        )
      ) {

        recommendationData =
          data.recommendations;

      } else if (
        Array.isArray(
          data.data
        )
      ) {

        recommendationData =
          data.data;

      }

      // -----------------------------------------------------
      // SAVE
      // -----------------------------------------------------

      setRecommendations(
        recommendationData
      );

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

  const getIcon = (
    type
  ) => {

    const recommendationType =
      String(
        type || ""
      ).toLowerCase();

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

  const getColor = (
    type,
    index
  ) => {

    const recommendationType =
      String(
        type || ""
      ).toLowerCase();

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

    return colors[
      index %
      colors.length
    ];
  };

  // =========================================================
  // PROVIDER
  // =========================================================

  const getProvider = (
    item
  ) => {

    const type =
      String(
        item.type || ""
      ).toLowerCase();

    if (
      type.includes(
        "certification"
      )
    ) {

      return "Certification Path";
    }

    if (
      type.includes(
        "project"
      )
    ) {

      return "Practical Project";
    }

    return "Recommended Learning";
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
      item.estimatedDays !==
        undefined &&
      item.estimatedDays !==
        null
    ) {

      const days =
        Number(
          item.estimatedDays
        );

      if (
        Number.isNaN(days)
      ) {

        return "Flexible";
      }

      if (
        days === 1
      ) {

        return "1 day";
      }

      if (
        days < 7
      ) {

        return `${days} days`;
      }

      const weeks =
        Math.ceil(
          days / 7
        );

      return weeks === 1
        ? "1 week"
        : `${weeks} weeks`;
    }

    return "Flexible";
  };

  // =========================================================
  // PRIORITY
  // =========================================================

  const getPriority = (
    item,
    index
  ) => {

    if (
      item.priority
    ) {

      return item.priority;
    }

    if (
      index < 3
    ) {

      return "High";
    }

    if (
      index < 6
    ) {

      return "Medium";
    }

    return "Low";
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
            String(
              item.type || ""
            ).toLowerCase() ===
            activeFilter.toLowerCase()
        );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="recommendations-page">

        <div className="recommendations-header">

          <div>

            <div className="recommendations-title">

              <Sparkles
                size={25}
              />

              <h2>
                AI Recommendations
              </h2>

            </div>

            <p>
              Generating personalized
              recommendations based on
              your skill gaps...
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
            Finding useful learning
            resources for your missing
            skills...
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
      <div className="recommendations-page">

        <div className="recommendations-header">

          <div>

            <div className="recommendations-title">

              <Sparkles
                size={25}
              />

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
              marginBottom:
                "15px"
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
              size={16}
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
    <div className="recommendations-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="recommendations-header">

        <div>

          <div className="recommendations-title">

            <Sparkles
              size={25}
            />

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

          <Sparkles
            size={15}
          />

          Personalized

        </div>

      </div>

      {/* =====================================================
          AI INSIGHT
      ===================================================== */}

      <div className="recommendation-insight">

        <div className="insight-icon">

          <Lightbulb
            size={23}
          />

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
            generated from your resume
            analysis and selected target role.

            {analysis?.missingSkills &&
              analysis.missingSkills.length >
                0 && (

                <>
                  {" "}
                  Your identified gaps include{" "}

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
                            (skill) =>
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

        </div>

        <div className="insight-score">

          <strong>

            {analysis?.matchPercentage ??
              0}%

          </strong>

          <span>
            Current
            <br />
            Skill Match
          </span>

        </div>

      </div>

      {/* =====================================================
          FILTER
      ===================================================== */}

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

          <Filter
            size={15}
          />

          {filters.map(
            (filter) => (

              <button
                key={filter}
                className={
                  activeFilter ===
                  filter
                    ? "filter-btn active"
                    : "filter-btn"
                }
                onClick={() =>
                  setActiveFilter(
                    filter
                  )
                }
              >

                {filter}

              </button>

            )
          )}

        </div>

      </div>

      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      {filteredRecommendations.length ===
      0 ? (

        <div
          style={{
            padding:
              "50px",
            textAlign:
              "center"
          }}
        >

          <BookOpen
            size={45}
            style={{
              marginBottom:
                "15px"
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
            (
              item,
              index
            ) => {

              const Icon =
                getIcon(
                  item.type
                );

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
                getSkillName(
                  item
                );

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

                      <Icon
                        size={21}
                      />

                    </div>

                    <span
                      className={`priority-badge ${String(
                        priority
                      ).toLowerCase()}`}
                    >

                      {priority}
                      {" "}
                      Priority

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
                      getProvider(
                        item
                      )}

                  </p>

                  {/* DESCRIPTION */}

                  <p className="recommendation-description">

                    {item.description ||
                      `Improve your ${skill} skills with this recommended learning resource.`}

                  </p>

                  {/* SKILL */}

                  <div className="recommended-skill">

                    <Target
                      size={14}
                    />

                    <span>

                      Skill Gap:

                      <strong>
                        {" "}
                        {skill}
                      </strong>

                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="recommendation-details">

                    <span>

                      <BookOpen
                        size={14}
                      />

                      {item.level ||
                        "Recommended"}

                    </span>

                    <span>

                      <Clock3
                        size={14}
                      />

                      {getDuration(
                        item
                      )}

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

                    View Roadmap

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

      {/* =====================================================
          RECOMMENDED COMPANIES
      ===================================================== */}

      <div className="real-jobs-section recommended-companies-section">

        <div className="real-jobs-header">

          <div>

            <div className="real-jobs-title">

              <Building2 size={23} />

              <h3>
                Recommended Companies
              </h3>

            </div>

            <p>
              Real companies recommended for your selected
              role and preferred location.
            </p>

          </div>

          <div className="real-jobs-summary">

            <div>

              <span>Role</span>

              <strong>
                {analysis?.targetRole ||
                  "Selected Role"}
              </strong>

            </div>

            <div>

              <span>Location</span>

              <strong>
                {analysis?.location ||
                  "Selected Location"}
              </strong>

            </div>

          </div>

        </div>

        {/* COMPANY LOADING */}

        {companyLoading && (

          <div className="jobs-loading">

            <Loader2
              size={35}
              className="loading-spinner"
            />

            <h4>
              Finding recommended companies...
            </h4>

            <p>
              Searching real companies in your preferred
              location for your selected career role.
            </p>

          </div>

        )}

        {/* COMPANY ERROR */}

        {!companyLoading &&
          companyError && (

            <div className="jobs-error">

              <AlertTriangle
                size={30}
              />

              <div>

                <h4>
                  Unable to Load Companies
                </h4>

                <p>
                  {companyError}
                </p>

              </div>

            </div>

          )}

        {/* NO COMPANIES */}

        {!companyLoading &&
          !companyError &&
          companies.length === 0 && (

            <div className="no-jobs">

              <Building2
                size={35}
              />

              <h4>
                No Companies Found
              </h4>

              <p>
                No companies were found for this role
                and location. Try another preferred location.
              </p>

            </div>

          )}

        {/* COMPANY CARDS */}

        {!companyLoading &&
          !companyError &&
          companies.length > 0 && (

            <div className="real-jobs-grid">

              {companies.map(
                (company, index) => (

                  <div
                    className="real-job-card company-card"
                    key={
                      company.placeId ||
                      company.company ||
                      `${company.location}-${index}`
                    }
                  >

                    {/* CARD TOP */}

                    <div className="real-job-card-top">

                      <div className="real-job-icon">

                        <Building2
                          size={22}
                        />

                      </div>

                      <span className="real-job-badge">
                        Real Company
                      </span>

                    </div>

                    {/* COMPANY NAME */}

                    <h4>
                      {company.company ||
                        "Company"}
                    </h4>

                    {/* LOCATION */}

                    <div className="real-job-location">

                      <span>

                        <MapPin
                          size={15}
                        />

                        {company.location ||
                          analysis?.location ||
                          "Location not specified"}

                      </span>

                    </div>

                    {/* RATING */}

                    {(company.rating !== null &&
                      company.rating !== undefined) && (

                      <div className="real-job-details">

                        <span>

                          <Star
                            size={14}
                          />

                          {Number(
                            company.rating
                          ).toFixed(1)}

                          {company.userRatingCount
                            ? ` (${Number(
                                company.userRatingCount
                              ).toLocaleString()} reviews)`
                            : ""}

                        </span>

                      </div>

                    )}

                    {/* STATUS */}

                    {company.businessStatus && (

                      <div className="real-job-category">

                        {String(
                          company.businessStatus
                        )
                          .replaceAll(
                            "_",
                            " "
                          )}

                      </div>

                    )}

                    {/* ROLE */}

                    <p className="real-job-description">

                      Recommended for{" "}

                      <strong>
                        {company.targetRole ||
                          analysis?.targetRole ||
                          "your selected role"}
                      </strong>

                      {" "}in{" "}

                      <strong>
                        {company.targetLocation ||
                          analysis?.location ||
                          "your selected location"}
                      </strong>.

                    </p>

                    {/* SOURCE */}

                    <div className="real-job-company">

                      <span>

                        <Globe2
                          size={14}
                        />

                        {company.source ||
                          "Google Places"}

                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div
                      className="company-card-actions"
                    >

                      {company.website && (

                        <button
                          type="button"
                          className="real-job-apply"
                          onClick={() =>
                            window.open(
                              company.website,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >

                          Visit Website

                          <ExternalLink
                            size={15}
                          />

                        </button>

                      )}

                      {company.googleMapsUrl && (

                        <button
                          type="button"
                          className="company-map-button"
                          onClick={() =>
                            window.open(
                              company.googleMapsUrl,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >

                          View on Maps

                          <MapPin
                            size={15}
                          />

                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

      {/* =====================================================
          PERSONALIZED PROJECT
      ===================================================== */}

      <div className="project-suggestion">

        <div className="project-suggestion-icon">

          <Code2
            size={24}
          />

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
            learning roadmap. This can help
            strengthen your technical skills
            and demonstrate your progress.
          </p>

          <div className="project-suggestion-tags">

            {Array.isArray(
              analysis?.missingSkills
            ) &&
              analysis.missingSkills
                .slice(
                  0,
                  4
                )
                .map(
                  (
                    skill,
                    index
                  ) => (

                    <span
                      key={index}
                    >

                      <CheckCircle2
                        size={13}
                      />

                      {typeof skill ===
                      "string"
                        ? skill
                        : (
                            skill.skillName ||
                            skill.name ||
                            skill.skill ||
                            "Skill"
                          )}

                    </span>

                  )
                )}

          </div>

        </div>

        <button
          className="project-action"
          onClick={() =>
            navigate(
              "/roadmap"
            )
          }
        >

          View Roadmap

          <ArrowRight
            size={16}
          />

        </button>

      </div>

      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div className="recommendations-bottom">

        <button
          className="recommendation-back"
          onClick={() =>
            navigate(
              "/roadmap"
            )
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
            navigate(
              "/progress"
            )
          }
        >

          Track My Progress

          <ArrowRight
            size={16}
          />

        </button>

      </div>

    </div>
  );
}

export default Recommendations;