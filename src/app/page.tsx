'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NewHomePage from '@/components/pages/NewHomePage'

// Import styles
import './globals.css'

export default function Home() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  return (
    <NewHomePage
      isTransitioning={isTransitioning}
      selectedCard={selectedCard}
    />
  )
}