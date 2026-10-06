import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Target,
  Search,
  Code2,
  Database,
  BrainCircuit,
  BarChart3,
  Cloud,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertTriangle
} from "lucide-react";

import "../../styles/target-role.css";


function TargetRole() {

  const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [jobRoles, setJobRoles] = useState([]);

  const [selectedRole, setSelectedRole] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD JOB ROLES
  // ==========================================

  useEffect(() => {

    fetchJobRoles();

  }, []);


  // ==========================================
  // GET JOB ROLES FROM BACKEND
  // ==========================================

  const fetchJobRoles = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        "http://localhost:8080/api/job-roles"
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          "Failed to load job roles."
        );

      }


      console.log(
        "Job Roles:",
        data
      );


      setJobRoles(data);


      // Check if previously selected role exists
      const storedRole =
        localStorage.getItem(
          "selectedJobRole"
        );


      if (storedRole) {

        try {

          const parsedRole =
            JSON.parse(storedRole);


          const existingRole =
            data.find(
              (role) =>
                role.id ===
                parsedRole.id
            );


          if (existingRole) {

            setSelectedRole(
              existingRole
            );

          } else if (data.length > 0) {

            setSelectedRole(
              data[0]
            );

          }

        } catch (err) {

          console.error(err);

          if (data.length > 0) {

            setSelectedRole(
              data[0]
            );

          }

        }

      } else if (data.length > 0) {

        setSelectedRole(
          data[0]
        );

      }


    } catch (err) {

      console.error(
        "Job role error:",
        err
      );


      setError(
        "Unable to load job roles. Make sure the Spring Boot backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // ICON FOR ROLE
  // ==========================================

  const getRoleIcon = (roleName) => {

    const name =
      roleName.toLowerCase();


    if (
      name.includes("data")
    ) {
      return BarChart3;
    }


    if (
      name.includes("ai") ||
      name.includes("ml") ||
      name.includes("machine")
    ) {
      return BrainCircuit;
    }


    if (
      name.includes("cloud")
    ) {
      return Cloud;
    }


    if (
      name.includes("backend")
    ) {
      return Database;
    }


    return Code2;

  };


  // ==========================================
  // ROLE SKILLS
  // ==========================================

  const getRoleSkills = (roleName) => {

    const name =
      roleName.toLowerCase();


    if (
      name.includes("full stack")
    ) {

      return [
        "React",
        "Java",
        "Spring Boot",
        "MySQL"
      ];

    }


    if (
      name.includes("java")
    ) {

      return [
        "Java",
        "Spring Boot",
        "REST API",
        "MySQL"
      ];

    }


    if (
      name.includes("frontend")
    ) {

      return [
        "React",
        "JavaScript",
        "HTML",
        "CSS"
      ];

    }


    if (
      name.includes("backend")
    ) {

      return [
        "Java",
        "Spring Boot",
        "SQL",
        "REST API"
      ];

    }


    if (
      name.includes("ai") ||
      name.includes("ml")
    ) {

      return [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "AI"
      ];

    }


    if (
      name.includes("data analyst")
    ) {

      return [
        "SQL",
        "Excel",
        "Python",
        "Power BI"
      ];

    }


    if (
      name.includes("cloud")
    ) {

      return [
        "AWS",
        "Docker",
        "Linux",
        "Cloud"
      ];

    }


    return [
      "Programming",
      "Problem Solving",
      "Communication"
    ];

  };


  // ==========================================
  // ROLE DESCRIPTION
  // ==========================================

  const getRoleDescription = (roleName) => {

    const name =
      roleName.toLowerCase();


    if (
      name.includes("full stack")
    ) {
      return "Build complete web applications using frontend and backend technologies.";
    }


    if (
      name.includes("java")
    ) {
      return "Develop enterprise applications using Java and backend technologies.";
    }


    if (
      name.includes("frontend")
    ) {
      return "Create responsive and interactive web applications.";
    }


    if (
      name.includes("backend")
    ) {
      return "Design APIs, databases and scalable backend systems.";
    }


    if (
      name.includes("ai") ||
      name.includes("ml")
    ) {
      return "Build intelligent applications using machine learning and AI.";
    }


    if (
      name.includes("data")
    ) {
      return "Analyze data and generate useful business insights.";
    }


    if (
      name.includes("cloud")
    ) {
      return "Build and manage cloud infrastructure and applications.";
    }


    return "Develop professional skills required for this career role.";

  };


  // ==========================================
  // FILTER ROLES
  // ==========================================

  const filteredRoles =
    jobRoles.filter((role) =>
      role.roleName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  // ==========================================
  // SELECT ROLE
  // ==========================================

  const handleSelectRole = (role) => {

    setSelectedRole(role);

  };


  // ==========================================
  // CONTINUE
  // ==========================================

  const handleContinue = () => {

    if (!selectedRole) {

      alert(
        "Please select a target job role."
      );

      return;

    }


    // Save selected role
    localStorage.setItem(
      "selectedJobRole",
      JSON.stringify({
        id: selectedRole.id,
        roleName: selectedRole.roleName
      })
    );


    console.log(
      "Selected Job Role:",
      selectedRole
    );


    navigate("/skill-gap");

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="target-role-page">

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
            Loading job roles...
          </h3>

          <p>
            Getting available career roles from the server.
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

      <div className="target-role-page">

        <div
          className="target-ai-card"
          style={{
            marginTop: "30px"
          }}
        >

          <AlertTriangle size={24} />

          <div>

            <h3>
              Unable to Load Job Roles
            </h3>

            <p>
              {error}
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="target-role-page">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="target-role-header">

        <div>

          <div className="target-title">

            <Target size={25} />

            <h2>
              Choose Your Target Job
            </h2>

          </div>


          <p>
            Select the career role you want to prepare for.
          </p>

        </div>


        <div className="target-status">

          <Sparkles size={16} />

          AI Career Matching

        </div>

      </div>


      {/* ======================================
          CURRENT TARGET
      ====================================== */}

      <div className="current-target-card">

        <div className="current-target-icon">

          <Target size={23} />

        </div>


        <div className="current-target-info">

          <span>
            Current Target Role
          </span>


          <h3>

            {selectedRole
              ? selectedRole.roleName
              : "Select a role"}

          </h3>

        </div>


        <CheckCircle2
          size={23}
          className="selected-check"
        />

      </div>


      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="target-search">

        <Search size={19} />


        <input
          type="text"
          placeholder="Search for a job role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ======================================
          JOB ROLES
      ====================================== */}

      <div className="role-section">

        <div className="section-heading">

          <div>

            <h3>
              Popular Career Roles
            </h3>

            <p>
              Choose the role that matches your career goal.
            </p>

          </div>


          <span>

            {filteredRoles.length} Roles

          </span>

        </div>


        <div className="role-grid">

          {filteredRoles.map((role) => {

            const Icon =
              getRoleIcon(
                role.roleName
              );


            const isSelected =
              selectedRole?.id ===
              role.id;


            return (

              <button
                key={role.id}
                className={`role-card ${
                  isSelected
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleSelectRole(
                    role
                  )
                }
              >

                <div className="role-card-top">

                  <div className="role-icon">

                    <Icon size={22} />

                  </div>


                  {isSelected && (

                    <CheckCircle2
                      size={20}
                      className="role-selected-icon"
                    />

                  )}

                </div>


                <h4>
                  {role.roleName}
                </h4>


                <p>

                  {getRoleDescription(
                    role.roleName
                  )}

                </p>


                <div className="role-skills">

                  {getRoleSkills(
                    role.roleName
                  ).map((skill) => (

                    <span key={skill}>
                      {skill}
                    </span>

                  ))}

                </div>

              </button>

            );

          })}

        </div>


        {filteredRoles.length === 0 && (

          <div
            style={{
              textAlign: "center",
              padding: "30px"
            }}
          >

            <p>
              No job roles found.
            </p>

          </div>

        )}

      </div>


      {/* ======================================
          CUSTOM ROLE
      ====================================== */}

      <div className="custom-role-card">

        <div className="custom-role-icon">

          <Briefcase size={21} />

        </div>


        <div className="custom-role-content">

          <h3>
            Can't find your target role?
          </h3>


          <p>

            You can enter a custom job role.
            Custom role analysis will be added
            in a later step.

          </p>


          <div className="custom-role-input">

            <input
              type="text"
              placeholder="Example: Full Stack Java Developer"
            />


            <button
              type="button"
              onClick={() =>
                alert(
                  "Custom job roles will be available in a later step."
                )
              }
            >
              Use Custom Role
            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          AI INFORMATION
      ====================================== */}

      <div className="target-ai-card">

        <div className="target-ai-icon">

          <Sparkles size={23} />

        </div>


        <div>

          <h3>
            What happens next?
          </h3>


          <p>

            The system will compare your resume skills
            with the requirements of{" "}

            <strong>

              {selectedRole
                ? selectedRole.roleName
                : "your selected role"}

            </strong>{" "}

            and identify the skills you need to improve.

          </p>

        </div>

      </div>


      {/* ======================================
          ACTION
      ====================================== */}

      <div className="target-actions">


        <button
          className="back-button"
          onClick={() =>
            navigate("/resume-analysis")
          }
        >

          Back to Resume

        </button>


        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedRole}
        >

          Analyze My Skill Gap

          <ArrowRight size={18} />

        </button>

      </div>


    </div>

  );

}


export default TargetRole;