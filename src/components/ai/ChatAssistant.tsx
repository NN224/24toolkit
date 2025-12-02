import { useState, useRef, useEffect } from 'react'
import { ChatCircleDots, X, PaperPlaneRight, Sparkle, MagnifyingGlass, Robot } from '@phosphor-icons/react'
import { TOOLKIT_INFO, TOOL_CATEGORIES, CONTACT_INFO, FAQ } from '@/lib/chatbot-knowledge'
import { callAI } from '@/lib/ai'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

type ChatMode = 'chat' | 'finder'

// Build comprehensive context about 24Toolkit for AI
const buildToolsContext = () => {
  // Build tools list organized by category
  const toolsByCategory = Object.entries(TOOL_CATEGORIES).map(([key, cat]) => {
    const toolsList = cat.tools.map(t => 
      `  • ${t.name} (${t.nameAr}): ${t.description.en} | ${t.description.ar} | Path: ${t.path}`
    ).join('\n')
    return `${cat.name.en} (${cat.name.ar}):\n${toolsList}`
  }).join('\n\n')
  
  // Build FAQ
  const faqList = FAQ.en.map((f, i) => 
    `Q: ${f.q}\nA: ${f.a}`
  ).join('\n\n')
  
  return `أنت المساعد الذكي لموقع 24Toolkit. أنت تفهم العربية والإنجليزية بشكل ممتاز.

## عن 24Toolkit:
${TOOLKIT_INFO.description.ar}
${TOOLKIT_INFO.description.en}

## الميزات:
- 80+ أداة مجانية 100%
- بدون تسجيل أو اشتراك
- جميع الأدوات تعمل في المتصفح (خصوصية كاملة)
- لا نرسل بياناتك لأي خادم
- يعمل بدون إنترنت بعد التحميل الأول
- متوافق مع الهواتف والأجهزة اللوحية

## الأدوات المتاحة:
${toolsByCategory}

## معلومات التواصل:
- البريد: support@24toolkit.com
- Twitter: @24Toolkit
- صفحة التواصل: /contact
- صفحة عنا: /about
- سياسة الخصوصية: /privacy-policy

## الأسئلة الشائعة:
${faqList}

## تعليمات الرد:
1. رد بنفس لغة المستخدم (عربي أو إنجليزي)
2. كن مختصراً ومفيداً
3. عند اقتراح أداة، اذكر اسمها ومسارها
4. استخدم emojis باعتدال لتحسين القراءة
5. إذا سأل عن أداة غير موجودة، اقترح البدائل المتاحة
6. إذا سأل سؤال خارج نطاق الموقع، أجب بلطف أنك متخصص في مساعدته باستخدام أدوات 24Toolkit`
}

