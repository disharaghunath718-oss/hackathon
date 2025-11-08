// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const norm = v => String(v ?? '').toLowerCase();
const mapRole = r => {
  const s = norm(r);
  if (['student','stud','std'].includes(s)) return 'student';
  if (['tpo','placement','placementofficer','admin'].includes(s)) return 'tpo';
  if (['hod','head','headofdepartment'].includes(s)) return 'hod';
  return s || null;
};

export default function ProtectedRoute({ children, role }) {
  const ctx = useContext(AuthContext) || {};
  const loading = Boolean(ctx.loading);
  let user = ctx.user ?? null;

  // If context not ready, try localStorage
  if (!user) {
    try {
      const raw = localStorage.getItem('user');
      if (raw) user = JSON.parse(raw);
    } catch {}
  }

  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/login" replace />;

  const userRole = mapRole(user.role);
  const required = role ? mapRole(role) : null;

  // Only block on explicit mismatch; be tolerant if user.role is missing
  if (required && userRole && userRole !== required) {
    const dest = ['student','tpo','hod'].includes(userRole) ? `/${userRole}` : '/';
    return <Navigate to={dest} replace />;
  }

  return children;
}
