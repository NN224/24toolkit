/**
 * AI Prompt Presets System
 * نظام قوالب الـ AI الجاهزة
 */

export interface PromptPreset {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  category: 'email' | 'content' | 'translation' | 'code' | 'social' | 'custom'
  toolId: string // Which tool this preset is for
  icon: string
  template: string // The actual prompt template with {{placeholders}}
  variables: {
    name: string
    nameAr: string
    placeholder: string
    placeholderAr: string
    type: 'text' | 'select' | 'textarea'
    options?: { value: string; label: string; labelAr: string }[]
  }[]
  isUserCreated?: boolean
}

// Storage key for user presets
const USER_PRESETS_KEY = '24toolkit_user_presets'

// Built-in presets
export const BUILT_IN_PRESETS: PromptPreset[] = [
  // Email presets
  {
    id: 'email-meeting-request',
    name: 'Meeting Request',
    nameAr: 'طلب اجتماع',
    description: 'Request a meeting with someone',
    descriptionAr: 'طلب اجتماع مع شخص',
    category: 'email',
    toolId: 'ai-email-writer',
    icon: '📅',
    template: 'Write a {{tone}} email to {{recipient}} requesting a meeting about {{topic}}. The meeting should be {{duration}} and I prefer {{time}}.',
    variables: [
      { name: 'recipient', nameAr: 'المستلم', placeholder: 'e.g. my manager', placeholderAr: 'مثال: مديري', type: 'text' },
      { name: 'topic', nameAr: 'الموضوع', placeholder: 'e.g. project update', placeholderAr: 'مثال: تحديث المشروع', type: 'text' },
      { name: 'tone', nameAr: 'النبرة', placeholder: 'Select tone', placeholderAr: 'اختر النبرة', type: 'select', 
        options: [
          { value: 'professional', label: 'Professional', labelAr: 'احترافي' },
          { value: 'friendly', label: 'Friendly', labelAr: 'ودي' },
          { value: 'formal', label: 'Formal', labelAr: 'رسمي' }
        ]
      },
      { name: 'duration', nameAr: 'المدة', placeholder: 'e.g. 30 minutes', placeholderAr: 'مثال: 30 دقيقة', type: 'text' },
      { name: 'time', nameAr: 'الوقت', placeholder: 'e.g. this week', placeholderAr: 'مثال: هذا الأسبوع', type: 'text' }
    ]
  },
  {
    id: 'email-follow-up',
    name: 'Follow-up Email',
    nameAr: 'بريد متابعة',
    description: 'Follow up on a previous conversation',
    descriptionAr: 'متابعة محادثة سابقة',
    category: 'email',
    toolId: 'ai-email-writer',
    icon: '🔄',
    template: 'Write a {{tone}} follow-up email about {{topic}}. We last spoke {{when}} and I want to {{action}}.',
    variables: [
      { name: 'topic', nameAr: 'الموضوع', placeholder: 'e.g. the proposal', placeholderAr: 'مثال: العرض', type: 'text' },
      { name: 'when', nameAr: 'متى', placeholder: 'e.g. last week', placeholderAr: 'مثال: الأسبوع الماضي', type: 'text' },
      { name: 'action', nameAr: 'الإجراء', placeholder: 'e.g. check on the status', placeholderAr: 'مثال: التحقق من الحالة', type: 'text' },
      { name: 'tone', nameAr: 'النبرة', placeholder: 'Select tone', placeholderAr: 'اختر النبرة', type: 'select',
        options: [
          { value: 'professional', label: 'Professional', labelAr: 'احترافي' },
          { value: 'friendly', label: 'Friendly', labelAr: 'ودي' },
          { value: 'urgent', label: 'Urgent', labelAr: 'عاجل' }
        ]
      }
    ]
  },
  {
    id: 'email-thank-you',
    name: 'Thank You Email',
    nameAr: 'بريد شكر',
    description: 'Send a thank you message',
    descriptionAr: 'إرسال رسالة شكر',
    category: 'email',
    toolId: 'ai-email-writer',
    icon: '🙏',
    template: 'Write a {{tone}} thank you email to {{recipient}} for {{reason}}.',
    variables: [
      { name: 'recipient', nameAr: 'المستلم', placeholder: 'e.g. the team', placeholderAr: 'مثال: الفريق', type: 'text' },
      { name: 'reason', nameAr: 'السبب', placeholder: 'e.g. their help on the project', placeholderAr: 'مثال: مساعدتهم في المشروع', type: 'textarea' },
      { name: 'tone', nameAr: 'النبرة', placeholder: 'Select tone', placeholderAr: 'اختر النبرة', type: 'select',
        options: [
          { value: 'warm', label: 'Warm', labelAr: 'دافئ' },
          { value: 'professional', label: 'Professional', labelAr: 'احترافي' },
          { value: 'heartfelt', label: 'Heartfelt', labelAr: 'صادق' }
        ]
      }
    ]
  },

  // Content presets
  {
    id: 'content-blog-intro',
    name: 'Blog Introduction',
    nameAr: 'مقدمة مدونة',
    description: 'Write an engaging blog introduction',
    descriptionAr: 'اكتب مقدمة مدونة جذابة',
    category: 'content',
    toolId: 'paragraph-rewriter',
    icon: '📝',
    template: 'Write an engaging blog introduction about {{topic}}. The tone should be {{tone}} and target {{audience}}.',
    variables: [
      { name: 'topic', nameAr: 'الموضوع', placeholder: 'e.g. productivity tips', placeholderAr: 'مثال: نصائح الإنتاجية', type: 'text' },
      { name: 'tone', nameAr: 'النبرة', placeholder: 'Select tone', placeholderAr: 'اختر النبرة', type: 'select',
        options: [
          { value: 'informative', label: 'Informative', labelAr: 'معلوماتي' },
          { value: 'conversational', label: 'Conversational', labelAr: 'محادثة' },
          { value: 'inspiring', label: 'Inspiring', labelAr: 'ملهم' }
        ]
      },
      { name: 'audience', nameAr: 'الجمهور', placeholder: 'e.g. young professionals', placeholderAr: 'مثال: المحترفين الشباب', type: 'text' }
    ]
  },
  {
    id: 'content-product-description',
    name: 'Product Description',
    nameAr: 'وصف منتج',
    description: 'Write a compelling product description',
    descriptionAr: 'اكتب وصف منتج مقنع',
    category: 'content',
    toolId: 'paragraph-rewriter',
    icon: '🛍️',
    template: 'Write a compelling product description for {{product}}. Key features: {{features}}. Target customer: {{customer}}.',
    variables: [
      { name: 'product', nameAr: 'المنتج', placeholder: 'e.g. wireless headphones', placeholderAr: 'مثال: سماعات لاسلكية', type: 'text' },
      { name: 'features', nameAr: 'المميزات', placeholder: 'e.g. noise cancellation, 20hr battery', placeholderAr: 'مثال: إلغاء الضوضاء، بطارية 20 ساعة', type: 'textarea' },
      { name: 'customer', nameAr: 'العميل', placeholder: 'e.g. music lovers', placeholderAr: 'مثال: عشاق الموسيقى', type: 'text' }
    ]
  },

  // Social media presets
  {
    id: 'social-linkedin-post',
    name: 'LinkedIn Post',
    nameAr: 'منشور لينكدإن',
    description: 'Create a professional LinkedIn post',
    descriptionAr: 'أنشئ منشور لينكدإن احترافي',
    category: 'social',
    toolId: 'ai-hashtag-generator',
    icon: '💼',
    template: 'Write a LinkedIn post about {{topic}}. Include a {{hook}} and end with a {{cta}}.',
    variables: [
      { name: 'topic', nameAr: 'الموضوع', placeholder: 'e.g. my career journey', placeholderAr: 'مثال: رحلتي المهنية', type: 'textarea' },
      { name: 'hook', nameAr: 'الجذب', placeholder: 'e.g. surprising statistic', placeholderAr: 'مثال: إحصائية مفاجئة', type: 'text' },
      { name: 'cta', nameAr: 'الدعوة للعمل', placeholder: 'e.g. question for engagement', placeholderAr: 'مثال: سؤال للتفاعل', type: 'text' }
    ]
  },
  {
    id: 'social-tweet-thread',
    name: 'Twitter Thread',
    nameAr: 'سلسلة تغريدات',
    description: 'Create a Twitter/X thread',
    descriptionAr: 'أنشئ سلسلة تغريدات',
    category: 'social',
    toolId: 'text-summarizer',
    icon: '🐦',
    template: 'Create a 5-tweet thread about {{topic}}. Start with a hook: {{hook}}. End with {{cta}}.',
    variables: [
      { name: 'topic', nameAr: 'الموضوع', placeholder: 'e.g. AI trends in 2025', placeholderAr: 'مثال: اتجاهات AI في 2025', type: 'text' },
      { name: 'hook', nameAr: 'الجذب', placeholder: 'e.g. bold statement', placeholderAr: 'مثال: تصريح جريء', type: 'text' },
      { name: 'cta', nameAr: 'الختام', placeholder: 'e.g. follow for more', placeholderAr: 'مثال: تابعني للمزيد', type: 'text' }
    ]
  },

  // Translation presets
  {
    id: 'translate-formal',
    name: 'Formal Translation',
    nameAr: 'ترجمة رسمية',
    description: 'Translate with formal business tone',
    descriptionAr: 'ترجم بنبرة عمل رسمية',
    category: 'translation',
    toolId: 'ai-translator',
    icon: '📋',
    template: 'Translate the following text to {{language}} using formal business language:\n\n{{text}}',
    variables: [
      { name: 'language', nameAr: 'اللغة', placeholder: 'e.g. Arabic', placeholderAr: 'مثال: العربية', type: 'text' },
      { name: 'text', nameAr: 'النص', placeholder: 'Text to translate', placeholderAr: 'النص للترجمة', type: 'textarea' }
    ]
  },

  // Code presets
  {
    id: 'code-explain',
    name: 'Explain Code',
    nameAr: 'شرح الكود',
    description: 'Get a detailed explanation of code',
    descriptionAr: 'احصل على شرح مفصل للكود',
    category: 'code',
    toolId: 'code-formatter',
    icon: '🔍',
    template: 'Explain this {{language}} code in detail. Include what each part does and any potential issues:\n\n{{code}}',
    variables: [
      { name: 'language', nameAr: 'اللغة', placeholder: 'e.g. JavaScript', placeholderAr: 'مثال: جافاسكريبت', type: 'text' },
      { name: 'code', nameAr: 'الكود', placeholder: 'Paste your code here', placeholderAr: 'الصق الكود هنا', type: 'textarea' }
    ]
  }
]

