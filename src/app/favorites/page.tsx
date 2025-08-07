'use client'

import { useState, useEffect } from 'react'
import { Heart, HeartOff, AlertTriangle, BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FavoriteStrategy {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  price: string
  url?: string
  savedAt: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteStrategy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem('favoriteStrategies')
        if (stored) {
          const parsed = JSON.parse(stored)
          setFavorites(parsed)
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const removeFavorite = (strategyId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== strategyId)
    setFavorites(updatedFavorites)
    localStorage.setItem('favoriteStrategies', JSON.stringify(updatedFavorites))
  }

  const clearAllFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favoriteStrategies')
  }

  const goBack = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Gathering the strategies that work for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ocean-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                My Favorite Strategies
              </h1>
              <p className="text-muted-foreground mt-2">
                Your personally saved ADHD strategies and coping techniques
              </p>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="page-card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Important: Temporary Storage
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  Your favorites are stored locally in your browser. They will be lost if you clear your browser data, 
                  switch devices, or use incognito mode. Consider saving important strategies elsewhere for permanent access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="page-card max-w-md mx-auto p-8">
              <HeartOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Favorites Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring strategies and click the heart icon to save your favorites here.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explore Content
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
              </p>
              <Button
                variant="outline"
                onClick={clearAllFavorites}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear All
              </Button>
            </div>

            {/* Favorites Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((strategy) => (
                <div key={strategy.id} className="strategy-card page-card p-6 relative group">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFavorite(strategy.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>

                  {/* Strategy Content */}
                  <div className="mb-4">
                    <div className="strategy-category text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      {strategy.category}
                    </div>
                    <h3 className="strategy-title text-lg font-semibold text-foreground mb-3">
                      {strategy.name}
                    </h3>
                    <div className="strategy-description text-muted-foreground text-sm leading-relaxed mb-4 prose prose-sm prose-headings:text-foreground prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{strategy.description}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Tags */}
                  {strategy.tags && strategy.tags.length > 0 && (
                    <div className="strategy-tags mb-4">
                      {strategy.tags.map((tag) => (
                        <span
                          key={tag}
                          className="strategy-tag text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full mr-2 mb-1 inline-block"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {strategy.price}
                    </span>
                    <span>
                      Saved {new Date(strategy.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}