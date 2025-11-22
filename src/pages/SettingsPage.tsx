import { useState } from 'react'
import { motion } from 'framer-motion'
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
  EyeSlash
} from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/components/ThemeProvider'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy' | 'account'>('profile')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [language, setLanguage] = useState('en')

  const handleSaveProfile = () => {
    toast.success('تم حفظ التغييرات بنجاح!')
  }

  const handleDeleteAccount = () => {
    if (confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      toast.error('تم إرسال طلب حذف الحساب')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('تم تسجيل الخروج بنجاح')
  }

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'preferences', label: 'التفضيلات', icon: Palette },
    { id: 'privacy', label: 'الخصوصية', icon: Shield },
    { id: 'account', label: 'الحساب', icon: Lock },
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
            الإعدادات
          </h1>
          <p className="text-muted-foreground">
            إدارة حسابك وتفضيلاتك الشخصية
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
                    <h2 className="text-2xl font-bold mb-4">الملف الشخصي</h2>
                    
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
                        <h3 className="text-xl font-semibold">{user?.displayName || 'مستخدم'}</h3>
                        <p className="text-muted-foreground text-sm">{user?.email}</p>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                        <input
                          type="text"
                          defaultValue={user?.displayName || ''}
                          className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                          <span>البريد الإلكتروني</span>
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
                          مرتبط بحساب Google - لا يمكن تغييره
                        </p>
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-lg font-medium hover:opacity-90 transition-all"
                      >
                        حفظ التغييرات
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">التفضيلات</h2>
                    
                    {/* Theme Settings */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Palette size={20} />
                          المظهر
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
                            <p className="text-sm font-medium">داكن</p>
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
                            <p className="text-sm font-medium">سايبر</p>
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
                            <p className="text-sm font-medium">بسيط</p>
                          </button>
                        </div>
                      </div>

                      {/* Language Settings */}
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Globe size={20} />
                          اللغة
                        </h3>
                        <select
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value)
                            toast.success('تم تغيير اللغة')
                          }}
                          className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                          <option value="both">Both / كلاهما</option>
                        </select>
                      </div>

                      {/* Notifications */}
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Bell size={20} />
                          الإشعارات
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-background rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <EnvelopeSimple size={20} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium">إشعارات البريد</p>
                                <p className="text-sm text-muted-foreground">استلام تحديثات عبر البريد الإلكتروني</p>
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
                                <p className="font-medium">الإشعارات الفورية</p>
                                <p className="text-sm text-muted-foreground">إشعارات على سطح المكتب</p>
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
                    <h2 className="text-2xl font-bold mb-4">الخصوصية والأمان</h2>
                    
                    <div className="space-y-4">
                      {/* Privacy Info */}
                      <div className="bg-background rounded-lg p-4 border border-white/10">
                        <div className="flex items-start gap-3">
                          <Shield size={24} className="text-purple-500 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-2">معلومات الخصوصية</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              نحن نحترم خصوصيتك ونحمي بياناتك الشخصية. جميع المعلومات مشفرة وآمنة.
                            </p>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" weight="fill" />
                                <span>بياناتك الشخصية محمية بتشفير SSL</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" weight="fill" />
                                <span>لا نشارك معلوماتك مع أطراف ثالثة</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" weight="fill" />
                                <span>يمكنك حذف حسابك في أي وقت</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Data Download */}
                      <div className="p-4 bg-background rounded-lg border border-white/10">
                        <h3 className="font-semibold mb-2">تحميل بياناتك</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          احصل على نسخة من جميع بياناتك المخزنة لدينا
                        </p>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                          طلب البيانات
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
                    <h2 className="text-2xl font-bold mb-4">إدارة الحساب</h2>
                    
                    <div className="space-y-4">
                      {/* Account Info */}
                      <div className="bg-background rounded-lg p-4 border border-white/10">
                        <h3 className="font-semibold mb-3">معلومات الحساب</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">نوع الحساب:</span>
                            <span className="font-medium">Google Account</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الحالة:</span>
                            <span className="flex items-center gap-1 text-green-500">
                              <CheckCircle size={16} weight="fill" />
                              نشط
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                            <span className="font-medium">
                              {user?.metadata?.creationTime ? 
                                new Date(user.metadata.creationTime).toLocaleDateString('ar') : 
                                'غير متوفر'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="p-4 bg-background rounded-lg border border-white/10">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <SignOut size={20} />
                          تسجيل الخروج
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          سيتم تسجيل خروجك من جميع الأجهزة
                        </p>
                        <button
                          onClick={handleSignOut}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          تسجيل الخروج
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-500">
                          <Trash size={20} />
                          حذف الحساب
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          سيتم حذف جميع بياناتك ولا يمكن التراجع عن هذا الإجراء
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          حذف الحساب نهائياً
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
