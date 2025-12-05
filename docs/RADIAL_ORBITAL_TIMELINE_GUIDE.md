# دليل استخدام Radial Orbital Timeline Component

## العناصر المطلوبة لاستخدام المكون بالكامل

### 1. هيكل البيانات (TimelineItem Interface)

كل عنصر في الجدول الزمني يحتاج إلى البيانات التالية:

```typescript
interface TimelineItem {
  id: number;                    // معرف فريد للعنصر
  title: string;                 // عنوان العنصر
  date: string;                   // التاريخ (مثل "Jan 2024")
  content: string;                // المحتوى/الوصف
  category: string;               // الفئة (مثل "Planning", "Design")
  icon: React.ElementType;       // أيقونة من lucide-react
  relatedIds: number[];          // مصفوفة من IDs للعناصر المرتبطة
  status: "completed" | "in-progress" | "pending";  // حالة العنصر
  energy: number;                // مستوى الطاقة (0-100)
}
```

### 2. المكونات المستخدمة (من shadcn/ui)

المكون يعتمد على المكونات التالية من shadcn:

- ✅ **Badge** - لعرض حالة العنصر (مكتمل، قيد التنفيذ، معلق)
- ✅ **Button** - لأزرار العناصر المرتبطة
- ✅ **Card** - للبطاقة التفصيلية عند التوسيع
  - CardHeader
  - CardTitle
  - CardContent

### 3. الأيقونات المطلوبة (من lucide-react)

#### أيقونات أساسية (مستخدمة داخل المكون):
- `ArrowRight` - للأزرار المرتبطة
- `Link` - لعرض العناصر المتصلة
- `Zap` - لمستوى الطاقة

#### أيقونات مخصصة لكل عنصر (يمكن اختيار أي أيقونة):
- `Calendar` - للتخطيط
- `FileText` - للتصميم
- `Code` - للتطوير
- `User` - للاختبار
- `Clock` - للإصدار
- أو أي أيقونة أخرى من lucide-react

### 4. الميزات والوظائف

#### أ. الحركة المدارية
- دوران تلقائي للعناصر حول المركز
- يمكن إيقاف الدوران عند النقر على عنصر

#### ب. التفاعل
- **النقر على عنصر**: يوسع العنصر ويعرض التفاصيل
- **النقر على الخلفية**: يطوي جميع العناصر ويعيد الدوران
- **النقر على عنصر مرتبط**: ينتقل إلى ذلك العنصر

#### ج. التأثيرات البصرية
- **Pulse Effect**: تأثير نبض للعناصر المرتبطة
- **Ping Effect**: تأثير ping للمركز
- **Opacity**: شفافية ديناميكية حسب الموضع
- **Scale**: تكبير عند التوسيع

#### د. معلومات العنصر
- **الحالة**: Badge يعرض الحالة (مكتمل/قيد التنفيذ/معلق)
- **التاريخ**: عرض التاريخ
- **المحتوى**: الوصف الكامل
- **مستوى الطاقة**: شريط تقدم مع نسبة مئوية
- **العناصر المرتبطة**: أزرار للانتقال إلى العناصر المتصلة

### 5. مثال على البيانات الكاملة

```typescript
import { Calendar, Code, FileText, User, Clock } from "lucide-react";

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "التخطيط",
    date: "يناير 2024",
    content: "مرحلة التخطيط وجمع المتطلبات للمشروع.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],              // مرتبط بالعنصر رقم 2
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "التصميم",
    date: "فبراير 2024",
    content: "تصميم واجهة المستخدم والهندسة المعمارية للنظام.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],          // مرتبط بالعنصرين 1 و 3
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "التطوير",
    date: "مارس 2024",
    content: "تنفيذ الميزات الأساسية والاختبار.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],           // مرتبط بالعنصرين 2 و 4
    status: "in-progress",
    energy: 60,
  },
  {
    id: 4,
    title: "الاختبار",
    date: "أبريل 2024",
    content: "اختبار المستخدم وإصلاح الأخطاء.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],           // مرتبط بالعنصرين 3 و 5
    status: "pending",
    energy: 30,
  },
  {
    id: 5,
    title: "الإصدار",
    date: "مايو 2024",
    content: "النشر النهائي والإصدار.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],              // مرتبط بالعنصر 4
    status: "pending",
    energy: 10,
  },
];
```

### 6. كيفية الاستخدام

```tsx
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { timelineData } from "./your-data";

function MyPage() {
  return (
    <RadialOrbitalTimeline timelineData={timelineData} />
  );
}
```

### 7. ملاحظات مهمة

1. **relatedIds**: يجب أن تحتوي على IDs صحيحة موجودة في المصفوفة
2. **energy**: يجب أن يكون بين 0 و 100
3. **icon**: يجب أن يكون من نوع `React.ElementType` (أيقونة من lucide-react)
4. **status**: يجب أن يكون أحد القيم الثلاث: "completed" | "in-progress" | "pending"
5. **id**: يجب أن يكون فريداً لكل عنصر

### 8. التخصيص

يمكن تخصيص المكون من خلال:
- تغيير الألوان في CSS
- تعديل حجم المدار (radius في calculateNodePosition)
- تغيير سرعة الدوران (في useEffect)
- إضافة حقول جديدة في TimelineItem interface
