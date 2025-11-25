"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Toaster } from "sonner"
import { motion } from "framer-motion"
import Navbar from "./Navbar"
import StatsCards from "./StatsCards"
import PendingList from "./PendingList"

interface Admin {
  id: string
  email: string
  name: string
}

interface Stats {
  total_comparisons: number
  pending: number
  published: number
  rejected: number
}

export default function AdminDashboardClient() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth")
      const data = await response.json()

      if (data.authenticated) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
        await loadStats()
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin relative z-10" />
          </div>
          <p className="text-gray-400 text-sm animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <Toaster position="top-right" theme="dark" closeButton />
      <Navbar admin={admin} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, <span className="text-blue-400 font-medium">{admin?.name}</span>. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              System Operational
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StatsCards stats={stats} />

        {/* Pending Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PendingList onRefresh={loadStats} />
        </motion.div>
      </main>
    </div>
  )
}
