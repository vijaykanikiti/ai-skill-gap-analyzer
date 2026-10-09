import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// User layout
import DashboardLayout from "./components/DashboardLayout";

// User pages
import Dashboard from "./pages/user/Dashboard";
import ResumeUpload from "./pages/user/ResumeUpload";
import ResumeAnalysis from "./pages/user/ResumeAnalysis";
import TargetRole from "./pages/user/TargetRole";
import SkillGap from "./pages/user/SkillGap";
import LearningRoadmap from "./pages/user/LearningRoadmap";
import Recommendations from "./pages/user/Recommendations";
import Progress from "./pages/user/Progress";
import Profile from "./pages/user/Profile";

// Admin layout
import AdminLayout from "./components/AdminLayout";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalyses from "./pages/admin/AdminAnalyses";
import AdminActivity from "./pages/admin/AdminActivity";


import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import VerifyLoginOtp from "./pages/VerifyLoginOtp";


function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
     
     <Route path="/terms" element={<Terms />} />

<Route
  path="/privacy-policy"
  element={<PrivacyPolicy />}
/>

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
  path="/verify-login-otp"
  element={<VerifyLoginOtp />}
/>

      {/* ================= USER SECTION ================= */}

      <Route element={<DashboardLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/resume"
          element={<ResumeUpload />}
        />

        <Route
          path="/resume-analysis"
          element={<ResumeAnalysis />}
        />

        <Route
          path="/target-role"
          element={<TargetRole />}
        />

        <Route
          path="/skill-gap"
          element={<SkillGap />}
        />

        <Route
          path="/roadmap"
          element={<LearningRoadmap />}
        />

        <Route
          path="/recommendations"
          element={<Recommendations />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>


      {/* ================= ADMIN SECTION ================= */}

      <Route element={<AdminLayout />}>

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
    path="/admin/analyses"
    element={<AdminAnalyses />}
  />

  <Route
    path="/admin/activity"
    element={<AdminActivity />}
  />

      </Route>


      {/* ================= DEFAULT ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;