// Get all presets (built-in + user)
export function getAllPresets(): PromptPreset[] {
  const userPresets = getUserPresets()
  return [...BUILT_IN_PRESETS, ...userPresets]
}

// Get presets for a specific tool
export function getPresetsForTool(toolId: string): PromptPreset[] {
  return getAllPresets().filter(p => p.toolId === toolId)
}

// Get presets by category
export function getPresetsByCategory(category: PromptPreset['category']): PromptPreset[] {
  return getAllPresets().filter(p => p.category === category)
}

// Get user-created presets
export function getUserPresets(): PromptPreset[] {
  try {
    const data = localStorage.getItem(USER_PRESETS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save a user preset
export function saveUserPreset(preset: Omit<PromptPreset, 'id' | 'isUserCreated'>): PromptPreset {
  const userPresets = getUserPresets()
  const newPreset: PromptPreset = {
    ...preset,
    id: `user-${Date.now()}`,
    isUserCreated: true
  }
  userPresets.push(newPreset)
  localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets))
  return newPreset
}

// Delete a user preset
export function deleteUserPreset(presetId: string): boolean {
  const userPresets = getUserPresets()
  const index = userPresets.findIndex(p => p.id === presetId)
  if (index !== -1) {
    userPresets.splice(index, 1)
    localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets))
    return true
  }
  return false
}

// Fill template with variables
export function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  return result
}

// Get preset categories
export function getPresetCategories(): { id: PromptPreset['category']; name: string; nameAr: string; icon: string }[] {
  return [
    { id: 'email', name: 'Email', nameAr: 'البريد', icon: '✉️' },
    { id: 'content', name: 'Content', nameAr: 'المحتوى', icon: '📝' },
    { id: 'social', name: 'Social Media', nameAr: 'وسائل التواصل', icon: '📱' },
    { id: 'translation', name: 'Translation', nameAr: 'الترجمة', icon: '🌐' },
    { id: 'code', name: 'Code', nameAr: 'الكود', icon: '💻' },
    { id: 'custom', name: 'Custom', nameAr: 'مخصص', icon: '⚙️' }
  ]
}
