import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Menu,
  X,
  ArrowRight
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

import "../styles/navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="main-navbar">

      {/* Logo */}

      <Link to="/" className="navbar-logo" onClick={closeMenu}>

        <div className="logo-icon">
          <Brain size={24} />
        </div>

        <span>
          Skill<span>Gap AI</span>
        </span>

      </Link>

      {/* Desktop Navigation */}

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>

        <a href="/#features" onClick={closeMenu}>
          Features
        </a>

        <a href="/#how-it-works" onClick={closeMenu}>
          How It Works
        </a>

        <Link to="/login" onClick={closeMenu}>
          Login
        </Link>

        <Link
          to="/register"
          className="navbar-start-btn"
          onClick={closeMenu}
        >
          Get Started
          <ArrowRight size={17} />
        </Link>

      </div>

      {/* Right Controls */}

      <div className="navbar-actions">

        <ThemeToggle />

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;