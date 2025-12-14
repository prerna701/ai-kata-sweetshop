import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/auth.service"

// Define what a user looks like
type UserType = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

// Define what our auth context provides
type AuthContextType = {
  user: UserType | null
  isLoggedIn: boolean
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

// The provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Initialize user from backend session (cookie) on mount
  useEffect(() => {
    const init = async () => {
      try {
        const current = await authService.getCurrentUser()
        if (current) setUser(current)
      } catch (err) {
        // ignore
      }
      setLoading(false)
    }
    init()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password)
    if (res?.data?.user) {
      setUser(res.data.user)
      return
    }
    // fallback: fetch current user from session
    const current = await authService.getCurrentUser()
    if (current) setUser(current)
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    const res = await authService.signup(name, email, password)
    if (res?.data?.user) {
      setUser(res.data.user)
      return
    }
    const current = await authService.getCurrentUser()
    if (current) setUser(current)
  }

  // Logout function
  const logout = () => {
    authService.logout()
    localStorage.removeItem('sweet-store-cart')
    setUser(null)
  }

  // Check if user is logged in
  const isLoggedIn = !!user
  const isAuthenticated = isLoggedIn

  // Provide all values to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAuthenticated,
        loading,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}