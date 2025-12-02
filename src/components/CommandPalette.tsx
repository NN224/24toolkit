import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { allTools } from '@/lib/tools-data'

export default function CommandPalette() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredTools = allTools.filter(tool =>
    tool.title.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8)

  const handleSelect = (path: string) => {
    navigate(path)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-0 flex items-start justify-center z-[10001] pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl"
            >
              <div 
                className="glass-card rounded-2xl overflow-hidden shadow-2xl border-2 relative"
                style={{
                  borderImage: 'linear-gradient(135deg, rgba(109, 40, 217, 0.5), rgba(56, 189, 248, 0.5)) 1',
                  borderImageSlice: 1,
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.3), rgba(56, 189, 248, 0.3))',
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />

                <div className="relative bg-[#0a0f1e]/95 backdrop-blur-xl">
                  <div className="flex items-center gap-4 p-6 border-b border-white/10">
                    <MagnifyingGlass size={24} className="text-accent" weight="bold" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('components.commandPalette.searchPlaceholder')}
                      className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
                      autoFocus
                    />
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-muted-foreground" />
                    </motion.button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredTools.length > 0 ? (
                      <div className="p-2">
                        {filteredTools.map((tool, index) => {
                          const Icon = tool.icon
                          return (
                            <motion.button
                              key={tool.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              onClick={() => handleSelect(tool.path)}
                              whileHover={{ x: 4 }}
                              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-left group"
                            >
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon size={24} weight="bold" className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                                    {tool.title}
                                  </h3>
                                  {tool.isAI && (
                                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full">
                                      AI
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {tool.description}
                                </p>
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <p className="text-muted-foreground">No tools found</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">↑↓</kbd>
                        <span>{t('components.commandPalette.navigate')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Enter</kbd>
                        <span>{t('components.commandPalette.select')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Esc</kbd>
                        <span>{t('common.close')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
