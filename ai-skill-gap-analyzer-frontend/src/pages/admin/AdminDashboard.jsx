import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Activity,
  TrendingUp,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import "../../styles/admin-dashboard.css";

function AdminDashboard() {
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    completedAnalyses: 0,
    pendingAnalyses: 0,
    averageMatchPercentage: 0,
  });

  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ADMIN DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewResponse, usersResponse, activityResponse] =
        await Promise.all([
          fetch("http://localhost:8080/api/admin/overview"),
          fetch("http://localhost:8080/api/admin/users"),
          fetch("http://localhost:8080/api/admin/activity"),
        ]);

      if (!overviewResponse.ok) {
        throw new Error("Failed to load dashboard overview");
      }

      if (!usersResponse.ok) {
        throw new Error("Failed to load users");
      }

      if (!activityResponse.ok) {
        throw new Error("Failed to load activity");
      }

      const overviewData = await overviewResponse.json();
      const usersData = await usersResponse.json();
      const activityData = await activityResponse.json();

      setOverview(overviewData);

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

      setActivities(
        Array.isArray(activityData)
          ? activityData
          : []
      );

    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        "Unable to load dashboard data from the server."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // RECENT USERS
  // ==========================================

  const recentUsers = users.slice(0, 4);

  // ==========================================
  // TODAY'S ACTIVITY
  // ==========================================

  const isToday = (timestamp) => {
    if (!timestamp) {
      return false;
    }

    const date = new Date(timestamp);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayActivities = activities.filter(
    (activity) =>
      isToday(activity.timestamp)
  );

  const analysesToday =
    todayActivities.filter(
      (activity) =>
        activity.type === "Resume Analysis"
    ).length;

  const usersToday =
    todayActivities.filter(
      (activity) =>
        activity.type === "Registration"
    ).length;

  // ==========================================
  // REFRESH BUTTON
  // ==========================================

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="admin-dashboard">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage users, resume analyses and
            platform activity.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <button
            className="admin-badge"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh dashboard"
            style={{
              border: "none",
              cursor: "pointer",
            }}
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "loading-spinner"
                  : ""
              }
            />

            Refresh
          </button>

          <div className="admin-badge">
            <UserCheck size={17} />
            Administrator
          </div>

        </div>

      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="admin-stats">

        {/* Total Users */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Users />
          </div>

          <div>

            <span>Total Users</span>

            <strong>
              {overview.totalUsers}
            </strong>

            <small>
              Registered users
            </small>

          </div>

        </div>

        {/* Resume Analyses */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FileText />
          </div>

          <div>

            <span>Resume Analyses</span>

            <strong>
              {overview.totalAnalyses}
            </strong>

            <small>
              Total analyses
            </small>

          </div>

        </div>

        {/* Completed Analyses */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Activity />
          </div>

          <div>

            <span>Completed Analyses</span>

            <strong>
              {overview.completedAnalyses}
            </strong>

            <small>
              Successfully completed
            </small>

          </div>

        </div>

        {/* Average Match */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <TrendingUp />
          </div>

          <div>

            <span>Average Match</span>

            <strong>
              {overview.averageMatchPercentage}%
            </strong>

            <small>
              Platform average
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN GRID
      ====================================== */}

      <div className="admin-content-grid">

        {/* ===================================
            RECENT USERS
        ==================================== */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>

              <h2>
                Recent Users
              </h2>

              <p>
                Recently registered users
              </p>

            </div>

            <Users size={21} />

          </div>

          <div className="admin-table-wrapper">

            {loading ? (

              <div className="admin-loading">

                <RefreshCw
                  size={28}
                  className="loading-spinner"
                />

                <p>
                  Loading users...
                </p>

              </div>

            ) : (

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Target Role</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {recentUsers.map(
                    (user) => (

                      <tr key={user.id}>

                        <td>
                          {user.name ||
                            "Unknown User"}
                        </td>

                        <td>
                          {user.email ||
                            "N/A"}
                        </td>

                        <td>
                          {user.targetRole ||
                            "Not selected"}
                        </td>

                        <td>

                          <span className="active-status">
                            Active
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

            {!loading &&
              recentUsers.length === 0 && (
                <div className="admin-empty">
                  No users registered yet.
                </div>
              )}

          </div>

        </div>

        {/* ===================================
            PLATFORM ACTIVITY
        ==================================== */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>

              <h2>
                Platform Activity
              </h2>

              <p>
                System overview
              </p>

            </div>

            <Activity size={21} />

          </div>

          <div className="activity-list">

            {/* Analyses Today */}

            <div className="activity-item">

              <div className="activity-icon">
                <FileText size={18} />
              </div>

              <div>

                <strong>
                  {analysesToday} resume{" "}
                  {analysesToday === 1
                    ? "analysis"
                    : "analyses"}
                </strong>

                <span>
                  Today
                </span>

              </div>

            </div>

            {/* Users Today */}

            <div className="activity-item">

              <div className="activity-icon">
                <Users size={18} />
              </div>

              <div>

                <strong>
                  {usersToday} new{" "}
                  {usersToday === 1
                    ? "user"
                    : "users"}
                </strong>

                <span>
                  Today
                </span>

              </div>

            </div>

            {/* Average Readiness */}

            <div className="activity-item">

              <div className="activity-icon">
                <TrendingUp size={18} />
              </div>

              <div>

                <strong>
                  {
                    overview.averageMatchPercentage
                  }
                  % average readiness
                </strong>

                <span>
                  Platform average
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          SYSTEM INFORMATION
      ====================================== */}

      <div className="admin-card system-card">

        <div className="admin-card-header">

          <div>

            <h2>
              System Information
            </h2>

            <p>
              AI Skill Gap Analyzer
              overview
            </p>

          </div>

          <AlertCircle size={21} />

        </div>

        <div className="system-grid">

          {/* AI Analyses */}

          <div>

            <span>
              AI Analyses
            </span>

            <strong>
              {overview.totalAnalyses}
            </strong>

          </div>

          {/* Registered Users */}

          <div>

            <span>
              Registered Users
            </span>

            <strong>
              {overview.totalUsers}
            </strong>

          </div>

          {/* Completed Analyses */}

          <div>

            <span>
              Completed Analyses
            </span>

            <strong>
              {overview.completedAnalyses}
            </strong>

          </div>

          {/* System Status */}

          <div>

            <span>
              System Status
            </span>

            <strong className="system-online">
              ● Online
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;