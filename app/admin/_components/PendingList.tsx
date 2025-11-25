"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Eye, Calendar, AlertCircle, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Comparison {
  id: string
  slug: string
  product1_name: string
  product2_name: string
  category: string
  status: string
  created_at: string
}

interface PendingListProps {
  onRefresh: () => void
}

export default function PendingList({ onRefresh }: PendingListProps) {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; action: "approve" | "reject"; product1: string; product2: string } | null>(null)
  const [rejectReason, setRejectReason] = useState("Low quality")

  useEffect(() => {
    loadComparisons()
  }, [])

  const loadComparisons = async () => {
    try {
      const response = await fetch("/api/admin/pending?sort=newest")
      const data = await response.json()
      if (data.success) {
        setComparisons(data.comparisons || [])
      } else {
        toast.error("Failed to load comparisons")
      }
    } catch (error) {
      console.error("Failed to load comparisons:", error)
      toast.error("An error occurred while loading comparisons")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id)
    setConfirmDialog(null)

    try {
      const endpoint = action === "approve" ? "/api/admin/approve" : "/api/admin/reject"
      const body = action === "approve"
        ? { comparisonId: id }
        : { comparisonId: id, reason: rejectReason }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          action === "approve"
            ? "✅ Comparison approved successfully!"
            : "❌ Comparison rejected successfully"
        )
        await loadComparisons()
        onRefresh()
      } else {
        toast.error(data.error || "Failed to update comparison. Please try again.")
      }
    } catch (error) {
      console.error("Action failed:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const showConfirmDialog = (id: string, action: "approve" | "reject", product1: string, product2: string) => {
    setConfirmDialog({ id, action, product1, product2 })
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          Pending Reviews
          <span className="text-sm font-normal text-gray-500 ml-2">({comparisons.length})</span>
        </h2>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent className="bg-[#0a0a0a] border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${confirmDialog?.action === "approve" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                }`}>
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold mb-2">
                  {confirmDialog?.action === "approve" ? "Approve Comparison?" : "Reject Comparison?"}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {confirmDialog?.action === "approve"
                    ? "This will publish the comparison and make it visible to all users."
                    : "This will remove the comparison from the pending list and notify the submitter."}
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-semibold text-white">
                      {confirmDialog?.product1} vs {confirmDialog?.product2}
                    </span>
                  </div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {confirmDialog?.action === "reject" && (
            <div className="mt-4">
              <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-300 mb-2">
                Reason for rejection
              </label>
              <Select value={rejectReason} onValueChange={setRejectReason}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="Low quality">Low quality</SelectItem>
                  <SelectItem value="Inappropriate content">Inappropriate content</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Duplicate">Duplicate</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDialog(null)}
              className="hover:bg-white/5 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDialog && handleAction(confirmDialog.id, confirmDialog.action)}
              className={`${confirmDialog?.action === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
                } text-white`}
            >
              {confirmDialog?.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        <AnimatePresence>
          {comparisons.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl border-dashed"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500/50" />
              </div>
              <h3 className="text-lg font-medium text-white">All caught up!</h3>
              <p className="text-gray-500">No pending comparisons to review.</p>
            </motion.div>
          ) : (
            comparisons.map((comp, index) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                        {comp.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(comp.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      {comp.product1_name}
                      <span className="text-gray-600 text-sm font-normal">vs</span>
                      {comp.product2_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 md:group-hover:translate-x-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`/comparison/${comp.slug}`, "_blank")}
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>

                    <div className="h-8 w-px bg-white/10 mx-1" />

                    <Button
                      onClick={() => showConfirmDialog(comp.id, "approve", comp.product1_name, comp.product2_name)}
                      disabled={actionLoading === comp.id}
                      className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20"
                    >
                      {actionLoading === comp.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>

                    <Button
                      onClick={() => showConfirmDialog(comp.id, "reject", comp.product1_name, comp.product2_name)}
                      disabled={actionLoading === comp.id}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                    >
                      {actionLoading === comp.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
