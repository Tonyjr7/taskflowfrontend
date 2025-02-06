"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  token: string | null
  username: string | null
  login: (token: string, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUsername = localStorage.getItem("username")
    if (storedToken && storedUsername) {
      setToken(storedToken)
      setUsername(storedUsername)
    }
  }, [])

  const login = (newToken: string, newUsername: string) => {
    setToken(newToken)
    setUsername(newUsername)
    localStorage.setItem("token", newToken)
    localStorage.setItem("username", newUsername)
    router.push("/tasks")
  }

  const logout = () => {
    setToken(null)
    setUsername(null)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ token, username, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

