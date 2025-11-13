import { useState, useRef, useEffect } from 'react'
import { ChatCircleDots, X, PaperPlaneRight, Sparkle, MagnifyingGlass } from '@phosphor-icons/react'

type ChatMode = 'chat' | 'finder'

export default function FloatingChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('chat')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: '👋 Hey! Need help finding a tool?' }
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
      const response = getSimulatedResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('image') && lowerQuery.includes('text')) {
      return '🖼️ You can use our **Image to Text (OCR)** tool to extract text from images! Just upload an image and the tool will automatically detect and extract any text.'
    }
    if (lowerQuery.includes('compress') || lowerQuery.includes('reduce size')) {
      return '📦 We have several compression tools:\n\n• **Image Compressor** - Reduce image file sizes\n• **Image Compressor v2** - Advanced compression options\n\nBoth work completely in your browser!'
    }
    if (lowerQuery.includes('password')) {
      return '🔑 Try our **Password Generator** for secure random passwords, or **Secure Password Generator Pro** for advanced options with strength checking!'
    }
    if (lowerQuery.includes('qr')) {
      return '📱 Use our **QR Code Generator** to create QR codes from text or URLs instantly. You can download them as PNG images!'
    }
    if (lowerQuery.includes('ai') || lowerQuery.includes('smart')) {
      return '🤖 We have 9 AI-powered tools:\n\n• Text Summarizer\n• Paragraph Rewriter\n• Code Formatter\n• Image Caption Generator\n• Chat Assistant\n• Grammar Corrector\n• Translator\n• Email Writer\n• Hashtag Generator'
    }
    
    return '💡 I can help you find the right tool! Try asking about specific tasks like "convert JSON to CSV" or "generate a random quote".'
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
                  placeholder="Ask about tools..."
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
