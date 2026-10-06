import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import "../styles/admin-layout.css";

function AdminLayout() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* ================= ADMIN SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="admin-logo">

          <div className="admin-logo-icon">
            <ShieldCheck size={23} />
          </div>

          <div className="admin-logo-text">
            <strong>SkillGap AI</strong>
            <span>Admin Panel</span>
          </div>

        </div>


        <div className="admin-menu-title">
          ADMIN MENU
        </div>


        <nav className="admin-nav">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <Users size={19} />
            <span>Users</span>
          </NavLink>


          <NavLink
            to="/admin/analyses"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <FileText size={19} />
            <span>Resume Analyses</span>
          </NavLink>


          <NavLink
            to="/admin/activity"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <Activity size={19} />
            <span>Activity</span>
          </NavLink>

        </nav>


        {/* Logout */}

        <button
          className="admin-logout"
          onClick={logout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>


        <div className="admin-version">
          AI Skill Gap Analyzer v1.0
        </div>

      </aside>


      {/* ================= ADMIN MAIN ================= */}

      <main className="admin-main">

        {/* Admin Topbar */}

        <header className="admin-topbar">

          <div className="admin-topbar-title">
            <strong>Admin Panel</strong>
            <span>Manage AI Skill Gap Analyzer</span>
          </div>


          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin Account</span>
            </div>

          </div>

        </header>


        {/* Page Content */}

        <div className="admin-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;