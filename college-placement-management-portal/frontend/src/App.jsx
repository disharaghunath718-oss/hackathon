// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/Profile';
import StudentDrives from './pages/Student/Drives';
import ATS from './pages/Student/ATS'; // ✅ make sure this import exists

import TPODashboard from './pages/TPO/Dashboard';
import TPODrives from './pages/TPO/Drives';

import HODDashboard from './pages/HOD/Dashboard';
import HODReports from './pages/HOD/Reports';
import PendingApprovals from './pages/HOD/PendingApprovals';
import Students from './pages/HOD/Students';
import Stats from './pages/HOD/Stats';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/student" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* STUDENT */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute role="student">
                <div className="md:flex gap-6">
                  <Sidebar />
                  <div className="flex-1">
                    <Routes>
                      <Route index element={<StudentDashboard />} />
                      <Route path="profile" element={<StudentProfile />} />
                      <Route path="drives" element={<StudentDrives />} />
                      <Route path="ats" element={<ATS />} /> {/* ✅ ATS route */}
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* TPO */}
          <Route
            path="/tpo/*"
            element={
              <ProtectedRoute role="tpo">
                <div className="md:flex gap-6">
                  <Sidebar />
                  <div className="flex-1">
                    <Routes>
                      <Route index element={<TPODashboard />} />
                      <Route path="drives" element={<TPODrives />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* HOD */}
          <Route
            path="/hod/*"
            element={
              <ProtectedRoute role="hod">
                <div className="md:flex gap-6">
                  <Sidebar />
                  <div className="flex-1">
                    <Routes>
                      <Route index element={<HODDashboard />} />
                      <Route path="pending" element={<PendingApprovals />} />
                      <Route path="students" element={<Students />} />
                      <Route path="stats" element={<Stats />} />
                      <Route path="reports" element={<HODReports />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
