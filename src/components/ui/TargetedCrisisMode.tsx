'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CrisisModeFeeling } from '@/types/crisis-mode'

// Function to format markdown text (same as used in content pages)
import { formatMarkdownText } from '@/lib/utils'

interface TargetedCrisisModeProps {
  feelingName: string
  isOpen: boolean
  onClose: () => void
  feelingEmoji?: string // The emoji icon to display
}

export function TargetedCrisisMode({ feelingName, isOpen, onClose, feelingEmoji }: TargetedCrisisModeProps) {
  const [crisisFeeling, setCrisisFeeling] = useState<CrisisModeFeeling | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [completedStrategies, setCompletedStrategies] = useState<Set<number>>(new Set())

  const fetchCrisisFeeling = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('crisis_mode_feelings')
        .select('*')
        .eq('feeling_name', feelingName)
        .single()

      if (error) {
        console.error('Error fetching crisis feeling:', error)
        return
      }

      setCrisisFeeling(data)
    } catch (error) {
      console.error('Error fetching crisis feeling:', error)
    } finally {
      setIsLoading(false)
    }
  }, [feelingName])

  useEffect(() => {
    if (isOpen && feelingName) {
      fetchCrisisFeeling()
    }
  }, [isOpen, feelingName, fetchCrisisFeeling])

  const toggleStrategy = (index: number) => {
    const newCompleted = new Set(completedStrategies)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedStrategies(newCompleted)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pt-24 md:pt-28">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{feelingEmoji || '❤️'}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Crisis Support: {feelingName}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading crisis support...</p>
            </div>
          ) : crisisFeeling ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm leading-relaxed">
                  {formatMarkdownText(crisisFeeling.description)}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Try these strategies right now:
                </h3>
                <div className="space-y-2">
                  {crisisFeeling.strategies.map((strategy, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        completedStrategies.has(index)
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleStrategy(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          completedStrategies.has(index)
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300'
                        }`}>
                          {completedStrategies.has(index) && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          completedStrategies.has(index)
                            ? 'text-green-800'
                            : 'text-gray-700'
                        }`}>
                          {formatMarkdownText(strategy)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {completedStrategies.size > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    ✓ You've tried {completedStrategies.size} strategy{completedStrategies.size === 1 ? '' : 'ies'}. 
                    You're taking care of yourself.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Continue to full content
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Crisis support not available for this feeling yet.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="mt-4"
              >
                Continue to full content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}