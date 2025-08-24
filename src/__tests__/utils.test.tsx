import React from 'react'
import { cn, formatMarkdownText, formatMarkdownTextWithIntelligence, formatIdentityMarkdownText } from '../lib/utils'

describe('Utility Functions', () => {
  describe('cn (Tailwind Class Merger)', () => {
    it('should merge Tailwind classes correctly', () => {
      const result = cn('bg-red-500', 'text-white', 'px-4')
      expect(result).toBe('bg-red-500 text-white px-4')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('bg-blue-500', isActive && 'text-white', 'px-4')
      expect(result).toBe('bg-blue-500 text-white px-4')
    })

    it('should filter out falsy values', () => {
      const result = cn('bg-green-500', false && 'text-white', null, 'px-4', undefined)
      expect(result).toBe('bg-green-500 px-4')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle single class', () => {
      const result = cn('bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })
  })

  describe('formatMarkdownText', () => {
    it('should convert basic markdown to JSX', () => {
      const markdown = '**bold text** and *italic text*'
      const result = formatMarkdownText(markdown)

      expect(result).toHaveLength(3)
      expect(result[0]).toBe('')
      expect(result[1]).toEqual(<strong key="bold-1">bold text</strong>)
      expect(result[2]).toBe(' and *italic text*')
    })

    it('should handle plain text', () => {
      const result = formatMarkdownText('plain text')
      expect(result).toEqual(['plain text'])
    })

    it('should handle mixed content', () => {
      const markdown = 'Start **bold** middle *italic* end'
      const result = formatMarkdownText(markdown)

      expect(result).toHaveLength(3)
      expect(result[0]).toBe('Start ')
      expect(result[1]).toEqual(<strong key="bold-1">bold</strong>)
      expect(result[2]).toBe(' middle *italic* end')
    })

    it('should handle empty string', () => {
      const result = formatMarkdownText('')
      expect(result).toEqual([''])
    })
  })

  describe('formatMarkdownTextWithIntelligence', () => {
    it('should format emotional context with callouts', () => {
      const text = 'This is **important** information about anxiety.'
      const result = formatMarkdownTextWithIntelligence(text, 'feeling')

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(<strong key="bold-1">important</strong>)
    })

    it('should handle different page types', () => {
      const text = '**Key point** about barriers'
      const result = formatMarkdownTextWithIntelligence(text, 'barrier')

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(<strong key="bold-1">Key point</strong>)
    })

    it('should create callout boxes for important information', () => {
      const text = '⚠️ **Warning:** This is critical information.'
      const result = formatMarkdownTextWithIntelligence(text, 'feeling')

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(<strong key="bold-1">Warning:</strong>)
    })
  })

  describe('formatIdentityMarkdownText', () => {
    it('should format identity content with callouts', () => {
      const text = 'This is **key information** for identity exploration.'
      const result = formatIdentityMarkdownText(text)

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(<strong key="bold-0">key information</strong>)
    })

    it('should handle emotional aspects', () => {
      const text = 'Understanding your **core identity** is crucial.'
      const result = formatIdentityMarkdownText(text)

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(<strong key="bold-0">core identity</strong>)
    })

    it('should create appropriate callout styling', () => {
      const text = '💡 **Insight:** This helps with self-discovery.'
      const result = formatIdentityMarkdownText(text)

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(<strong key="bold-0">Insight:</strong>)
    })
  })

  describe('Text Processing Edge Cases', () => {
    it('should handle nested formatting', () => {
      const markdown = '**bold with *italic* inside**'
      const result = formatMarkdownText(markdown)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(<strong key="bold-0">bold with *italic* inside</strong>)
    })

    it('should handle multiple consecutive formatting', () => {
      const markdown = '**bold1****bold2*'
      const result = formatMarkdownText(markdown)

      expect(result).toHaveLength(3)
      expect(result[0]).toBe('')
      expect(result[1]).toEqual(<strong key="bold-1">bold1</strong>)
      expect(result[2]).toBe('**bold2*')
    })

    it('should handle unclosed formatting', () => {
      const markdown = '**bold text without closing'
      const result = formatMarkdownText(markdown)

      expect(result).toEqual(['**bold text without closing'])
    })

    it('should preserve whitespace', () => {
      const markdown = '  **bold**  '
      const result = formatMarkdownText(markdown)

      expect(result).toHaveLength(3)
      expect(result[0]).toBe('  ')
      expect(result[1]).toEqual(<strong key="bold-1">bold</strong>)
      expect(result[2]).toBe('  ')
    })
  })
})
