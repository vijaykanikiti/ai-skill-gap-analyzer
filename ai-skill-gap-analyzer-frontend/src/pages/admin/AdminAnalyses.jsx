import React, { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Eye,
  RefreshCw,
} from "lucide-react";

import "../../styles/admin-analyses.css";

function AdminAnalyses() {
  const [search, setSearch] = useState("");
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch analyses from backend
  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/admin/analyses"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analyses");
      }

      const data = await response.json();

      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching analyses:", err);
      setError("Unable to load analysis records from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  // Search
  const filteredAnalyses = analyses.filter((item) => {
    const user = item.userName || "";
    const email = item.userEmail || "";
    const role = item.targetRole || "";

    return (
      user.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      role.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Statistics
  const totalAnalyses = analyses.length;

  // At present, every saved ResumeAnalysis is considered completed.
  const completed = analyses.length;

  // Processing status is not currently stored in ResumeAnalysis.
  const processing = 0;

  const averageScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce(
            (sum, item) =>
              sum + Number(item.matchPercentage || 0),
            0
          ) / analyses.length
        )
      : 0;

  // Get initials
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Format backend date
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    try {
      return new Date(dateValue).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "N/A";
    }
  };

  // View analysis details
  const handleViewAnalysis = (item) => {
    alert(
      `Analysis Details\n\n` +
        `User: ${item.userName || "N/A"}\n` +
        `Email: ${item.userEmail || "N/A"}\n` +
        `Target Role: ${item.targetRole || "N/A"}\n` +
        `Match Score: ${item.matchPercentage ?? 0}%\n` +
        `Detected Skills: ${
          item.detectedSkills || "None"
        }\n` +
        `Matched Skills: ${
          item.matchedSkills || "None"
        }\n` +
        `Missing Skills: ${
          item.missingSkills || "None"
        }\n` +
        `Date: ${formatDate(item.analyzedAt)}`
    );
  };

  return (
    <div className="admin-analyses-page">

      {/* Header */}
      <div className="admin-analyses-header">

        <div>
          <h1>Resume Analyses</h1>

          <p>
            Monitor resume analysis activity across the
            platform.
          </p>
        </div>

        <button
          className="analysis-view-btn"
          onClick={fetchAnalyses}
          disabled={loading}
          title="Refresh Analyses"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "loading-spinner" : ""
            }
          />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="analysis-summary">

        <div className="analysis-summary-card">

          <div className="analysis-summary-icon">
            <FileText size={21} />
          </div>

          <div>
            <span>Total Analyses</span>
            <strong>{totalAnalyses}</strong>
          </div>

        </div>

        <div className="analysis-summary-card">

          <div className="analysis-summary-icon">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>

        </div>

        <div className="analysis-summary-card">

          <div className="analysis-summary-icon">
            <Clock size={21} />
          </div>

          <div>
            <span>Processing</span>
            <strong>{processing}</strong>
          </div>

        </div>

        <div className="analysis-summary-card">

          <div className="analysis-summary-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Average Match</span>
            <strong>{averageScore}%</strong>
          </div>

        </div>

      </div>

      {/* Table */}
      <div className="admin-analyses-card">

        <div className="analyses-toolbar">

          <div>
            <h2>Analysis Records</h2>

            <p>
              Resume analysis history of registered
              users
            </p>
          </div>

          <div className="analysis-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search analyses..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        <div className="analyses-table-wrapper">

          {loading ? (

            <div className="admin-loading">
              <RefreshCw
                size={28}
                className="loading-spinner"
              />

              <p>
                Loading analysis records...
              </p>
            </div>

          ) : (

            <table className="analyses-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Target Role</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredAnalyses.map((item) => {

                  const score = Number(
                    item.matchPercentage || 0
                  );

                  return (
                    <tr key={item.id}>

                      {/* User */}
                      <td>

                        <div className="analysis-user">

                          <div className="analysis-avatar">
                            {getInitials(
                              item.userName
                            )}
                          </div>

                          <div>
                            <strong>
                              {item.userName ||
                                "Unknown User"}
                            </strong>

                            <span>
                              {item.userEmail ||
                                "N/A"}
                            </span>
                          </div>

                        </div>

                      </td>

                      {/* Target Role */}
                      <td>
                        {item.targetRole ||
                          "Not selected"}
                      </td>

                      {/* Match Score */}
                      <td>

                        <div className="match-score">

                          <div className="score-bar">

                            <div
                              className="score-fill"
                              style={{
                                width: `${Math.min(
                                  Math.max(score, 0),
                                  100
                                )}%`,
                              }}
                            ></div>

                          </div>

                          <strong>
                            {score}%
                          </strong>

                        </div>

                      </td>

                      {/* Status */}
                      <td>

                        <span className="analysis-completed">
                          Completed
                        </span>

                      </td>

                      {/* Date */}
                      <td>
                        {formatDate(
                          item.analyzedAt
                        )}
                      </td>

                      {/* Action */}
                      <td>

                        <button
                          className="analysis-view-btn"
                          onClick={() =>
                            handleViewAnalysis(item)
                          }
                        >
                          <Eye size={17} />
                          View
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          )}

          {/* No results */}
          {!loading &&
            filteredAnalyses.length === 0 && (
              <div className="no-analysis">
                No analysis records found.
              </div>
            )}

        </div>

      </div>

    </div>
  );
}

export default AdminAnalyses;