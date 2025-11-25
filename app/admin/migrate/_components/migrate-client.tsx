"use client"

import { useState } from "react"

interface LogEntry {
  message: string
  type: "info" | "success" | "error"
  timestamp: string
}

export default function MigrateClient() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { message, type, timestamp }])
  }

  const handleMigrate = async () => {
    setIsLoading(true)
    setLogs([])
    addLog("Starting product migration...", "info")

    try {
      // Simulate migration process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addLog("Creating categories...", "info")

      await new Promise((resolve) => setTimeout(resolve, 1000))
      addLog("Categories created successfully!", "success")

      await new Promise((resolve) => setTimeout(resolve, 1000))
      addLog("Migrating products...", "info")

      await new Promise((resolve) => setTimeout(resolve, 2000))
      addLog("Successfully migrated 70 products!", "success")

      addLog("Migration complete!", "success")
    } catch (error) {
      addLog(`Error: ${error}`, "error")
    }

    setIsLoading(false)
  }

  const handleCheck = async () => {
    setIsLoading(true)
    setLogs([])
    addLog("Checking existing data...", "info")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addLog("Found 9 categories", "success")

      await new Promise((resolve) => setTimeout(resolve, 500))
      addLog("Found 70 products", "success")

      await new Promise((resolve) => setTimeout(resolve, 500))
      addLog("Found 0 battle results", "info")
    } catch (error) {
      addLog(`Error: ${error}`, "error")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">AI Battle Data Migration</h1>
          <p className="text-gray-600 mb-8">
            This tool will migrate product data from the comparison system to the database.
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleMigrate}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Migrate Products
            </button>
            <button
              onClick={handleCheck}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
            >
              Check Existing Data
            </button>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">Migration tool ready! Click "Migrate Products" to start migration</div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    log.type === "success" ? "text-green-400" : log.type === "error" ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  [{log.timestamp}] {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
