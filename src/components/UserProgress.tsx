import { useState, useEffect } from 'react';
import { Trophy, Target, Flame, TrendUp, X, Sparkle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ToolUsageStats {
  toolsUsed: Set<string>;
  totalUsageCount: number;
  lastUsedDate: string;
  streakDays: number;
  achievements: string[];
}

interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: any;
  requirement: number;
  unlocked: boolean;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_tool',
    titleKey: 'progress.achievements.firstTool.title',
    descriptionKey: 'progress.achievements.firstTool.description',
    icon: Sparkle,
    requirement: 1,
    unlocked: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'explorer',
    titleKey: 'progress.achievements.explorer.title',
    descriptionKey: 'progress.achievements.explorer.description',
    icon: Target,
    requirement: 5,
    unlocked: false,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'enthusiast',
    titleKey: 'progress.achievements.enthusiast.title',
    descriptionKey: 'progress.achievements.enthusiast.description',
    icon: TrendUp,
    requirement: 15,
    unlocked: false,
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'power_user',
    titleKey: 'progress.achievements.powerUser.title',
    descriptionKey: 'progress.achievements.powerUser.description',
    icon: Flame,
    requirement: 30,
    unlocked: false,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'master',
    titleKey: 'progress.achievements.master.title',
    descriptionKey: 'progress.achievements.master.description',
    icon: Trophy,
    requirement: 50,
    unlocked: false,
    color: 'from-purple-500 to-indigo-500'
  }
];

const TOTAL_TOOLS = 80;

