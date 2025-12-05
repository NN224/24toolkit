"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, Code, FileText, Rocket, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  icon: React.ElementType;
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export function FeaturedTimeline() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // بيانات مصغرة للـ preview (3 عناصر فقط)
  const previewData: TimelineItem[] = [
    {
      id: 1,
      title: isArabic ? "التخطيط" : "Planning",
      date: isArabic ? "يناير 2024" : "Jan 2024",
      icon: Calendar,
      status: "completed",
      energy: 100,
    },
    {
      id: 2,
      title: isArabic ? "التطوير" : "Development",
      date: isArabic ? "مارس 2024" : "Mar 2024",
      icon: Code,
      status: "in-progress",
      energy: 65,
    },
    {
      id: 3,
      title: isArabic ? "الإطلاق" : "Launch",
      date: isArabic ? "مايو 2024" : "May 2024",
      icon: Rocket,
      status: "pending",
      energy: 15,
    },
  ];

  // Auto rotation for preview
  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.2) % 360);
    }, 50);

    return () => clearInterval(rotationTimer);
  }, []);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 60; // Smaller radius for preview
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    return { x, y };
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12 sm:mb-16 lg:mb-20 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 rounded-2xl sm:rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl sm:rounded-3xl" />

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4"
              >
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-xs sm:text-sm font-semibold text-purple-300">
                  {isArabic ? "أداة مميزة" : "Featured Tool"}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent"
              >
                {isArabic ? "الجدول الزمني للمشروع" : "Project Timeline"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-base sm:text-lg mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0"
              >
                {isArabic
                  ? "عرض تفاعلي جميل لمراحل مشروعك مع حركة مدارية ساحرة. تتبع التقدم، شاهد الاتصالات، واستمتع بتجربة بصرية فريدة."
                  : "Beautiful interactive visualization of your project phases with mesmerizing orbital animation. Track progress, see connections, and enjoy a unique visual experience."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/50 group"
                >
                  <Link to="/tools/project-timeline">
                    {isArabic ? "جرب الآن" : "Try Now"}
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  <Link to="/tools/project-timeline">
                    {isArabic ? "عرض كامل" : "View Full"}
                  </Link>
                </Button>
              </motion.div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 lg:mt-8 flex flex-wrap gap-3 justify-center lg:justify-start text-xs sm:text-sm text-muted-foreground"
              >
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  ✨ {isArabic ? "تفاعلي" : "Interactive"}
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  🔗 {isArabic ? "اتصالات" : "Connections"}
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  📊 {isArabic ? "إحصائيات" : "Statistics"}
                </span>
              </motion.div>
            </div>

            {/* Right Side - Preview */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative w-full aspect-square max-w-md mx-auto"
              >
                {/* Preview Container */}
                <div
                  ref={containerRef}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* Center Circle */}
                  <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 animate-pulse flex items-center justify-center z-10 shadow-lg shadow-purple-500/50">
                    <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-md"></div>
                  </div>

                  {/* Orbit Circle */}
                  <div className="absolute w-32 h-32 rounded-full border border-purple-500/20"></div>

                  {/* Timeline Nodes */}
                  {previewData.map((item, index) => {
                    const position = calculateNodePosition(index, previewData.length);
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                        className="absolute"
                        style={{
                          transform: `translate(${position.x}px, ${position.y}px)`,
                        }}
                      >
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                            item.status === "completed"
                              ? "bg-green-500/20 border-green-400 text-green-400 hover:bg-green-500/30"
                              : item.status === "in-progress"
                              ? "bg-yellow-500/20 border-yellow-400 text-yellow-400 hover:bg-yellow-500/30"
                              : "bg-gray-500/20 border-gray-400 text-gray-400 hover:bg-gray-500/30"
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon size={14} />
                        </motion.div>
                        <motion.div 
                          className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/70 font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          {item.title}
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    {previewData.map((item, index) => {
                      const pos1 = calculateNodePosition(index, previewData.length);
                      const pos2 = calculateNodePosition(
                        (index + 1) % previewData.length,
                        previewData.length
                      );
                      return (
                        <line
                          key={index}
                          x1={pos1.x}
                          y1={pos1.y}
                          x2={pos2.x}
                          y2={pos2.y}
                          stroke="rgba(147, 51, 234, 0.4)"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Glow Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 rounded-full blur-2xl"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
