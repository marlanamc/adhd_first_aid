// 🎨 Centralized Color System - Preserving Your Beautiful Gradients
// This system centralizes your carefully chosen colors while keeping all gradients intact

export type PageType = 'home' | 'barrier' | 'feeling' | 'task' | 'complex_loop' | 'identity' | 'guide' | 'script' | 'quiz' | 'resource'

// ===== YOUR BEAUTIFUL GRADIENTS PRESERVED =====
export const PAGE_BACKGROUND_GRADIENTS = {
  feeling: 'bg-gradient-to-br from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900',
  barrier: 'bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900',
  life_area: 'bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900',
  complex_loop: 'bg-gradient-to-br from-[#b0f4ea] via-[#78c2f2] to-[#a18cd1] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900',
  identity: 'bg-gradient-to-br from-[#78c2f2] via-[#b39ddb] to-[#e1d5f9] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900',
  home: 'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900'
} as const

// ===== YOUR EMOTIONAL BUTTON GRADIENTS =====
export const EMOTIONAL_GRADIENTS = {
  crisis: 'bg-gradient-to-r from-pink-500 via-pink-400 to-orange-400 hover:from-pink-600 hover:via-pink-500 hover:to-orange-500',
  walkthrough: 'bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400'
} as const

// ===== YOUR STANDARD COLORS =====
export const PAGE_TYPE_COLORS = {
  feeling: {
    primary: 'bg-pink-600 hover:bg-pink-700',
    secondary: 'bg-pink-600',
    text: 'text-pink-700',
    accent: 'bg-pink-50/50 dark:bg-pink-900/10',
    border: 'border-pink-400',
    hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40'
  },
  barrier: {
    primary: 'bg-orange-600 hover:bg-orange-700',
    secondary: 'bg-orange-600',
    text: 'text-orange-700',
    accent: 'bg-orange-50/50 dark:bg-orange-900/10',
    border: 'border-orange-400',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40'
  },
  task: {
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-green-600',
    text: 'text-green-700',
    accent: 'bg-green-50/50 dark:bg-green-900/10',
    border: 'border-green-400',
    hover: 'hover:bg-green-50 dark:hover:bg-green-900/20'
  },
  complex_loop: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-blue-600',
    text: 'text-blue-700',
    accent: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-400',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40'
  },
  identity: {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-purple-600',
    text: 'text-purple-700',
    accent: 'bg-purple-50/50 dark:bg-purple-900/10',
    border: 'border-purple-400',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40'
  },
  guide: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-blue-600',
    text: 'text-blue-700',
    accent: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-400',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40'
  },
  script: {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-purple-600',
    text: 'text-purple-700',
    accent: 'bg-purple-50/50 dark:bg-purple-900/10',
    border: 'border-purple-400',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40'
  },
  quiz: {
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    secondary: 'bg-emerald-600',
    text: 'text-emerald-700',
    accent: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    border: 'border-emerald-400',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
  },
  resource: {
    primary: 'bg-pink-600 hover:bg-pink-700',
    secondary: 'bg-pink-600',
    text: 'text-pink-700',
    accent: 'bg-pink-50/50 dark:bg-pink-900/10',
    border: 'border-pink-400',
    hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40'
  },
  default: {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-indigo-600',
    text: 'text-rose-700',
    accent: 'bg-indigo-50/50 dark:bg-indigo-900/10',
    border: 'border-indigo-400',
    hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
  }
} as const

// ===== UTILITY FUNCTIONS =====
export const getPageTypeColors = (pageType: PageType) => PAGE_TYPE_COLORS[pageType] || PAGE_TYPE_COLORS.default

export const getPageTypeGradient = (pageType: PageType) => PAGE_BACKGROUND_GRADIENTS[pageType as keyof typeof PAGE_BACKGROUND_GRADIENTS] || PAGE_BACKGROUND_GRADIENTS.home

export const getPageTypeClass = (pageType: PageType, variant: keyof typeof PAGE_TYPE_COLORS.feeling) =>
  PAGE_TYPE_COLORS[pageType]?.[variant] || PAGE_TYPE_COLORS.default?.[variant] || PAGE_TYPE_COLORS.default.primary

export const getEmotionalGradient = (emotion: keyof typeof EMOTIONAL_GRADIENTS) => EMOTIONAL_GRADIENTS[emotion]

// ===== YOUR EMOTIONAL COLOR PHILOSOPHY =====
/*
Your gradient system beautifully reflects emotional states:
- Feeling (pink→yellow): Emotional warmth, compassion, care
- Barrier (orange→green): Warning/caution to growth/breakthrough
- Task (green→blue): Action/progress to calm focus
- Complex Loop (teal→purple): Thinking complexity to self-understanding
- Identity (blue→purple): Self-discovery to self-acceptance

This system preserves all your emotional color choices while making them
easier to maintain and extend consistently across the app.
*/
