import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminRoute } from '@/components/admin/AdminRoute'
import AdminLayout from '@/layouts/AdminLayout'
import AdminDashboard from './AdminDashboard'
import UsersPage from './UsersPage'
import AIAnalyticsPage from './AIAnalyticsPage'
import RevenuePage from './RevenuePage'
import SystemHealthPage from './SystemHealthPage'
import SettingsPageAdmin from './SettingsPageAdmin'

export default function AdminRoutes() {
  return (
    <AdminRoute>
      <AdminLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="ai-analytics" element={<AIAnalyticsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="system" element={<SystemHealthPage />} />
          <Route path="settings" element={<SettingsPageAdmin />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </AdminRoute>
  )
}
