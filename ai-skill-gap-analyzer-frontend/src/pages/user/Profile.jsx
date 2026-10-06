import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit3,
  Save,
  Lock,
  Target,
  Award,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import "../../styles/profile.css";

function Profile() {

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    location: "",
    targetRole: "",
    experience: "Fresher",
  });


  const [analysis, setAnalysis] = useState(null);


  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {

    loadProfile();

  }, []);


  const loadProfile = async () => {

    try {

      setLoading(true);

      setError("");


      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        navigate("/login");

        return;
      }


      const user =
        JSON.parse(storedUser);


      if (!user.id) {

        setError(
          "User information not found. Please login again."
        );

        return;
      }


      // ========================================================
      // GET PROFILE
      // ========================================================

      const response =
        await fetch(
          `http://localhost:8080/api/users/${user.id}`
        );


      if (!response.ok) {

        throw new Error(
          "Failed to load profile"
        );
      }


      const data =
        await response.json();


      setProfile({
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        targetRole: data.targetRole || "",
        experience: "Fresher",
      });


      // ========================================================
      // UPDATE LOCAL STORAGE
      // ========================================================

      const updatedUser = {
        ...user,
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        targetRole: data.targetRole,
        phone: data.phone,
        location: data.location,
      };


      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );


      // ========================================================
      // LOAD ANALYSIS
      // ========================================================

      const storedAnalysis =
        localStorage.getItem("analysis");


      if (storedAnalysis) {

        try {

          const analysisData =
            JSON.parse(storedAnalysis);

          setAnalysis(analysisData);

        } catch (e) {

          console.log(
            "Analysis data could not be loaded"
          );
        }
      }


    } catch (err) {

      console.error(
        "Profile loading error:",
        err
      );

      setError(
        err.message ||
        "Unable to load profile"
      );

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };


  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSave = async () => {

    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        navigate("/login");

        return;
      }


      const user =
        JSON.parse(storedUser);


      const response =
        await fetch(
          `http://localhost:8080/api/users/${user.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              name: profile.name,

              email: profile.email,

              phone: profile.phone,

              location: profile.location,

              targetRole:
                profile.targetRole,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update profile"
        );
      }


      // ========================================================
      // UPDATE STATE
      // ========================================================

      setProfile({
        ...profile,

        id: data.id,

        name: data.name || "",

        email: data.email || "",

        phone: data.phone || "",

        location: data.location || "",

        targetRole:
          data.targetRole || "",
      });


      // ========================================================
      // UPDATE LOCAL STORAGE
      // ========================================================

      const updatedUser = {
        ...user,

        id: data.id,

        name: data.name,

        email: data.email,

        role: data.role,

        targetRole:
          data.targetRole,

        phone: data.phone,

        location:
          data.location,
      };


      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );


      setEditing(false);

      setSuccess(
        "Profile updated successfully!"
      );


      setTimeout(() => {

        setSuccess("");

      }, 3000);


    } catch (err) {

      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);
    }
  };


  // ============================================================
  // CALCULATE JOB READINESS
  // ============================================================

  const jobReadiness =
    analysis &&
    analysis.matchPercentage !== undefined
      ? analysis.matchPercentage
      : 0;


  // ============================================================
  // CALCULATE SKILLS
  // ============================================================

  const skillsCount =
    analysis &&
    Array.isArray(analysis.detectedSkills)
      ? analysis.detectedSkills.length
      : 0;


  // ============================================================
  // AVATAR INITIALS
  // ============================================================

  const getInitials = (name) => {

    if (!name) {
      return "U";
    }

    const parts =
      name.trim().split(" ");

    if (parts.length === 1) {

      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <div className="profile-page">

        <div
          style={{
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >

          <Loader2
            size={40}
            className="loading-spinner"
          />

          <p>
            Loading your profile...
          </p>

        </div>

      </div>
    );
  }


  return (

    <div className="profile-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="profile-header">

        <div>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your personal information
            and career preferences.
          </p>

        </div>


        {!editing ? (

          <button
            className="profile-edit-btn"
            onClick={() =>
              setEditing(true)
            }
          >

            <Edit3 size={18} />

            Edit Profile

          </button>

        ) : (

          <button
            className="profile-save-btn"
            onClick={handleSave}
            disabled={saving}
          >

            {saving ? (

              <Loader2
                size={18}
                className="loading-spinner"
              />

            ) : (

              <Save size={18} />

            )}

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        )}

      </div>


      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#ecfdf5",
            color: "#047857",
          }}
        >

          <CheckCircle size={18} />

          {success}

        </div>

      )}


      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#dc2626",
          }}
        >

          <AlertCircle size={18} />

          {error}

        </div>

      )}


      {/* =====================================================
          PROFILE GRID
      ====================================================== */}

      <div className="profile-grid">


        {/* ===================================================
            LEFT PROFILE CARD
        ==================================================== */}

        <div className="profile-card profile-main-card">

          <div className="profile-avatar">

            {getInitials(profile.name)}

          </div>


          <h2>
            {profile.name || "User"}
          </h2>


          <p className="profile-role">

            {profile.targetRole ||
              "Career Goal Not Set"}

          </p>


          <div className="profile-status">

            <span className="status-dot"></span>

            Active Account

          </div>


          <div className="profile-divider"></div>


          <div className="profile-mini-info">

            <div>

              <Mail size={17} />

              <span>
                {profile.email ||
                  "Email not available"}
              </span>

            </div>


            <div>

              <MapPin size={17} />

              <span>
                {profile.location ||
                  "Location not added"}
              </span>

            </div>


            <div>

              <Briefcase size={17} />

              <span>
                {profile.experience}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            PERSONAL INFORMATION
        ==================================================== */}

        <div className="profile-card">

          <div className="section-title">

            <User size={20} />

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Your basic account information
              </p>

            </div>

          </div>


          <div className="profile-form">


            {/* NAME */}

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <div className="profile-input">

                <User size={17} />

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <label>
                Email Address
              </label>

              <div className="profile-input">

                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <div className="profile-input">

                <Phone size={17} />

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>


            {/* LOCATION */}

            <div className="profile-field">

              <label>
                Location
              </label>

              <div className="profile-input">

                <MapPin size={17} />

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CAREER INFORMATION
      ====================================================== */}

      <div className="profile-card career-card">

        <div className="section-title">

          <Target size={20} />

          <div>

            <h2>
              Career Information
            </h2>

            <p>
              Your career goals used for
              AI skill-gap analysis
            </p>

          </div>

        </div>


        <div className="career-grid">


          {/* TARGET ROLE */}

          <div className="career-box">

            <div className="career-icon">

              <Target size={22} />

            </div>

            <div>

              <span>
                Target Job Role
              </span>

              <strong>

                {profile.targetRole ||
                  "Not selected"}

              </strong>

            </div>

          </div>


          {/* EXPERIENCE */}

          <div className="career-box">

            <div className="career-icon">

              <Briefcase size={22} />

            </div>

            <div>

              <span>
                Experience Level
              </span>

              <strong>
                {profile.experience}
              </strong>

            </div>

          </div>


          {/* JOB READINESS */}

          <div className="career-box">

            <div className="career-icon">

              <Award size={22} />

            </div>

            <div>

              <span>
                Job Readiness
              </span>

              <strong>
                {jobReadiness}%
              </strong>

            </div>

          </div>


          {/* SKILLS */}

          <div className="career-box">

            <div className="career-icon">

              <BookOpen size={22} />

            </div>

            <div>

              <span>
                Skills Identified
              </span>

              <strong>
                {skillsCount} Skills
              </strong>

            </div>

          </div>

        </div>


        <button
          className="career-action"
          onClick={() =>
            navigate("/target-role")
          }
        >
          Update Career Goal
        </button>

      </div>


      {/* =====================================================
          SECURITY
      ====================================================== */}

      <div className="profile-card security-card">

        <div className="section-title">

          <Lock size={20} />

          <div>

            <h2>
              Account Security
            </h2>

            <p>
              Manage your password and
              account security
            </p>

          </div>

        </div>


        <div className="security-row">

          <div>

            <strong>
              Password
            </strong>

            <p>
              Last updated recently
            </p>

          </div>


          <button
            className="security-btn"
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            Change Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;