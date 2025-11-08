
import React, { createContext, useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwt_decode(token)
        setUser({ token, role: decoded.role, id: decoded.id, name: decoded.name, email: decoded.email })
      } catch (e) {
        localStorage.removeItem('token')
      }
    }
  }, [])

  const login = (token, userInfo) => {
    localStorage.setItem('token', token)
    setUser({ token, role: userInfo.role, id: userInfo._id, name: userInfo.name, email: userInfo.email })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthContext
