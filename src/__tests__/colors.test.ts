import {
  getPageTypeColors,
  getPageTypeGradient,
  getPageTypeClass,
  getEmotionalGradient,
  PAGE_BACKGROUND_GRADIENTS,
  EMOTIONAL_GRADIENTS,
  PAGE_TYPE_COLORS
} from '../lib/colors'

describe('Color System', () => {
  describe('getPageTypeColors', () => {
    it('should return correct colors for feeling page type', () => {
      const colors = getPageTypeColors('feeling')

      expect(colors).toEqual({
        primary: 'bg-pink-600 hover:bg-pink-700',
        secondary: 'bg-pink-600',
        text: 'text-pink-700',
        accent: 'bg-pink-50/50 dark:bg-pink-900/10',
        border: 'border-pink-400',
        hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40'
      })
    })

    it('should return correct colors for barrier page type', () => {
      const colors = getPageTypeColors('barrier')

      expect(colors.primary).toBe('bg-orange-600 hover:bg-orange-700')
      expect(colors.secondary).toBe('bg-orange-600')
      expect(colors.text).toBe('text-orange-700')
      expect(colors.border).toBe('border-orange-400')
    })

    it('should return correct colors for complex_loop page type', () => {
      const colors = getPageTypeColors('complex_loop')

      expect(colors.primary).toBe('bg-blue-600 hover:bg-blue-700')
      expect(colors.secondary).toBe('bg-blue-600')
      expect(colors.text).toBe('text-blue-700')
    })

    it('should return default colors for unknown page type', () => {
      const colors = getPageTypeColors('unknown' as any)

      expect(colors.primary).toBe('bg-indigo-600 hover:bg-indigo-700')
      expect(colors.secondary).toBe('bg-indigo-600')
      expect(colors.text).toBe('text-rose-700')
    })

    it('should return default colors for home page type', () => {
      const colors = getPageTypeColors('home')

      expect(colors.primary).toBe('bg-indigo-600 hover:bg-indigo-700')
      expect(colors.secondary).toBe('bg-indigo-600')
      expect(colors.text).toBe('text-rose-700')
    })
  })

  describe('getPageTypeGradient', () => {
    it('should return correct gradient for feeling page type', () => {
      const gradient = getPageTypeGradient('feeling')
      expect(gradient).toBe('bg-gradient-to-br from-[#fca3b7] via-[#fbc2eb] to-[#fbd786] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900')
    })

    it('should return correct gradient for barrier page type', () => {
      const gradient = getPageTypeGradient('barrier')
      expect(gradient).toBe('bg-gradient-to-br from-[#fbc687] via-[#fff5db] to-[#d4fc79] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900')
    })

    it('should return correct gradient for life_area page type', () => {
      const gradient = getPageTypeGradient('life_area')
      expect(gradient).toBe('bg-gradient-to-br from-[#9ee5b5] via-[#b0f4ea] to-[#8fd3f4] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900')
    })

    it('should return correct gradient for complex_loop page type', () => {
      const gradient = getPageTypeGradient('complex_loop')
      expect(gradient).toBe('bg-gradient-to-br from-[#b0f4ea] via-[#78c2f2] to-[#a18cd1] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900')
    })

    it('should return correct gradient for identity page type', () => {
      const gradient = getPageTypeGradient('identity')
      expect(gradient).toBe('bg-gradient-to-br from-[#78c2f2] via-[#b39ddb] to-[#e1d5f9] dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900')
    })

    it('should return default gradient for unknown page type', () => {
      const gradient = getPageTypeGradient('unknown' as any)
      expect(gradient).toBe('bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900')
    })
  })

  describe('getPageTypeClass', () => {
    it('should return correct class for feeling primary color', () => {
      const className = getPageTypeClass('feeling', 'primary')
      expect(className).toBe('bg-pink-600 hover:bg-pink-700')
    })

    it('should return correct class for barrier border color', () => {
      const className = getPageTypeClass('barrier', 'border')
      expect(className).toBe('border-orange-400')
    })

    it('should return correct class for task hover color', () => {
      const className = getPageTypeClass('task', 'hover')
      expect(className).toBe('hover:bg-green-50 dark:hover:bg-green-900/20')
    })

    it('should return default class for unknown page type', () => {
      const className = getPageTypeClass('unknown' as any, 'primary')
      expect(className).toBe('bg-indigo-600 hover:bg-indigo-700')
    })

    it('should return default class for unknown variant', () => {
      const className = getPageTypeClass('feeling', 'unknown' as any)
      expect(className).toBe('bg-indigo-600 hover:bg-indigo-700') // defaults to default page type primary
    })
  })

  describe('getEmotionalGradient', () => {
    it('should return crisis gradient', () => {
      const gradient = getEmotionalGradient('crisis')
      expect(gradient).toBe('bg-gradient-to-r from-pink-500 via-pink-400 to-orange-400 hover:from-pink-600 hover:via-pink-500 hover:to-orange-500')
    })

    it('should return walkthrough gradient', () => {
      const gradient = getEmotionalGradient('walkthrough')
      expect(gradient).toBe('bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400')
    })

    it('should handle unknown emotion gracefully', () => {
      const gradient = getEmotionalGradient('unknown' as any)
      expect(gradient).toBeUndefined()
    })
  })

  describe('Color System Integration', () => {
    it('should provide complete color system for feeling page', () => {
      const colors = getPageTypeColors('feeling')
      const gradient = getPageTypeGradient('feeling')

      expect(colors.primary).toBe('bg-pink-600 hover:bg-pink-700')
      expect(colors.text).toBe('text-pink-700')
      expect(colors.border).toBe('border-pink-400')
      expect(gradient).toContain('from-[#fca3b7]')
      expect(gradient).toContain('to-[#fbd786]')
    })

    it('should provide complete color system for barrier page', () => {
      const colors = getPageTypeColors('barrier')
      const gradient = getPageTypeGradient('barrier')

      expect(colors.primary).toBe('bg-orange-600 hover:bg-orange-700')
      expect(colors.text).toBe('text-orange-700')
      expect(colors.border).toBe('border-orange-400')
      expect(gradient).toContain('from-[#fbc687]')
      expect(gradient).toContain('to-[#d4fc79]')
    })

    it('should provide complete color system for complex loop page', () => {
      const colors = getPageTypeColors('complex_loop')
      const gradient = getPageTypeGradient('complex_loop')

      expect(colors.primary).toBe('bg-blue-600 hover:bg-blue-700')
      expect(colors.text).toBe('text-blue-700')
      expect(colors.border).toBe('border-blue-400')
      expect(gradient).toContain('from-[#b0f4ea]')
      expect(gradient).toContain('to-[#a18cd1]')
    })

    it('should provide complete color system for identity page', () => {
      const colors = getPageTypeColors('identity')
      const gradient = getPageTypeGradient('identity')

      expect(colors.primary).toBe('bg-purple-600 hover:bg-purple-700')
      expect(colors.text).toBe('text-purple-700')
      expect(colors.border).toBe('border-purple-400')
      expect(gradient).toContain('from-[#78c2f2]')
      expect(gradient).toContain('to-[#e1d5f9]')
    })

    it('should provide complete color system for task page', () => {
      const colors = getPageTypeColors('task')
      const gradient = getPageTypeGradient('life_area') // task uses life_area gradient

      expect(colors.primary).toBe('bg-green-600 hover:bg-green-700')
      expect(colors.text).toBe('text-green-700')
      expect(colors.border).toBe('border-green-400')
      expect(gradient).toContain('from-[#9ee5b5]')
      expect(gradient).toContain('to-[#8fd3f4]')
    })

    it('should preserve emotional gradients', () => {
      const crisisGradient = getEmotionalGradient('crisis')
      const walkthroughGradient = getEmotionalGradient('walkthrough')

      expect(crisisGradient).toContain('from-pink-500')
      expect(crisisGradient).toContain('to-orange-400')
      expect(walkthroughGradient).toContain('from-emerald-300')
      expect(walkthroughGradient).toContain('to-blue-400')
    })
  })

  describe('Color System Constants', () => {
    it('should have all expected page background gradients', () => {
      expect(PAGE_BACKGROUND_GRADIENTS.feeling).toBeDefined()
      expect(PAGE_BACKGROUND_GRADIENTS.barrier).toBeDefined()
      expect(PAGE_BACKGROUND_GRADIENTS.life_area).toBeDefined()
      expect(PAGE_BACKGROUND_GRADIENTS.complex_loop).toBeDefined()
      expect(PAGE_BACKGROUND_GRADIENTS.identity).toBeDefined()
      expect(PAGE_BACKGROUND_GRADIENTS.home).toBeDefined()
    })

    it('should have all expected emotional gradients', () => {
      expect(EMOTIONAL_GRADIENTS.crisis).toBeDefined()
      expect(EMOTIONAL_GRADIENTS.walkthrough).toBeDefined()
    })

    it('should have all expected page type colors', () => {
      const pageTypes = ['feeling', 'barrier', 'task', 'complex_loop', 'identity', 'guide', 'script', 'quiz', 'resource', 'default']

      pageTypes.forEach(pageType => {
        expect(PAGE_TYPE_COLORS[pageType as keyof typeof PAGE_TYPE_COLORS]).toBeDefined()
      })
    })

    it('should have consistent color structure for all page types', () => {
      Object.values(PAGE_TYPE_COLORS).forEach(colors => {
        expect(colors.primary).toBeDefined()
        expect(colors.secondary).toBeDefined()
        expect(colors.text).toBeDefined()
        expect(colors.accent).toBeDefined()
        expect(colors.border).toBeDefined()
        expect(colors.hover).toBeDefined()
      })
    })
  })

  describe('Emotional Color Philosophy', () => {
    it('should reflect emotional journey in gradients', () => {
      // Feeling: Emotional warmth (pink to yellow)
      const feelingGradient = getPageTypeGradient('feeling')
      expect(feelingGradient).toContain('fca3b7') // pink start
      expect(feelingGradient).toContain('fbd786') // yellow end

      // Barrier: Caution to growth (orange to green)
      const barrierGradient = getPageTypeGradient('barrier')
      expect(barrierGradient).toContain('fbc687') // orange start
      expect(barrierGradient).toContain('d4fc79') // green end

      // Task: Action to calm (green to blue)
      const taskGradient = getPageTypeGradient('life_area')
      expect(taskGradient).toContain('9ee5b5') // green start
      expect(taskGradient).toContain('8fd3f4') // blue end

      // Complex Loop: Thinking to understanding (teal to purple)
      const complexGradient = getPageTypeGradient('complex_loop')
      expect(complexGradient).toContain('b0f4ea') // teal start
      expect(complexGradient).toContain('a18cd1') // purple end

      // Identity: Self-discovery to acceptance (blue to purple)
      const identityGradient = getPageTypeGradient('identity')
      expect(identityGradient).toContain('78c2f2') // blue start
      expect(identityGradient).toContain('e1d5f9') // purple end
    })

    it('should maintain consistent color relationships', () => {
      // Each page type should have harmonious color relationships
      const feelingColors = getPageTypeColors('feeling')
      expect(feelingColors.primary).toContain('pink-600')
      expect(feelingColors.text).toContain('pink-700')
      expect(feelingColors.border).toContain('pink-400')

      const barrierColors = getPageTypeColors('barrier')
      expect(barrierColors.primary).toContain('orange-600')
      expect(barrierColors.text).toContain('orange-700')
      expect(barrierColors.border).toContain('orange-400')

      const taskColors = getPageTypeColors('task')
      expect(taskColors.primary).toContain('green-600')
      expect(taskColors.text).toContain('green-700')
      expect(taskColors.border).toContain('green-400')
    })
  })
})
