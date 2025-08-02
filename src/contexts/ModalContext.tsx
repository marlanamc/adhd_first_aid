'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type PageType = 'feelings' | 'barriers' | 'tasks' | 'complex_loops' | 'identity'

interface ModalContextType {
  isOpen: boolean
  pageType?: PageType
  openModal: (type: PageType) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pageType, setPageType] = useState<PageType>('feelings')

  const openModal = (type: PageType) => {
    setPageType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider value={{ isOpen, pageType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
