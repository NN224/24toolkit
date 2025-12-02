import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  SignOut,
  Trash,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Lightning,
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  CreditCard,
  Crown,
  Rocket,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription, PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { useTheme } from '@/components/ThemeProvider'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { updateProfile } from 'firebase/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface UserSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  language: string
}

export default function SettingsPage() {
  // SEO
  const metadata = getPageMetadata('settings')
  useSEO({ ...metadata, canonicalPath: '/settings' })

  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const { currentPlan, isPaid, getCreditsDisplay, subscription } = useSubscription()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'preferences' | 'privacy' | 'account'>('profile')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [language, setLanguage] = useState('ar')
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const settings: UserSettings = JSON.parse(savedSettings)
        setEmailNotifications(settings.emailNotifications ?? true)
        setPushNotifications(settings.pushNotifications ?? false)
        setLanguage(settings.language ?? 'ar')
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    try {
      const settings: UserSettings = {
        emailNotifications,
        pushNotifications,
        language
      }
      localStorage.setItem('userSettings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }, [emailNotifications, pushNotifications, language])

  // Update displayName when user changes
  useEffect(() => {
    setDisplayName(user?.displayName || '')
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) {
      toast.error(t('settings.signInFirst'))
      return
    }

    if (!displayName.trim()) {
      toast.error(t('settings.enterName'))
      return
    }

    setIsSaving(true)
    
    try {
      await updateProfile(user, {
        displayName: displayName.trim()
      })
      toast.success(t('settings.changesSaved'))
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(t('settings.saveChangesFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    try {
      // Delete user account from Firebase
      await user.delete()
      toast.success(t('settings.accountDeleted'))
      // User will be redirected automatically by AuthContext
    } catch (error: any) {
      console.error('Failed to delete account:', error)
      if (error.code === 'auth/requires-recent-login') {
        toast.error(t('settings.signInAgainToDelete'))
        await signOut()
      } else {
        toast.error(t('settings.deleteAccountFailed'))
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success(t('settings.signedOut'))
  }

  const tabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'subscription', label: t('settings.subscription'), icon: CreditCard },
    { id: 'preferences', label: t('settings.preferences'), icon: Palette },
    { id: 'privacy', label: t('settings.privacy'), icon: Shield },
    { id: 'account', label: t('settings.account'), icon: Lock },
  ] as const

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card border border-white/10 rounded-xl p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white'
                        : 'text-muted-foreground hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-card border border-white/10 rounded-xl p-6 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t('settings.profile')}</h2>
                    
                    {/* User Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-20 h-20 rounded-full border-2 border-purple-500"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 flex items-center justify-center">
                          <User size={32} className="text-white" weight="bold" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold">{user?.displayName || 'User'}</h3>
                        <p className="text-muted-foreground text-sm">{user?.email}</p>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('settings.fullName')}</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder={t('settings.fullNamePlaceholder')}
                          className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                          <span>{t('settings.emailAddress')}</span>
                          <button
                            onClick={() => setShowEmail(!showEmail)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {showEmail ? <Eye size={16} /> : <EyeSlash size={16} />}
                          </button>
                        </label>
                        <input
                          type={showEmail ? 'text' : 'password'}
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-2 bg-background/50 border border-white/10 rounded-lg opacity-70 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('settings.linkedToGoogle')}
                        </p>
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving || !displayName.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? t('common.saving') : t('common.saveChanges')}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t('settings.subscription')}</h2>
                    
                    {/* Current Plan */}
                    <div className={`p-6 rounded-xl border-2 mb-6 ${
                      currentPlan === 'unlimited' 
                        ? 'bg-gradient-to-br from-purple-500/10 to-sky-500/10 border-sky-500/30'
                        : currentPlan === 'pro'
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-card border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {currentPlan === 'unlimited' ? (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center">
                              <Crown size={24} weight="fill" className="text-white" />
                            </div>
                          ) : currentPlan === 'pro' ? (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Lightning size={24} weight="fill" className="text-white" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                              <Sparkle size={24} weight="fill" className="text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold">
                              {currentPlan === 'unlimited' ? 'Unlimited' : currentPlan === 'pro' ? 'Pro' : 'Free'} Plan
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {currentPlan === 'free' ? 'Basic access' : 'Premium features enabled'}
                            </p>
                          </div>
                        </div>
                        {isPaid && (
                          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Credits Display */}
                      <div className="p-4 bg-white/5 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground">AI Credits</span>
                          <span className="font-bold">{getCreditsDisplay()}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${
                              currentPlan === 'unlimited' 
                                ? 'from-purple-500 to-sky-500 w-full'
                                : currentPlan === 'pro'
                                  ? 'from-purple-500 to-purple-400'
                                  : 'from-purple-500 to-sky-500'
                            }`}
                            style={{ 
                              width: currentPlan === 'unlimited' ? '100%' : undefined 
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      {isPaid ? (
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/customer-portal', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                  customerId: subscription?.stripeCustomerId,
                                  returnUrl: window.location.href 
                                }),
                              })
                              const data = await response.json()
                              if (data.url) {
                                window.location.href = data.url
                              }
                            } catch (error) {
                              toast.error(t('settings.customerPortalFailed'))
                            }
                          }}
                          className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-foreground font-medium transition-colors"
                        >
                          Manage Subscription
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/pricing')}
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-sky-500 text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Rocket size={18} weight="fill" />
                          Upgrade Now
                        </button>
                      )}
                    </div>

                    {/* Plan Comparison */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Compare Plans</h3>
                      <div className="grid gap-3">
                        {[
                          { plan: 'free', name: 'Free', price: '$0', credits: '5/day' },
                          { plan: 'pro', name: 'Pro', price: '$4.99/mo', credits: '100/month' },
                          { plan: 'unlimited', name: 'Unlimited', price: '$9.99/mo', credits: '∞ Unlimited' },
                        ].map((p) => (
                          <div 
                            key={p.plan}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              currentPlan === p.plan 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : 'border-white/10 bg-card'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{p.name}</span>
                              {currentPlan === p.plan && (
                                <span className="px-2 py-0.5 rounded text-xs bg-purple-500 text-white">Current</span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{p.price}</div>
                              <div className="text-xs text-muted-foreground">{p.credits}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => navigate('/pricing')}
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        View full comparison
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t('settings.preferences')}</h2>
                    
                    {/* Theme Settings */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Palette size={20} />
                          {t('settings.theme')}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'dark'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Moon size={24} className="mx-auto mb-2" weight={theme === 'dark' ? 'fill' : 'regular'} />
                            <p className="text-sm font-medium">{t('settings.darkMode')}</p>
                          </button>
                          <button
                            onClick={() => setTheme('cyber')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'cyber'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Lightning size={24} className="mx-auto mb-2" weight={theme === 'cyber' ? 'fill' : 'regular'} />
                            <p className="text-sm font-medium">{t('settings.cyberMode')}</p>
                          </button>
                          <button
                            onClick={() => setTheme('minimal')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'minimal'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Sun size={24} className="mx-auto mb-2" weight={theme === 'minimal' ? 'fill' : 'regular'} />
                            <p className="text-sm font-medium">{t('settings.minimalMode')}</p>
                          </button>
                        </div>
                      </div>

                      {/* Language Settings */}
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Globe size={20} />
                          {t('settings.language')}
                        </h3>
                        <select
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value)
                            toast.success(t('settings.languageChanged'))
                          }}
                          className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="ar">{t('common.arabic')}</option>
                          <option value="en">{t('common.english')}</option>
                          <option value="both">{t('common.both')}</option>
                        </select>
                      </div>

                      {/* Notifications */}
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Bell size={20} />
                          {t('settings.notifications')}
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-background rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <EnvelopeSimple size={20} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium">{t('settings.emailNotifications')}</p>
                                <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-sky-500"></div>
                            </div>
                          </label>

                          <label className="flex items-center justify-between p-3 bg-background rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <Bell size={20} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium">{t('settings.pushNotifications')}</p>
                                <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={pushNotifications}
                                onChange={(e) => setPushNotifications(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-sky-500"></div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t('settings.privacySecurity')}</h2>
                    
                    <div className="space-y-4">
                      {/* Privacy Info */}
                      <div className="bg-background rounded-lg p-4 border border-white/10">
                        <div className="flex items-start gap-3">
                          <Shield size={24} className="text-purple-500 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-2">{t('settings.privacyInfo')}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {t('settings.privacyDesc')}
                            </p>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" weight="fill" />
                                <span>{t('settings.privacyPoints.ssl')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" weight="fill" />
                                <span>{t('settings.privacyPoints.noShare')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" weight="fill" />
                                <span>{t('settings.privacyPoints.deleteAnytime')}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Data Download */}
                      <div className="p-4 bg-background rounded-lg border border-white/10">
                        <h3 className="font-semibold mb-2">{t('settings.downloadData')}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('settings.downloadDataDesc')}
                        </p>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                          {t('common.requestData')}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t('settings.accountManagement')}</h2>
                    
                    <div className="space-y-4">
                      {/* Account Info */}
                      <div className="bg-background rounded-lg p-4 border border-white/10">
                        <h3 className="font-semibold mb-3">{t('settings.accountInfo')}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('settings.accountType')}:</span>
                            <span className="font-medium">{t('settings.googleAccount')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('settings.status')}:</span>
                            <span className="flex items-center gap-1 text-green-500">
                              <CheckCircle size={16} weight="fill" />
                              {t('common.active')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('settings.created')}:</span>
                            <span className="font-medium">
                              {user?.metadata?.creationTime ? 
                                new Date(user.metadata.creationTime).toLocaleDateString('en-US') : 
                                t('settings.notAvailable')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="p-4 bg-background rounded-lg border border-white/10">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <SignOut size={20} />
                          {t('common.signOut')}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('settings.signOutDesc')}
                        </p>
                        <button
                          onClick={handleSignOut}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          {t('common.signOut')}
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-500">
                          <Trash size={20} />
                          {t('settings.deleteAccount')}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('settings.deleteAccountDesc')}
                        </p>
                        <button
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          {t('settings.deleteAccountPermanently')}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                <Trash size={24} />
                {t('settings.deleteConfirmTitle')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                {t('settings.deleteConfirmDesc')}
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{t('settings.deleteConfirmItems.personalInfo')}</li>
                  <li>{t('settings.deleteConfirmItems.preferences')}</li>
                  <li>{t('settings.deleteConfirmItems.history')}</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('settings.yesDeleteAccount')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
