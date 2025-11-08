
import React, { useState, useContext } from 'react'
import client from '../../api/axiosClient'
import toast from 'react-hot-toast'
import AuthContext from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await client.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      toast.success('Logged in')
      nav(`/${res.data.user.role}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">Login</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded" />
          <button className="w-full py-2 bg-brand-500 text-white rounded">Sign in</button>
        </form>
      </div>
    </div>
  )
}
