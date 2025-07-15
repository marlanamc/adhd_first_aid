'use client'

import { useState, useEffect } from 'react'

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

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStrategy[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const addFavorite = (strategy: Omit<FavoriteStrategy, 'savedAt'>) => {
    const newFavorite: FavoriteStrategy = {
      ...strategy,
      savedAt: new Date().toISOString()
    }

    const updatedFavorites = [...favorites, newFavorite]
    setFavorites(updatedFavorites)
    localStorage.setItem('favoriteStrategies', JSON.stringify(updatedFavorites))
  }

  const removeFavorite = (strategyId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== strategyId)
    setFavorites(updatedFavorites)
    localStorage.setItem('favoriteStrategies', JSON.stringify(updatedFavorites))
  }

  const isFavorite = (strategyId: string) => {
    return favorites.some(fav => fav.id === strategyId)
  }

  const toggleFavorite = (strategy: Omit<FavoriteStrategy, 'savedAt'>) => {
    if (isFavorite(strategy.id)) {
      removeFavorite(strategy.id)
    } else {
      addFavorite(strategy)
    }
  }

  const clearAllFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favoriteStrategies')
  }

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length
  }
}