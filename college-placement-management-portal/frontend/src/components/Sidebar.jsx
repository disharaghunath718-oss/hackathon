import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useContext(AuthContext)
  const role = user?.role

  const links = {
    student: [
      { to: '/student', label: 'Dashboard' },
      { to: '/student/drives', label: 'Drives' },
      { to: '/student/profile', label: 'Profile' },
      { to: '/student/ats', label: 'ATS (Gemini)' }   // ✅ ADD THIS LINE
    ],
    tpo: [
      { to: '/tpo', label: 'Dashboard' },
      { to: '/tpo/drives', label: 'Manage Drives' }
    ],
    hod: [
      { to: '/hod', label: 'Dashboard' },
      { to: '/hod/reports', label: 'Reports' }
    ]
  }

  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
        <nav className="flex flex-col space-y-2">
          {(links[role] || []).map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 
                `px-3 py-2 rounded ${isActive 
                  ? 'bg-brand-500 text-white' 
                  : 'text-slate-700 dark:text-slate-200'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
