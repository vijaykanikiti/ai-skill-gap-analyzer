import React, { useEffect, useState } from "react";
import {
  Activity,
  Users,
  FileText,
  Brain,
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

import "../../styles/admin-activity.css";

function AdminActivity() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ACTIVITY
  // =========================

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/admin/activity"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }

      const data = await response.json();

      setActivities(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Error fetching activity:",
        err
      );

      setError(
        "Unable to load activity from the server."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  // =========================
  // FORMAT TIME
  // =========================

  const formatTimeAgo = (timestamp) => {

    if (!timestamp) {
      return "Unknown time";
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return "Unknown time";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const seconds =
      Math.floor(difference / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${
        minutes === 1 ? "" : "s"
      } ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${
        hours === 1 ? "" : "s"
      } ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${
        days === 1 ? "" : "s"
      } ago`;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // FILTER + SEARCH
  // =========================

  const filteredActivities =
    activities.filter((activity) => {

      const matchesFilter =
        filter === "All" ||
        activity.type === filter;

      const user =
        activity.user || "";

      const description =
        activity.description || "";

      const matchesSearch =
        user
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchesFilter &&
        matchesSearch
      );
    });

  // =========================
  // STATISTICS
  // =========================

  const totalActivities =
    activities.length;

  const registrations =
    activities.filter(
      (activity) =>
        activity.type ===
        "Registration"
    ).length;

  const analyses =
    activities.filter(
      (activity) =>
        activity.type ===
        "Resume Analysis"
    ).length;

  const completedToday =
    activities.filter((activity) => {

      if (
        activity.status !==
        "Completed"
      ) {
        return false;
      }

      if (!activity.timestamp) {
        return false;
      }

      const activityDate =
        new Date(activity.timestamp);

      const today =
        new Date();

      return (
        activityDate.getDate() ===
          today.getDate() &&
        activityDate.getMonth() ===
          today.getMonth() &&
        activityDate.getFullYear() ===
          today.getFullYear()
      );

    }).length;

  // =========================
  // ICON
  // =========================

  const getIcon = (type) => {

    switch (type) {

      case "Registration":
        return <Users size={18} />;

      case "Resume Upload":
        return <FileText size={18} />;

      case "Resume Analysis":
        return <Brain size={18} />;

      case "Skill Gap":
        return <Activity size={18} />;

      case "Roadmap":
        return <BookOpen size={18} />;

      default:
        return <Activity size={18} />;
    }
  };

  return (
    <div className="admin-activity-page">

      {/* Header */}

      <div className="admin-activity-header">

        <div>

          <h1>Activity</h1>

          <p>
            Monitor recent activity
            across the platform.
          </p>

        </div>

        <div className="activity-live">

          <span></span>

          Live Activity

        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* Statistics */}

      <div className="activity-summary">

        <div className="activity-summary-card">

          <div className="activity-summary-icon">
            <Activity size={21} />
          </div>

          <div>
            <span>
              Total Activities
            </span>

            <strong>
              {totalActivities}
            </strong>
          </div>

        </div>

        <div className="activity-summary-card">

          <div className="activity-summary-icon">
            <Users size={21} />
          </div>

          <div>
            <span>
              User Registrations
            </span>

            <strong>
              {registrations}
            </strong>
          </div>

        </div>

        <div className="activity-summary-card">

          <div className="activity-summary-icon">
            <Brain size={21} />
          </div>

          <div>
            <span>
              AI Analyses
            </span>

            <strong>
              {analyses}
            </strong>
          </div>

        </div>

        <div className="activity-summary-card">

          <div className="activity-summary-icon">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>
              Completed Today
            </span>

            <strong>
              {completedToday}
            </strong>
          </div>

        </div>

      </div>

      {/* Activity Card */}

      <div className="admin-activity-card">

        <div className="activity-toolbar">

          <div>

            <h2>
              Recent Activity
            </h2>

            <p>
              Latest actions performed
              by users
            </p>

          </div>

          <div className="activity-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* Filters */}

        <div className="activity-filters">

          {[
            "All",
            "Registration",
            "Resume Upload",
            "Resume Analysis",
            "Skill Gap",
            "Roadmap",
          ].map((item) => (

            <button
              key={item}
              className={
                filter === item
                  ? "filter-active"
                  : ""
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

        {/* Activity List */}

        <div className="activity-list">

          {loading ? (

            <div className="admin-loading">

              <RefreshCw
                size={28}
                className="loading-spinner"
              />

              <p>
                Loading activity...
              </p>

            </div>

          ) : (

            filteredActivities.map(
              (activity) => (

                <div
                  className="activity-record"
                  key={activity.id}
                >

                  {/* Icon */}

                  <div className="activity-record-icon">

                    {getIcon(
                      activity.type
                    )}

                  </div>

                  {/* Content */}

                  <div className="activity-record-content">

                    <div className="activity-record-title">

                      <strong>
                        {activity.type}
                      </strong>

                      <span>
                        {activity.user ||
                          "Unknown User"}
                      </span>

                    </div>

                    <p>
                      {activity.description}
                    </p>

                    <small>
                      {formatTimeAgo(
                        activity.timestamp
                      )}
                    </small>

                  </div>

                  {/* Status */}

                  <div className="activity-record-status">

                    {activity.status ===
                    "Completed" ? (

                      <span className="activity-completed">

                        <CheckCircle
                          size={14}
                        />

                        Completed

                      </span>

                    ) : (

                      <span className="activity-processing">

                        <Clock
                          size={14}
                        />

                        Processing

                      </span>

                    )}

                  </div>

                </div>

              )
            )

          )}

          {!loading &&
            filteredActivities.length ===
              0 && (

              <div className="no-activity">

                No activity found.

              </div>

            )}

        </div>

      </div>

    </div>
  );
}

export default AdminActivity;