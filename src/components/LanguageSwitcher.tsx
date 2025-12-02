import { useTranslation } from 'react-i18next';
import { Globe, Check, Translate } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', nativeName: 'EN', flag: '🇺🇸' },
  { code: 'ar', nativeName: 'ع', flag: '🇸🇦' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl 
                     bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10
                     hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20
                     border border-white/10 hover:border-white/20
                     transition-all duration-300 group cursor-pointer"
          title={t('common.changeLanguage')}
        >
          {/* Animated globe icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Translate 
              weight="duotone" 
              className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" 
            />
          </motion.div>
          
          {/* Current language indicator */}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentLanguage.code}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 
                         bg-clip-text text-transparent"
            >
              {currentLanguage.nativeName}
            </motion.span>
          </AnimatePresence>
          
          {/* Flag */}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentLanguage.flag}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-sm"
            >
              {currentLanguage.flag}
            </motion.span>
          </AnimatePresence>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 
                          group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 
                          blur-xl transition-all duration-500 -z-10" />
        </motion.button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px] p-2 bg-gray-900/95 backdrop-blur-xl border-white/10 rounded-xl"
      >
        {languages.map((lang, index) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              cursor-pointer rounded-lg px-3 py-2.5 my-1
              transition-all duration-200 flex items-center gap-3
              ${i18n.language === lang.code 
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white' 
                : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }
            `}
          >
            {/* Flag with animation */}
            <motion.span 
              className="text-xl"
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              {lang.flag}
            </motion.span>
            
            {/* Language name */}
            <div className="flex flex-col">
              <span className="font-medium">
                {lang.code === 'en' ? t('common.english') : t('common.arabic')}
              </span>
              <span className="text-xs text-gray-500">
                {lang.nativeName}
              </span>
            </div>
            
            {/* Check mark for selected */}
            {i18n.language === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
              >
                <Check weight="bold" className="h-4 w-4 text-indigo-400" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
        
        {/* Decorative gradient line */}
        <div className="mt-2 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent rounded-full" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
