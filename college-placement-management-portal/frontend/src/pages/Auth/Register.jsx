
import React, { useState } from 'react'
import client from '../../api/axiosClient'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '' })
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await client.post('/auth/register', form)
      toast.success('Registered — please login')
      nav('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">Create account</h3>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="p-2 border rounded" />
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
          <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className="p-2 border rounded" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="p-2 border rounded">
            <option value="student">Student</option>
            <option value="hod">HOD</option>
            <option value="tpo">TPO</option>
          </select>
          <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department (e.g., CSE)" className="p-2 border rounded" />
          <button className="py-2 bg-brand-500 text-white rounded">Register</button>
        </form>
      </div>
    </div>
  )
}
