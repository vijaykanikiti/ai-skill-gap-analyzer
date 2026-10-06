import React from "react";
import {
  Menu,
  Bell,
  UserCircle
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

function Topbar({ onMenuClick }) {
  return (
    <header className="topbar">

      {/* Mobile Menu */}
      <button
        className="mobile-menu-button"
        onClick={onMenuClick}
      >
        <Menu size={23} />
      </button>

      {/* Page Information */}
      <div className="topbar-title">
        <h1>AI Skill Gap Analyzer</h1>
        <p>Analyze your skills and build your career path</p>
      </div>

      {/* Right Side */}
      <div className="topbar-right">

        <button className="topbar-icon">
          <Bell size={19} />
        </button>

        <ThemeToggle />

        <div className="topbar-profile">

          <UserCircle size={35} />

          <div>
            <strong>Vijay Kumar</strong>
            <span>Student</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;