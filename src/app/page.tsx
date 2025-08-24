'use client'

import { useState } from 'react'

import NewHomePage from '@/components/pages/NewHomePage'

// Import styles
import './globals.css'

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  return (
    <NewHomePage
      isTransitioning={isTransitioning}
      selectedCard={selectedCard}
    />
  )
}