'use client'

import { useState, useEffect } from 'react'

interface VotedStrategy {
  id: string
  votedAt: string
}

export function useVotes() {
  const [votedStrategies, setVotedStrategies] = useState<VotedStrategy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadVotes = () => {
      try {
        const stored = localStorage.getItem('votedStrategies')
        if (stored) {
          const parsed = JSON.parse(stored)
          setVotedStrategies(parsed)
        }
      } catch (error) {
        console.error('Error loading votes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVotes()
  }, [])

  const addVote = (strategyId: string) => {
    const newVote: VotedStrategy = {
      id: strategyId,
      votedAt: new Date().toISOString()
    }

    const updatedVotes = [...votedStrategies, newVote]
    setVotedStrategies(updatedVotes)
    localStorage.setItem('votedStrategies', JSON.stringify(updatedVotes))
  }

  const removeVote = (strategyId: string) => {
    const updatedVotes = votedStrategies.filter(vote => vote.id !== strategyId)
    setVotedStrategies(updatedVotes)
    localStorage.setItem('votedStrategies', JSON.stringify(updatedVotes))
  }

  const hasVoted = (strategyId: string) => {
    return votedStrategies.some(vote => vote.id === strategyId)
  }

  const toggleVote = (strategyId: string) => {
    if (hasVoted(strategyId)) {
      removeVote(strategyId)
    } else {
      addVote(strategyId)
    }
  }

  const clearAllVotes = () => {
    setVotedStrategies([])
    localStorage.removeItem('votedStrategies')
  }

  return {
    votedStrategies,
    isLoading,
    addVote,
    removeVote,
    hasVoted,
    toggleVote,
    clearAllVotes,
    votesCount: votedStrategies.length
  }
} 