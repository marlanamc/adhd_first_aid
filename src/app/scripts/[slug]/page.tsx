'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, MessageSquareText, Heart, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scripts, type Script } from '@/data/scripts'

interface ScriptPageProps {
  params: Promise<{ slug: string }>
}

export default function ScriptPage({ params }: ScriptPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)
  const [script, setScript] = useState<Script | null>(null)
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)

      // Find the script data
      const foundScript = scripts.find(s => s.slug === resolved.slug) || null
      setScript(foundScript)
    }

    resolveParams()
  }, [params])

  const copyToClipboard = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedScript(title)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const goBack = () => {
    window.history.back()
  }

  if (!resolvedParams || !script) {
    return (
      <div className="min-h-screen bg-[#E8D7FF] dark:bg-[#453975] relative flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Script Not Found</h1>
            <p className="text-black/70 dark:text-white/70 mb-6">
              The script you&apos;re looking for doesn&apos;t exist or hasn&apos;t been created yet.
            </p>
            <Button
              onClick={goBack}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      )
    }
  
    return (
      <div className="min-h-screen bg-[#E8D7FF] dark:bg-[#453975] relative">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={goBack}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl">{script.emoji}</span>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-black text-center">
                    {script.name}
                  </h1>
                </div>
                <p className="text-center text-black/70 text-sm">
                  {script.category}
                </p>
              </div>
            </div>
          </div>
  
          {/* Content */}
          <div className="backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl p-8 mb-8">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-black dark:text-white text-lg leading-relaxed">
                {script.content.intro}
              </p>
            </div>
  
            {/* Scripts */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                <MessageSquareText className="h-5 w-5" />
                Scripts to Use
              </h2>
  
              {script.content.scripts.map((scriptItem, index: number) => (
                <div key={index} className="bg-white/30 dark:bg-black/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-black dark:text-white">
                      {scriptItem.title}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(scriptItem.content, scriptItem.title)}
                      className="text-black/70 dark:text-white/70 hover:bg-white/20"
                    >
                      {copiedScript === scriptItem.title ? (
                        <span className="text-green-600 text-sm">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-black/80 dark:text-white/80 italic leading-relaxed">
                    {scriptItem.content}
                  </p>
                </div>
              ))}
            </div>

          {/* Tips */}
          <div className="bg-white/30 dark:bg-black/30 rounded-2xl p-6">
            <h3 className="font-medium text-black dark:text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Helpful Tips
            </h3>
            <ul className="space-y-3">
              {script.content.tips.map((tip: string, index: number) => (
                <li key={index} className="text-black/80 dark:text-white/80 flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: script.name,
                  text: script.content.intro,
                  url: window.location.href,
                })
              } else {
                copyToClipboard(window.location.href, 'URL')
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Share className="h-4 w-4 mr-2" />
            Share Script
          </Button>
        </div>
      </div>
    </div>
  )
}