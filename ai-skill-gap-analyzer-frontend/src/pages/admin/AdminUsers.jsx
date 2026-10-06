import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Eye,
  RefreshCw,
} from "lucide-react";

import "../../styles/admin-users.css";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/admin/users"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Unable to load users from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search users
  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const role = user.targetRole || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      role.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Statistics
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.role !== "ADMIN"
  ).length;

  const inactiveUsers = 0;

  // Generate initials
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

  // View user
  const handleViewUser = (user) => {
    alert(
      `User Details\n\n` +
      `Name: ${user.name || "N/A"}\n` +
      `Email: ${user.email || "N/A"}\n` +
      `Target Role: ${user.targetRole || "N/A"}\n` +
      `Phone: ${user.phone || "N/A"}\n` +
      `Location: ${user.location || "N/A"}`
    );
  };

  return (
    <div className="admin-users-page">

      {/* Header */}
      <div className="admin-users-header">

        <div>
          <h1>Users</h1>
          <p>View and manage registered users.</p>
        </div>

        <button
          className="view-user-btn"
          onClick={fetchUsers}
          title="Refresh Users"
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={loading ? "loading-spinner" : ""}
          />
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="user-summary">

        <div className="user-summary-card">

          <div className="summary-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </div>

        </div>

        <div className="user-summary-card">

          <div className="summary-icon">
            <UserCheck size={21} />
          </div>

          <div>
            <span>Active Users</span>
            <strong>{activeUsers}</strong>
          </div>

        </div>

        <div className="user-summary-card">

          <div className="summary-icon">
            <UserX size={21} />
          </div>

          <div>
            <span>Inactive Users</span>
            <strong>{inactiveUsers}</strong>
          </div>

        </div>

      </div>

      {/* User Table */}
      <div className="admin-users-card">

        <div className="users-toolbar">

          <div>
            <h2>Registered Users</h2>
            <p>All users registered on the platform</p>
          </div>

          <div className="user-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        <div className="users-table-wrapper">

          {loading ? (

            <div className="admin-loading">
              <RefreshCw
                size={28}
                className="loading-spinner"
              />
              <p>Loading users...</p>
            </div>

          ) : (

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Target Role</th>
                  <th>Analyses</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr key={user.id}>

                    {/* User */}
                    <td>

                      <div className="user-name-cell">

                        <div className="user-avatar">
                          {getInitials(user.name)}
                        </div>

                        <strong>
                          {user.name || "Unknown User"}
                        </strong>

                      </div>

                    </td>

                    {/* Email */}
                    <td>
                      {user.email || "N/A"}
                    </td>

                    {/* Target Role */}
                    <td>
                      {user.targetRole || "Not selected"}
                    </td>

                    {/* Analyses */}
                    <td>
                      <span className="analysis-count">
                        {user.analysisCount ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td>

                      <span className="user-active">
                        Active
                      </span>

                    </td>

                    {/* Action */}
                    <td>

                      <button
                        className="view-user-btn"
                        title="View User"
                        onClick={() =>
                          handleViewUser(user)
                        }
                      >
                        <Eye size={17} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="no-users">
              No users found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;