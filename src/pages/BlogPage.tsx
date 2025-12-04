import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarBlank, Clock, ArrowRight, User } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  lang: 'en' | 'ar'
}

const blogPosts: BlogPost[] = [
  {
    id: 'ai-tools-productivity-2025',
    title: 'How AI Tools Are Revolutionizing Productivity in 2025',
    excerpt: 'Discover how artificial intelligence is transforming the way we work. From automated text summarization to intelligent code formatting, AI tools are making complex tasks simpler than ever before.',
    author: 'Sarah Johnson',
    date: '2025-12-01',
    readTime: '5 min read',
    category: 'AI & Technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    lang: 'en'
  },
  {
    id: 'image-optimization-guide',
    title: 'The Complete Guide to Image Optimization for Web',
    excerpt: 'Learn the best practices for compressing and optimizing images without losing quality. This guide covers formats, compression techniques, and tools to make your website faster.',
    author: 'Mike Chen',
    date: '2025-11-28',
    readTime: '7 min read',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    lang: 'en'
  },
  {
    id: 'online-security-tips-ar',
    title: 'نصائح ذهبية لحماية خصوصيتك على الإنترنت',
    excerpt: 'في عصر التكنولوجيا، أصبحت حماية البيانات الشخصية أمراً ضرورياً. تعرف على أفضل الممارسات لتأمين حساباتك وكلمات المرور وحماية معلوماتك الحساسة من الاختراق.',
    author: 'أحمد محمد',
    date: '2025-11-25',
    readTime: '٦ دقائق للقراءة',
    category: 'الأمن الرقمي',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
    lang: 'ar'
  },
  {
    id: 'free-tools-entrepreneurs-ar',
    title: 'أفضل الأدوات المجانية لرواد الأعمال في ٢٠٢٥',
    excerpt: 'مجموعة شاملة من الأدوات المجانية التي يحتاجها كل رائد أعمال. من تحرير الصور إلى إنشاء المحتوى بالذكاء الاصطناعي، كل ما تحتاجه لإنجاح مشروعك.',
    author: 'سارة العلي',
    date: '2025-11-20',
    readTime: '٨ دقائق للقراءة',
    category: 'ريادة الأعمال',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    lang: 'ar'
  }
]

function BlogCard({ post }: { post: BlogPost }) {
  const isArabic = post.lang === 'ar'
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group card-hover-lift">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-2 sm:top-3 ${isArabic ? 'right-2 sm:right-3' : 'left-2 sm:left-3'}`}>
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs sm:text-sm">
            {post.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <CardTitle 
          className={`text-base sm:text-xl line-clamp-2 group-hover:text-primary transition-colors ${isArabic ? 'text-right' : ''}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        <CardDescription 
          className={`line-clamp-2 sm:line-clamp-3 text-sm ${isArabic ? 'text-right' : ''}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {post.excerpt}
        </CardDescription>
        
        <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-1 sm:gap-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <User size={12} className="sm:w-[14px] sm:h-[14px]" />
            <span className="truncate max-w-[100px] sm:max-w-none">{post.author}</span>
          </div>
          <div className={`flex items-center gap-1 sm:gap-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <CalendarBlank size={12} className="sm:w-[14px] sm:h-[14px]" />
            <span>{new Date(post.date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground ${isArabic ? 'flex-row-reverse' : ''}`}>
          <Clock size={12} className="sm:w-[14px] sm:h-[14px]" />
          <span>{post.readTime}</span>
        </div>
        
        <button 
          className={`flex items-center gap-1.5 sm:gap-2 text-primary font-medium hover:underline group/btn text-sm ${isArabic ? 'flex-row-reverse mr-auto' : 'ml-auto'}`}
        >
          <span>{isArabic ? 'اقرأ المزيد' : 'Read More'}</span>
          <ArrowRight 
            size={14} 
            className={`group-hover/btn:translate-x-1 transition-transform sm:w-4 sm:h-4 ${isArabic ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`}
          />
        </button>
      </CardContent>
    </Card>
  )
}

export default function BlogPage() {
  useSEO({
    title: 'Blog - 24Toolkit',
    description: 'Read our latest articles about AI tools, web development, online security, and productivity tips. Available in English and Arabic.',
    keywords: ['blog', 'articles', 'AI tools', 'web development', 'security', 'productivity'],
    canonicalPath: '/blog'
  })
  
  const englishPosts = blogPosts.filter(post => post.lang === 'en')
  const arabicPosts = blogPosts.filter(post => post.lang === 'ar')
  
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3 sm:mb-4 tracking-tight">
            Blog
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and tips to help you get the most out of our tools
          </p>
        </div>

        {/* English Section */}
        <section className="mb-10 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-semibold">Latest Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {englishPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Arabic Section */}
        <section>
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 justify-end" dir="rtl">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-semibold">أحدث المقالات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {arabicPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <div className="mt-10 sm:mt-16 text-center">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="py-8 sm:py-12 px-4 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Stay Updated</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                Get notified when we publish new articles and release exciting new tools.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                Explore Our Tools
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