export function UserProgress() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<ToolUsageStats>({
    toolsUsed: new Set<string>(),
    totalUsageCount: 0,
    lastUsedDate: new Date().toISOString().split('T')[0],
    streakDays: 0,
    achievements: []
  });
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('user-progress');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        ...parsed,
        toolsUsed: new Set(parsed.toolsUsed || [])
      });
    }
  }, []);

  // Listen for tool usage events
  useEffect(() => {
    const handleToolUsed = (event: CustomEvent) => {
      const toolName = event.detail.toolName;
      
      setStats(prevStats => {
        const newToolsUsed = new Set(prevStats.toolsUsed);
        const isNewTool = !newToolsUsed.has(toolName);
        newToolsUsed.add(toolName);

        const today = new Date().toISOString().split('T')[0];
        let newStreakDays = prevStats.streakDays;

        // Calculate streak
        if (prevStats.lastUsedDate) {
          const lastDate = new Date(prevStats.lastUsedDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreakDays += 1;
          } else if (diffDays > 1) {
            newStreakDays = 1;
          }
        } else {
          newStreakDays = 1;
        }

        const newStats = {
          toolsUsed: newToolsUsed,
          totalUsageCount: prevStats.totalUsageCount + 1,
          lastUsedDate: today,
          streakDays: newStreakDays,
          achievements: prevStats.achievements
        };

        // Check for new achievements
        if (isNewTool) {
          checkAchievements(newToolsUsed.size, newStats);
        }

        // Save to localStorage
        localStorage.setItem('user-progress', JSON.stringify({
          ...newStats,
          toolsUsed: Array.from(newStats.toolsUsed)
        }));

        return newStats;
      });
    };

    window.addEventListener('tool-used', handleToolUsed as EventListener);
    return () => window.removeEventListener('tool-used', handleToolUsed as EventListener);
  }, []);

  const checkAchievements = (toolCount: number, currentStats: ToolUsageStats) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (
        toolCount >= achievement.requirement &&
        !currentStats.achievements.includes(achievement.id)
      ) {
        // Unlock achievement
        const newAchievements = [...currentStats.achievements, achievement.id];
        setStats(prev => ({ ...prev, achievements: newAchievements }));
        
        // Show achievement notification
        setNewAchievement({ ...achievement, unlocked: true });
        
        // Auto-hide after 5 seconds
        setTimeout(() => setNewAchievement(null), 5000);

        // Update localStorage
        const savedStats = localStorage.getItem('user-progress');
        if (savedStats) {
          const parsed = JSON.parse(savedStats);
          localStorage.setItem('user-progress', JSON.stringify({
            ...parsed,
            achievements: newAchievements
          }));
        }
      }
    });
  };

  const progress = (stats.toolsUsed.size / TOTAL_TOOLS) * 100;

  const achievementList = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: stats.achievements.includes(achievement.id)
  }));

  return (
    <>
      {/* Progress Button - positioned to avoid sidebar on desktop (lg:left-24 = 96px, sidebar is 80px) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-24 z-40 bg-gradient-to-r from-purple-600 to-sky-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        style={{ boxShadow: '0 0 30px rgba(109,40,217,0.5)' }}
        aria-label={t('progress.viewProgress')}
      >
        <Trophy size={20} weight="fill" className="sm:w-6 sm:h-6" />
        {stats.toolsUsed.size > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
            {stats.toolsUsed.size}
          </span>
        )}
      </button>

      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="fixed top-4 sm:top-6 left-4 sm:left-6 lg:left-24 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm"
          >
            <div className={`bg-gradient-to-r ${newAchievement.color} p-1 rounded-xl shadow-2xl`}>
              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`bg-gradient-to-r ${newAchievement.color} p-3 rounded-lg`}>
                    <newAchievement.icon size={24} className="text-white" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {t('progress.achievementUnlocked')}
                    </p>
                    <h4 className="text-lg font-bold text-foreground">{t(newAchievement.titleKey)}</h4>
                  </div>
                  <button
                    onClick={() => setNewAchievement(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{t(newAchievement.descriptionKey)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="glass-card m-4 p-6 md:p-8 rounded-2xl border border-border/50">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold gradient-text">{t('progress.title')}</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Overall Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">{t('progress.toolsExplored')}</span>
                    <span className="text-sm font-bold text-foreground">
                      {stats.toolsUsed.size} / {TOTAL_TOOLS}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-card-foreground/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-purple-600 to-sky-500 rounded-full"
                      style={{ boxShadow: '0 0 20px rgba(109,40,217,0.5)' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {progress.toFixed(1)}% {t('progress.complete')}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-600/20 to-sky-500/20 p-4 rounded-xl border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Target size={20} className="text-purple-400" weight="fill" />
                      <span className="text-xs text-muted-foreground font-medium">{t('progress.totalUses')}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalUsageCount}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-600/20 to-red-500/20 p-4 rounded-xl border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame size={20} className="text-orange-400" weight="fill" />
                      <span className="text-xs text-muted-foreground font-medium">{t('progress.dayStreak')}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.streakDays} {t('progress.days')}</p>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trophy size={24} className="text-yellow-500" weight="fill" />
                    {t('progress.achievementsTitle')}
                  </h3>
                  <div className="space-y-3">
                    {achievementList.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border transition-all ${
                          achievement.unlocked
                            ? `bg-gradient-to-r ${achievement.color} bg-opacity-10 border-opacity-50`
                            : 'bg-card/50 border-border/30 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-lg ${
                              achievement.unlocked
                                ? `bg-gradient-to-r ${achievement.color}`
                                : 'bg-card-foreground/10'
                            }`}
                          >
                            <achievement.icon
                              size={24}
                              weight="fill"
                              className={achievement.unlocked ? 'text-white' : 'text-muted-foreground'}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{t(achievement.titleKey)}</h4>
                            <p className="text-sm text-muted-foreground">{t(achievement.descriptionKey)}</p>
                          </div>
                          {achievement.unlocked ? (
                            <span className="text-green-500 font-bold text-sm">✓</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {stats.toolsUsed.size}/{achievement.requirement}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('progress.keepExploring')}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper function to track tool usage
export function trackToolUsage(toolName: string) {
  const event = new CustomEvent('tool-used', {
    detail: { toolName }
  });
  window.dispatchEvent(event);
}
