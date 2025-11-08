
import React, { useContext } from 'react'
import ThemeContext from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle(){
  const { dark, setDark } = useContext(ThemeContext)
  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded bg-slate-100 dark:bg-slate-700">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
