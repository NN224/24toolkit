import { useState, useRef, useEffect } from 'react'
import { ChatCircleDots, X, PaperPlaneRight, Sparkle, MagnifyingGlass } from '@phosphor-icons/react'
import { TOOLKIT_INFO, TOOL_CATEGORIES, CONTACT_INFO, FAQ } from '@/lib/chatbot-knowledge'

type ChatMode = 'chat' | 'finder'

export default function FloatingChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('chat')
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
    
    setTimeout(() => {
      const response = getSmartResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800)
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
        ? `📧 **للتواصل معنا:**\n\n• البريد: support@24toolkit.com\n• Twitter: @24Toolkit\n• صفحة التواصل: /contact\n\nنحن هنا لمساعدتك! 💙`
        : `📧 **Contact Us:**\n\n• Email: support@24toolkit.com\n• Twitter: @24Toolkit\n• Contact Page: /contact\n\nWe're here to help! 💙`
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

    // Default helpful response
    return lang === 'ar'
      ? `💡 **يمكنني مساعدتك!**\n\nجرّب أن تسأل عن:\n• أداة معينة (مثل: "مترجم", "ضاغط صور")\n• فئة أدوات (مثل: "أدوات الذكاء الاصطناعي")\n• مهمة محددة (مثل: "كيف أحول صورة لنص")\n• الخدمات والأسعار\n• التواصل والدعم\n\nأنا هنا لمساعدتك! 😊`
      : `💡 **I can help you!**\n\nTry asking about:\n• Specific tool (e.g., "translator", "image compressor")\n• Tool category (e.g., "AI tools")\n• Specific task (e.g., "how to convert image to text")\n• Services and pricing\n• Contact and support\n\nI'm here to help! 😊`
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
                  <h3 className="font-semibold text-white">Tool Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
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