export default function FloatingChatAssistant() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('chat')
  const [useAI, setUseAI] = useState(false) // Toggle for AI mode
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: '👋 مرحباً! أنا مساعدك الذكي في 24Toolkit.\n\nكيف يمكنني مساعدتك اليوم؟ 🚀\n\nيمكنني:\n• مساعدتك في إيجاد الأداة المناسبة\n• شرح كيفية استخدام الأدوات\n• الإجابة عن أسئلتك\n• التحدث بالعربي والإنجليزي' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    setIsTyping(true)
    
    if (useAI) {
      // Use real AI
      try {
        const context = buildToolsContext()
        const conversationHistory = messages.slice(-6).map(m => 
          `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
        ).join('\n')
        
        const prompt = `${context}\n\nConversation History:\n${conversationHistory}\n\nUser: ${userMessage}\n\nAssistant:`
        
        let response = ''
        await callAI(prompt, 'anthropic', (text) => {
          response = text
        })
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
      } catch (error) {
        console.error('AI Chat error:', error)
        // Fallback to smart response
        const fallbackResponse = getSmartResponse(userMessage)
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse + '\n\n⚠️ (AI unavailable, using quick response)' }])
      }
    } else {
      // Use local smart response
      setTimeout(() => {
        const response = getSmartResponse(userMessage)
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
      }, 400)
    }
    
    setIsTyping(false)
  }

  const detectLanguage = (text: string): 'ar' | 'en' => {
    const arabicPattern = /[\u0600-\u06FF]/
    return arabicPattern.test(text) ? 'ar' : 'en'
  }

  const getSmartResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    const lang = detectLanguage(query)
    
    // Greeting detection
    const greetingsEn = ['hi', 'hello', 'hey', 'good morning', 'good evening']
    const greetingsAr = ['مرحبا', 'السلام', 'أهلا', 'هلا', 'صباح', 'مساء']
    
    if (greetingsEn.some(g => lowerQuery.includes(g)) || greetingsAr.some(g => query.includes(g))) {
      return lang === 'ar' 
        ? '👋 أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟\n\n💡 يمكنني مساعدتك في:\n• إيجاد الأداة المناسبة\n• شرح استخدام الأدوات\n• الإجابة عن الأسئلة\n• معلومات عن الخدمات'
        : '👋 Hello! How can I help you today?\n\n💡 I can help you with:\n• Finding the right tool\n• Explaining how tools work\n• Answering questions\n• Service information'
    }

    // Contact & Support
    const contactKeywords = ['contact', 'email', 'support', 'help', 'reach', 'تواصل', 'دعم', 'مساعدة', 'إيميل', 'بريد']
    if (contactKeywords.some(k => lowerQuery.includes(k) || query.includes(k))) {
      return lang === 'ar'
        ? `📧 **${t('tools.chatAssistant.contactUs')}**\n\n• ${t('tools.chatAssistant.contactEmail')}\n• ${t('tools.chatAssistant.contactTwitter')}\n• ${t('tools.chatAssistant.contactPage')}\n\n${t('tools.chatAssistant.weAreHere')}`
        : `📧 **${t('tools.chatAssistant.contactUs')}**\n\n• ${t('tools.chatAssistant.contactEmail')}\n• ${t('tools.chatAssistant.contactTwitter')}\n• ${t('tools.chatAssistant.contactPage')}\n\n${t('tools.chatAssistant.weAreHere')}`
    }

    // Services & Features
    const serviceKeywords = ['service', 'feature', 'what', 'tools', 'offer', 'خدمة', 'خدمات', 'ميزة', 'أدوات', 'تقدم', 'شو', 'ايش']
    if (serviceKeywords.some(k => lowerQuery.includes(k) || query.includes(k))) {
      return lang === 'ar'
        ? `✨ **خدمات 24Toolkit:**\n\n🎯 **80+ أداة مجانية:**\n• أدوات الذكاء الاصطناعي (9 أدوات)\n• أدوات الأمان (4 أدوات)\n• الآلات الحاسبة (6 أدوات)\n• أدوات الصور (9 أدوات)\n• أدوات النصوص (4 أدوات)\n• أدوات المطورين (5 أدوات)\n• أدوات الإنتاجية (4 أدوات)\n\n✅ **مميزات:**\n• مجاني 100%\n• بدون تسجيل\n• خصوصية كاملة\n• يعمل بدون إنترنت\n• سريع وآمن\n\nاسألني عن أي فئة! 🚀`
        : `✨ **24Toolkit Services:**\n\n🎯 **80+ Free Tools:**\n• AI Tools (9 tools)\n• Security Tools (4 tools)\n• Calculators (6 tools)\n• Image Tools (9 tools)\n• Text Tools (4 tools)\n• Developer Tools (5 tools)\n• Productivity Tools (4 tools)\n\n✅ **Features:**\n• 100% Free\n• No signup required\n• Full privacy\n• Works offline\n• Fast & secure\n\nAsk me about any category! 🚀`
    }

    // Pricing
    const pricingKeywords = ['free', 'price', 'cost', 'pay', 'subscription', 'مجاني', 'سعر', 'مدفوع', 'اشتراك', 'فلوس']
    if (pricingKeywords.some(k => lowerQuery.includes(k) || query.includes(k))) {
      return lang === 'ar'
        ? '💯 **نعم، مجاني 100%!**\n\n✅ جميع الأدوات مجانية تماماً\n✅ بدون رسوم خفية\n✅ بدون اشتراكات\n✅ بدون تسجيل\n\nاستخدم كل ما تريد، متى تريد! 🎉'
        : '💯 **Yes, 100% Free!**\n\n✅ All tools completely free\n✅ No hidden fees\n✅ No subscriptions\n✅ No signup required\n\nUse as much as you want, whenever you want! 🎉'
    }

    // Privacy & Security
    const privacyKeywords = ['privacy', 'secure', 'safe', 'data', 'خصوصية', 'أمان', 'آمن', 'بيانات']
    if (privacyKeywords.some(k => lowerQuery.includes(k) || query.includes(k))) {
      return lang === 'ar'
        ? '🔒 **خصوصيتك مضمونة 100%!**\n\n✅ جميع الأدوات تعمل محلياً في متصفحك\n✅ لا نرسل بياناتك لخوادمنا أبداً\n✅ لا نحفظ أي معلومات شخصية\n✅ لا نستخدم cookies تتبع\n\nبياناتك تبقى عندك! 🛡️'
        : '🔒 **Your Privacy is 100% Safe!**\n\n✅ All tools run locally in your browser\n✅ We never send your data to our servers\n✅ No personal information stored\n✅ No tracking cookies\n\nYour data stays with you! 🛡️'
    }

    // Search for specific tools
    let foundTools: any[] = []
    Object.values(TOOL_CATEGORIES).forEach(category => {
      category.tools.forEach(tool => {
        const matchesKeyword = tool.keywords.some(keyword => 
          lowerQuery.includes(keyword.toLowerCase())
        )
        const matchesName = lowerQuery.includes(tool.name.toLowerCase()) || 
                           query.includes(tool.nameAr)
        
        if (matchesKeyword || matchesName) {
          foundTools.push({ ...tool, category: category.name })
        }
      })
    })

    if (foundTools.length > 0) {
      const tool = foundTools[0]
      const desc = lang === 'ar' ? tool.description.ar : tool.description.en
      const toolName = lang === 'ar' ? tool.nameAr : tool.name
      
      let response = lang === 'ar'
        ? `✅ **وجدت الأداة المناسبة!**\n\n🔧 **${toolName}**\n${desc}\n\n📍 الرابط: ${tool.path}\n\n`
        : `✅ **Found the perfect tool!**\n\n🔧 **${toolName}**\n${desc}\n\n📍 Link: ${tool.path}\n\n`

      if (foundTools.length > 1) {
        response += lang === 'ar'
          ? `\n💡 أدوات أخرى ذات صلة:\n${foundTools.slice(1, 3).map(t => `• ${lang === 'ar' ? t.nameAr : t.name}`).join('\n')}`
          : `\n💡 Other related tools:\n${foundTools.slice(1, 3).map(t => `• ${t.name}`).join('\n')}`
      }
      
      return response
    }

    // AI Tools category
    if (lowerQuery.includes('ai') || lowerQuery.includes('ذكاء') || lowerQuery.includes('smart')) {
      const aiTools = TOOL_CATEGORIES.ai.tools
      return lang === 'ar'
        ? `🤖 **أدوات الذكاء الاصطناعي (${aiTools.length} أدوات):**\n\n${aiTools.slice(0, 5).map(t => `• ${t.nameAr} - ${t.description.ar}`).join('\n')}\n\n...والمزيد! اسألني عن أداة محددة 🚀`
        : `🤖 **AI Tools (${aiTools.length} tools):**\n\n${aiTools.slice(0, 5).map(t => `• ${t.name} - ${t.description.en}`).join('\n')}\n\n...and more! Ask me about a specific tool 🚀`
    }

    // Image tools category
    if (lowerQuery.includes('image') || lowerQuery.includes('photo') || lowerQuery.includes('صور') || lowerQuery.includes('صورة')) {
      const imageTools = TOOL_CATEGORIES.image.tools
      return lang === 'ar'
        ? `🖼️ **أدوات الصور (${imageTools.length} أدوات):**\n\n${imageTools.map(t => `• ${t.nameAr} - ${t.description.ar}\n  📍 ${t.path}`).join('\n\n')}`
        : `🖼️ **Image Tools (${imageTools.length} tools):**\n\n${imageTools.map(t => `• ${t.name} - ${t.description.en}\n  📍 ${t.path}`).join('\n\n')}`
    }

    // Security tools category  
    if (lowerQuery.includes('security') || lowerQuery.includes('password') || lowerQuery.includes('أمان') || lowerQuery.includes('كلمة مرور') || lowerQuery.includes('باسورد')) {
      const securityTools = TOOL_CATEGORIES.security.tools
      return lang === 'ar'
        ? `🔐 **أدوات الأمان (${securityTools.length} أدوات):**\n\n${securityTools.map(t => `• ${t.nameAr} - ${t.description.ar}\n  📍 ${t.path}`).join('\n\n')}`
        : `🔐 **Security Tools (${securityTools.length} tools):**\n\n${securityTools.map(t => `• ${t.name} - ${t.description.en}\n  📍 ${t.path}`).join('\n\n')}`
    }

    // Calculator tools category
    if (lowerQuery.includes('calculator') || lowerQuery.includes('calculate') || lowerQuery.includes('حاسب') || lowerQuery.includes('احسب')) {
      const calcTools = TOOL_CATEGORIES.calculators.tools
      return lang === 'ar'
        ? `🔢 **الآلات الحاسبة (${calcTools.length} أدوات):**\n\n${calcTools.map(t => `• ${t.nameAr} - ${t.description.ar}\n  📍 ${t.path}`).join('\n\n')}`
        : `🔢 **Calculators (${calcTools.length} tools):**\n\n${calcTools.map(t => `• ${t.name} - ${t.description.en}\n  📍 ${t.path}`).join('\n\n')}`
    }

    // Developer tools category
    if (lowerQuery.includes('developer') || lowerQuery.includes('code') || lowerQuery.includes('مطور') || lowerQuery.includes('كود') || lowerQuery.includes('برمج')) {
      const devTools = TOOL_CATEGORIES.developer.tools
      return lang === 'ar'
        ? `💻 **أدوات المطورين (${devTools.length} أدوات):**\n\n${devTools.map(t => `• ${t.nameAr} - ${t.description.ar}\n  📍 ${t.path}`).join('\n\n')}`
        : `💻 **Developer Tools (${devTools.length} tools):**\n\n${devTools.map(t => `• ${t.name} - ${t.description.en}\n  📍 ${t.path}`).join('\n\n')}`
    }

    // All tools / list tools
    if (lowerQuery.includes('all tools') || lowerQuery.includes('list') || lowerQuery.includes('كل الأدوات') || lowerQuery.includes('قائمة') || lowerQuery.includes('جميع')) {
      const categories = Object.values(TOOL_CATEGORIES)
      const totalTools = categories.reduce((sum, cat) => sum + cat.tools.length, 0)
      return lang === 'ar'
        ? `📋 **جميع فئات الأدوات (${totalTools}+ أداة):**\n\n${categories.map(cat => `**${cat.name.ar}** (${cat.tools.length})\n${cat.tools.slice(0, 3).map(t => `  • ${t.nameAr}`).join('\n')}${cat.tools.length > 3 ? '\n  • ...' : ''}`).join('\n\n')}\n\n💡 اسألني عن أي فئة للتفاصيل!`
        : `📋 **All Tool Categories (${totalTools}+ tools):**\n\n${categories.map(cat => `**${cat.name.en}** (${cat.tools.length})\n${cat.tools.slice(0, 3).map(t => `  • ${t.name}`).join('\n')}${cat.tools.length > 3 ? '\n  • ...' : ''}`).join('\n\n')}\n\n💡 Ask me about any category for details!`
    }

    // How to use / tutorial
    if (lowerQuery.includes('how') || lowerQuery.includes('tutorial') || lowerQuery.includes('كيف') || lowerQuery.includes('شرح') || lowerQuery.includes('استخدام')) {
      return lang === 'ar'
        ? `📖 **كيفية استخدام 24Toolkit:**\n\n1️⃣ اختر الأداة من القائمة أو ابحث عنها\n2️⃣ افتح صفحة الأداة\n3️⃣ أدخل بياناتك\n4️⃣ اضغط على زر المعالجة\n5️⃣ احصل على النتيجة!\n\n✨ **نصائح:**\n• جميع الأدوات تعمل في المتصفح\n• بياناتك لا تُرسل لأي خادم\n• يمكنك استخدام الأدوات بدون تسجيل\n\n💡 هل تريد مساعدة في أداة محددة؟`
        : `📖 **How to use 24Toolkit:**\n\n1️⃣ Choose a tool from the menu or search\n2️⃣ Open the tool page\n3️⃣ Enter your data\n4️⃣ Click the process button\n5️⃣ Get your result!\n\n✨ **Tips:**\n• All tools run in your browser\n• Your data never leaves your device\n• No signup needed\n\n💡 Need help with a specific tool?`
    }

    // Thanks / appreciation
    if (lowerQuery.includes('thank') || lowerQuery.includes('شكر') || lowerQuery.includes('ممتاز') || lowerQuery.includes('رائع') || lowerQuery.includes('great') || lowerQuery.includes('awesome')) {
      return lang === 'ar'
        ? '🙏 **شكراً لك!** سعيد بمساعدتك!\n\nإذا احتجت أي شيء آخر، أنا هنا! 😊\n\n⭐ إذا أعجبك الموقع، شاركه مع أصدقائك!'
        : '🙏 **Thank you!** Happy to help!\n\nIf you need anything else, I\'m here! 😊\n\n⭐ If you like the site, share it with friends!'
    }

    // Default helpful response
    return lang === 'ar'
      ? `💡 **يمكنني مساعدتك!**\n\nجرّب أن تسأل عن:\n• أداة معينة (مثل: "مترجم", "ضاغط صور")\n• فئة أدوات (مثل: "أدوات الذكاء الاصطناعي", "أدوات الصور")\n• مهمة محددة (مثل: "كيف أحول صورة لنص")\n• الخدمات والأسعار\n• التواصل والدعم\n\n🤖 **نصيحة:** فعّل "AI Mode" للحصول على إجابات أذكى!`
      : `💡 **I can help you!**\n\nTry asking about:\n• Specific tool (e.g., "translator", "image compressor")\n• Tool category (e.g., "AI tools", "image tools")\n• Specific task (e.g., "how to convert image to text")\n• Services and pricing\n• Contact and support\n\n🤖 **Tip:** Enable "AI Mode" for smarter responses!`
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-3rem)] z-[9999]">
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-accent/30"
            style={{ boxShadow: '0 0 20px rgba(109,40,217,0.4)' }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-sky-500 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkle size={20} weight="fill" className="text-white" />
                  <h3 className="font-semibold text-white">{t('chatAssistant.title')}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUseAI(!useAI)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      useAI
                        ? 'bg-white text-purple-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title={useAI ? 'AI Mode ON - Uses credits' : 'AI Mode OFF - Quick responses'}
                  >
                    <Robot size={14} weight="fill" />
                    AI {useAI ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('chat')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    mode === 'chat'
                      ? 'bg-white text-purple-600'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  style={mode === 'chat' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {}}
                >
                  <ChatCircleDots size={16} weight="fill" className="inline mr-2" />
                  Chat
                </button>
                <button
                  onClick={() => setMode('finder')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    mode === 'finder'
                      ? 'bg-white text-purple-600'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  style={mode === 'finder' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } : {}}
                >
                  <MagnifyingGlass size={16} weight="bold" className="inline mr-2" />
                  Tool Finder
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-[#0a0f1e]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white'
                        : 'bg-card/50 text-foreground border border-white/10'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card/50 px-5 py-3 rounded-2xl border border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0a0f1e]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اسأل عن الأدوات... / Ask about tools..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-gradient-to-r from-purple-600 to-sky-500 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: '0 2px 10px rgba(109,40,217,0.3)' }}
                >
                  <PaperPlaneRight size={20} weight="fill" className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-sky-500 rounded-full flex items-center justify-center z-[9999]"
        style={{ boxShadow: '0 0 20px rgba(109,40,217,0.5)' }}
      >
        {isOpen ? (
          <X size={28} weight="bold" className="text-white" />
        ) : (
          <ChatCircleDots size={28} weight="fill" className="text-white" />
        )}
      </button>
    </>
  )
}
