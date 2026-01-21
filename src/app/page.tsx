'use client'

import { useState } from 'react'

import NewHomePage from '@/components/pages/NewHomePage'

// Import styles
import './globals.css'

export default function Home() {
  const [isTransitioning] = useState(false)
  const [selectedCard] = useState<string | null>(null)

  return (
    <NewHomePage
      isTransitioning={isTransitioning}
      selectedCard={selectedCard}
    />
  )
}