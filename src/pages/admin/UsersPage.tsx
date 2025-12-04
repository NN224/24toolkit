import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Trash2, Eye, Crown, Zap, Shield, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  plan: 'free' | 'pro' | 'unlimited'
  createdAt: any
  lastLoginAt?: any
  aiRequestsUsed?: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro' | 'unlimited'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, filterPlan, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      
      const { collection, getDocs, query, limit } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      const usersRef = collection(db, 'users')
      // Simple query without orderBy to avoid index requirement
      const q = query(usersRef, limit(100))
      const snapshot = await getDocs(q)
      
      console.log('📊 Users loaded:', snapshot.size)
      
      const usersData = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          uid: doc.id,
          email: data.email || '',
          displayName: data.displayName || data.name || '',
          photoURL: data.photoURL,
          plan: data.plan || (data.isPremium ? 'pro' : 'free'),
          createdAt: data.createdAt,
          aiRequestsUsed: data.aiRequestsUsed || data.aiCreditsUsed || 0
        } as User
      })
      
      // Sort by createdAt client-side
      usersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0)
        const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0)
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
      
      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (error: any) {
      console.error('Failed to load users:', error)
      toast.error(error?.message || 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.uid.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterPlan !== 'all') {
      filtered = filtered.filter(user => user.plan === filterPlan)
    }

    setFilteredUsers(filtered)
  }

  const handleChangePlan = async (userId: string, newPlan: 'free' | 'pro' | 'unlimited') => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { plan: newPlan })
      
      setUsers(users.map(u => u.uid === userId ? { ...u, plan: newPlan } : u))
      toast.success(`Plan changed to ${newPlan}`)
    } catch (error) {
      console.error('Failed to change plan:', error)
      toast.error('Failed to change plan')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      const userRef = doc(db, 'users', userId)
      await deleteDoc(userRef)
      
      setUsers(users.filter(u => u.uid !== userId))
      toast.success('User deleted')
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const exportToCSV = () => {
    const csv = [
      ['UID', 'Email', 'Name', 'Plan', 'Created', 'AI Requests'],
      ...filteredUsers.map(u => [
        u.uid,
        u.email,
        u.displayName || '',
        u.plan,
        u.createdAt?.toDate?.() ? format(u.createdAt.toDate(), 'yyyy-MM-dd') : 
        u.createdAt instanceof Date ? format(u.createdAt, 'yyyy-MM-dd') : '',
        u.aiRequestsUsed || 0
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    
    toast.success('Users exported to CSV')
  }

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Shield },
      pro: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Zap },
      unlimited: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Crown }
    }
    const badge = badges[plan as keyof typeof badges] || badges.free
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold border ${badge.color}`}>
        <Icon size={12} className="sm:w-[14px] sm:h-[14px]" />
        <span className="hidden sm:inline">{plan.toUpperCase()}</span>
        <span className="sm:hidden">{plan.charAt(0).toUpperCase()}</span>
      </span>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredUsers.length} of {users.length} users
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground text-sm"
            />
          </div>

          {/* Filter by Plan */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as any)}
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground appearance-none cursor-pointer text-sm"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table/Cards */}
      <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">User</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Email</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Plan</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Joined</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-500" />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.displayName?.[0] || user.email?.[0] || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground text-sm">{user.displayName || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">ID: {user.uid.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-sm text-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{getPlanBadge(user.plan || 'free')}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-sm text-foreground">
                        {user.createdAt?.toDate?.() 
                          ? format(user.createdAt.toDate(), 'MMM dd, yyyy')
                          : user.createdAt instanceof Date 
                          ? format(user.createdAt, 'MMM dd, yyyy')
                          : 'Unknown'
                        }
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedUser(user)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-blue-400" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.uid)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-red-400" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-white/10">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.uid} className="p-4 hover:bg-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-purple-500" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center text-white font-bold">
                        {user.displayName?.[0] || user.email?.[0] || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground text-sm">{user.displayName || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {getPlanBadge(user.plan || 'free')}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-muted-foreground">
                    {user.createdAt?.toDate?.() 
                      ? format(user.createdAt.toDate(), 'MMM dd, yyyy')
                      : user.createdAt instanceof Date 
                      ? format(user.createdAt, 'MMM dd, yyyy')
                      : 'Unknown'
                    }
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedUser(user)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDeleteUser(user.uid)} className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedUser(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">✕</button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-purple-500" />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                    {selectedUser.displayName?.[0] || selectedUser.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{selectedUser.displayName || 'Unknown'}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Plan</p>
                  {getPlanBadge(selectedUser.plan || 'free')}
                </div>
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">AI Requests</p>
                  <p className="text-sm font-medium text-foreground">{selectedUser.aiRequestsUsed || 0}</p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm font-semibold text-foreground">Change Plan</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['free', 'pro', 'unlimited'].map((plan) => (
                    <button
                      key={plan}
                      onClick={() => handleChangePlan(selectedUser.uid, plan as any)}
                      disabled={selectedUser.plan === plan}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        selectedUser.plan === plan
                          ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90'
                      }`}
                    >
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
