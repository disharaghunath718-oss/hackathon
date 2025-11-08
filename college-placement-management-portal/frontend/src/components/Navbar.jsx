
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()
  const onLogout = () => { logout(); nav('/login') }

  return (
    <header className="bg-white dark:bg-slate-900 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-slate-700 dark:text-slate-100">Placement Portal</Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300">Hi, {user.name || user.email}</span>
              <span className="text-sm px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-200">{user.role}</span>
              <button onClick={onLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-brand-500 text-white rounded">Login</Link>
              <Link to="/register" className="px-3 py-1 border rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
