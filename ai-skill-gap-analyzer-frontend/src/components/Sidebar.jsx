import React from "react";
import {
  LayoutDashboard,
  FileText,
  Target,
  ChartNoAxesCombined,
  BookOpen,
  Lightbulb,
  TrendingUp,
  User,
  LogOut,
  X,
  BrainCircuit
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "../styles/sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Resume Analysis",
      path: "/resume",
      icon: FileText
    },
    {
      name: "Target Job",
      path: "/target-role",
      icon: Target
    },
    {
      name: "Skill Gap",
      path: "/skill-gap",
      icon: ChartNoAxesCombined
    },
    {
      name: "Learning Roadmap",
      path: "/roadmap",
      icon: BookOpen
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: Lightbulb
    },
    
    {
      name: "Profile",
      path: "/profile",
      icon: User
    }
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* Logo */}
        <div className="sidebar-header">

          <div className="sidebar-logo">
            <BrainCircuit size={24} />
          </div>

          <div className="sidebar-brand">
            <h2>SkillGap AI</h2>
            <span>Career Analyzer</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={21} />
          </button>

        </div>


        {/* Menu */}
        <nav className="sidebar-menu">

          <p className="menu-label">
            MAIN MENU
          </p>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <Icon size={19} />

                <span>{item.name}</span>

              </NavLink>
            );
          })}

        </nav>


        {/* Bottom */}
        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <div className="sidebar-version">
            AI Skill Gap Analyzer v1.0
          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;