
import React from 'react'
export default function Card({ children, className = '' }) {
  return <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow p-5 ${className}`}>{children}</div>
}
