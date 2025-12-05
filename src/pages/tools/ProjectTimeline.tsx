"use client";

import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { Calendar, Code, FileText, User, Clock, Rocket, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export default function ProjectTimeline() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // بيانات الجدول الزمني
  const timelineData: TimelineItem[] = [
    {
      id: 1,
      title: isArabic ? "التخطيط والتحليل" : "Planning & Analysis",
      date: isArabic ? "يناير 2024" : "Jan 2024",
      content: isArabic 
        ? "مرحلة التخطيط الشامل وجمع المتطلبات وتحليل احتياجات المشروع. تحديد الأهداف والموارد المطلوبة وإنشاء خطة عمل مفصلة."
        : "Comprehensive planning phase, requirements gathering, and project needs analysis. Defining objectives, required resources, and creating a detailed action plan.",
      category: isArabic ? "التخطيط" : "Planning",
      icon: Calendar,
      relatedIds: [2],
      status: "completed",
      energy: 100,
    },
    {
      id: 2,
      title: isArabic ? "التصميم والهندسة" : "Design & Architecture",
      date: isArabic ? "فبراير 2024" : "Feb 2024",
      content: isArabic
        ? "تصميم واجهة المستخدم وتجربة المستخدم والهندسة المعمارية للنظام. إنشاء النماذج الأولية والتصاميم التفصيلية."
        : "UI/UX design, user experience, and system architecture design. Creating prototypes and detailed designs.",
      category: isArabic ? "التصميم" : "Design",
      icon: FileText,
      relatedIds: [1, 3],
      status: "completed",
      energy: 90,
    },
    {
      id: 3,
      title: isArabic ? "التطوير والبرمجة" : "Development & Coding",
      date: isArabic ? "مارس 2024" : "Mar 2024",
      content: isArabic
        ? "تنفيذ الميزات الأساسية والبرمجة والاختبار الأولي. كتابة الكود وبناء الوحدات الأساسية للمشروع."
        : "Core features implementation, coding, and initial testing. Writing code and building core project modules.",
      category: isArabic ? "التطوير" : "Development",
      icon: Code,
      relatedIds: [2, 4],
      status: "in-progress",
      energy: 65,
    },
    {
      id: 4,
      title: isArabic ? "الاختبار والتحسين" : "Testing & Optimization",
      date: isArabic ? "أبريل 2024" : "Apr 2024",
      content: isArabic
        ? "اختبار شامل للمستخدمين وإصلاح الأخطاء وتحسين الأداء. ضمان جودة المنتج النهائي."
        : "Comprehensive user testing, bug fixes, and performance optimization. Ensuring final product quality.",
      category: isArabic ? "الاختبار" : "Testing",
      icon: User,
      relatedIds: [3, 5],
      status: "pending",
      energy: 35,
    },
    {
      id: 5,
      title: isArabic ? "النشر والإطلاق" : "Deployment & Launch",
      date: isArabic ? "مايو 2024" : "May 2024",
      content: isArabic
        ? "النشر النهائي على الخوادم والإطلاق الرسمي للمشروع. إطلاق المنتج للمستخدمين النهائيين."
        : "Final deployment to servers and official project launch. Releasing the product to end users.",
      category: isArabic ? "الإطلاق" : "Release",
      icon: Rocket,
      relatedIds: [4],
      status: "pending",
      energy: 15,
    },
  ];

  // SEO Metadata
  const metadata = getPageMetadata({
    title: isArabic ? "الجدول الزمني للمشروع" : "Project Timeline",
    description: isArabic 
      ? "عرض تفاعلي للجدول الزمني للمشروع مع حركة مدارية جميلة"
      : "Interactive project timeline visualization with beautiful orbital animation",
    keywords: isArabic
      ? "جدول زمني، مشروع، تخطيط، تطوير"
      : "timeline, project, planning, development",
  });

  useSEO(metadata);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            {isArabic ? "الجدول الزمني للمشروع" : "Project Timeline"}
          </h1>
          <p className="text-white/70 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto px-2">
            {isArabic 
              ? "عرض تفاعلي لمراحل المشروع مع حركة مدارية جميلة. انقر على أي عنصر لرؤية التفاصيل."
              : "Interactive visualization of project phases with beautiful orbital animation. Click on any item to see details."}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-white/50">
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
              {isArabic ? "🔍 ابحث" : "🔍 Search"}
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
              {isArabic ? "🔗 اتصالات" : "🔗 Connections"}
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
              {isArabic ? "📊 إحصائيات" : "📊 Statistics"}
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
              {isArabic ? "⌨️ اختصارات" : "⌨️ Shortcuts"}
            </span>
          </div>
        </div>
      </div>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}
