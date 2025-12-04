import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarBlank, Clock, User, Share, BookmarkSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSEO } from '@/hooks/useSEO'

export default function OnlineSecurityTips() {
  useSEO({
    title: 'نصائح ذهبية لحماية خصوصيتك على الإنترنت | مدونة 24Toolkit',
    description: 'تعرف على أفضل الممارسات لتأمين حساباتك وكلمات المرور وحماية معلوماتك الحساسة من الاختراق.',
    keywords: ['الأمن الرقمي', 'حماية الخصوصية', 'كلمات المرور', 'الاختراق', 'التشفير'],
    canonicalPath: '/blog/online-security-tips-ar'
  })

  return (
    <article className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-6 gap-2">
            العودة للمدونة
            <ArrowLeft size={18} className="rotate-180" />
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop" 
            alt="الأمن الرقمي"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="mb-3 bg-emerald-500/90">الأمن الرقمي</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              نصائح ذهبية لحماية خصوصيتك على الإنترنت
            </h1>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>أحمد محمد</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarBlank size={16} />
            <span>٢٥ نوفمبر ٢٠٢٥</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>٦ دقائق للقراءة</span>
          </div>
          <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="sm" className="gap-1">
              <Share size={16} />
              <span className="hidden sm:inline">مشاركة</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <BookmarkSimple size={16} />
              <span className="hidden sm:inline">حفظ</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            في عصر التكنولوجيا الرقمية، أصبحت حماية البيانات الشخصية أمراً ضرورياً أكثر من أي وقت مضى. 
            مع تزايد الهجمات الإلكترونية وسرقة الهوية، من المهم أن نتعلم كيف نحمي أنفسنا.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">لماذا الأمن الرقمي مهم؟</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            كل يوم، يتعرض ملايين الأشخاص لمحاولات اختراق وسرقة بيانات. البيانات المسروقة قد تُستخدم في:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 mr-4">
            <li>سرقة الهوية والاحتيال المالي</li>
            <li>الابتزاز الإلكتروني</li>
            <li>بيع المعلومات في السوق السوداء</li>
            <li>الوصول غير المصرح به للحسابات البنكية</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">نصائح أساسية للحماية</h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-3">١. استخدم كلمات مرور قوية وفريدة</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            كلمة المرور القوية يجب أن تحتوي على:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 mr-4">
            <li>١٢ حرفاً على الأقل</li>
            <li>مزيج من الأحرف الكبيرة والصغيرة</li>
            <li>أرقام ورموز خاصة</li>
            <li>عدم استخدام معلومات شخصية واضحة</li>
          </ul>

          <div className="bg-card/50 border rounded-xl p-6 my-8">
            <h4 className="font-semibold mb-3">💡 نصيحة</h4>
            <p className="text-muted-foreground">
              استخدم مدير كلمات المرور لإنشاء وتخزين كلمات مرور قوية وفريدة لكل حساب. 
              هذا يضمن عدم تكرار نفس كلمة المرور في أكثر من موقع.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">٢. فعّل المصادقة الثنائية (2FA)</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            المصادقة الثنائية تضيف طبقة حماية إضافية. حتى لو سُرقت كلمة مرورك، 
            لن يتمكن المهاجم من الدخول بدون الرمز الثاني الذي يُرسل إلى هاتفك أو بريدك.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">٣. احذر من رسائل التصيد الاحتيالي</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            رسائل التصيد تبدو وكأنها من مصادر موثوقة لكنها مصممة لسرقة معلوماتك. احذر من:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 mr-4">
            <li>الروابط المشبوهة في الإيميلات</li>
            <li>طلبات إدخال بيانات حساسة عبر البريد</li>
            <li>العروض التي تبدو "جيدة جداً لتكون حقيقية"</li>
            <li>الرسائل التي تخلق شعوراً بالاستعجال</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">٤. حدّث برامجك باستمرار</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            التحديثات الأمنية تُصلح الثغرات التي يستغلها المخترقون. تأكد من تحديث نظام التشغيل، 
            المتصفح، وجميع التطبيقات بشكل منتظم.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">٥. استخدم شبكة VPN على الشبكات العامة</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            شبكات الواي فاي العامة في المقاهي والمطارات غير آمنة. استخدام VPN يشفر اتصالك 
            ويحمي بياناتك من المتطفلين على نفس الشبكة.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">أدوات مفيدة للحماية</h2>
          <div className="grid sm:grid-cols-2 gap-4 my-8">
            <div className="bg-card/50 border rounded-xl p-4">
              <div className="font-semibold mb-2">🔐 مولد كلمات المرور</div>
              <div className="text-sm text-muted-foreground">أنشئ كلمات مرور قوية وعشوائية</div>
            </div>
            <div className="bg-card/50 border rounded-xl p-4">
              <div className="font-semibold mb-2">🔒 أداة التشفير AES</div>
              <div className="text-sm text-muted-foreground">شفّر ملفاتك ونصوصك الحساسة</div>
            </div>
            <div className="bg-card/50 border rounded-xl p-4">
              <div className="font-semibold mb-2">✅ فاحص قوة كلمة المرور</div>
              <div className="text-sm text-muted-foreground">اختبر مدى قوة كلمات مرورك</div>
            </div>
            <div className="bg-card/50 border rounded-xl p-4">
              <div className="font-semibold mb-2">🔍 فاحص روابط التصيد</div>
              <div className="text-sm text-muted-foreground">تحقق من سلامة الروابط المشبوهة</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">الخلاصة</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            الأمن الرقمي ليس ترفاً بل ضرورة. باتباع هذه النصائح البسيطة، يمكنك حماية نفسك 
            وعائلتك من معظم التهديدات الإلكترونية. تذكر: الوقاية خير من العلاج!
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">ابدأ بحماية نفسك الآن</h3>
          <p className="text-muted-foreground mb-6">
            جرّب أدوات الأمان المجانية لدينا واحمِ بياناتك.
          </p>
          <Link to="/tools/password-generator">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-500">
              مولد كلمات المرور
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t flex justify-between">
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
            جميع المقالات
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </div>
    </article>
  )
}
