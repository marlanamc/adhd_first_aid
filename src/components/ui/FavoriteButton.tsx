'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  strategy: {
    id: string
    name: string
    description: string
    category: string
    tags: string[]
    price: string
    url?: string
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
}

export function FavoriteButton({ strategy, className, size = 'md', showText = false, text = 'Favorite' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isCurrentlyFavorite = isFavorite(strategy.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(strategy)
  }

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  const textButtonClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  if (showText) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center space-x-2 rounded-full transition-all duration-200 hover:scale-105',
          'shadow-sm hover:shadow-md',
          textButtonClasses[size],
          isCurrentlyFavorite 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500',
          className
        )}
        title={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          className={cn(
            sizeClasses[size],
            'transition-all duration-200',
            isCurrentlyFavorite && 'fill-current'
          )}
        />
        <span className="font-medium">{isCurrentlyFavorite ? 'Favorited' : text}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full transition-all duration-200 hover:scale-110',
        'bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700',
        'border border-gray-200 dark:border-gray-600',
        'shadow-sm hover:shadow-md',
        buttonSizeClasses[size],
        isCurrentlyFavorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500',
        className
      )}
      title={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={cn(
          sizeClasses[size],
          'transition-all duration-200',
          isCurrentlyFavorite && 'fill-current'
        )}
      />
    </button>
  )
}