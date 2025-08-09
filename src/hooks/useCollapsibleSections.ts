import { useState, useCallback, useEffect } from 'react'

interface UseCollapsibleSectionsReturn {
  expandedSections: {[key: string]: boolean}
  toggleSection: (sectionId: string) => void
  toggleAllSections: (expand?: boolean) => void
  isAllExpanded: boolean
  isAllCollapsed: boolean
}

export function useCollapsibleSections(sectionIds: string[] = []): UseCollapsibleSectionsReturn {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }, [])
  
  const toggleAllSections = useCallback((expand?: boolean) => {
    setExpandedSections(prev => {
      // Calculate current state to decide what to do
      const allSectionIds = new Set([...sectionIds, ...Object.keys(prev)])
      
      // Also add common section IDs that we know exist on pages
      const commonSectionIds = [
        'gentle-advice', 
        'stern-advice', 
        'adhd-reasons', 
        'sources'
      ]
      commonSectionIds.forEach(id => allSectionIds.add(id))
      
      // For content sections, we need to check what's actually rendered
      // We'll scan for any elements with data-section-id attribute
      if (typeof document !== 'undefined') {
        const sectionElements = document.querySelectorAll('[data-section-id]')
        sectionElements.forEach(el => {
          const sectionId = el.getAttribute('data-section-id')
          if (sectionId) {
            allSectionIds.add(sectionId)
          }
        })
      }
      
      // Determine what to do: expand if not specified or if most sections are collapsed
      const allIds = Array.from(allSectionIds)
      const currentExpandedCount = allIds.filter(id => prev[id]).length
      const currentIsAllExpanded = allIds.length > 0 && currentExpandedCount === allIds.length
      const shouldExpand = expand !== undefined ? expand : !currentIsAllExpanded
      
      const newState: {[key: string]: boolean} = {}
      allSectionIds.forEach(sectionId => {
        newState[sectionId] = shouldExpand
      })
      
      return newState
    })
  }, [sectionIds])
  
  // Calculate if all sections are expanded or collapsed
  // Use DOM scanning to find all available sections
  const [allAvailableSections, setAllAvailableSections] = useState<string[]>([])
  
  useEffect(() => {
    const updateAvailableSections = () => {
      if (typeof document !== 'undefined') {
        const sectionElements = document.querySelectorAll('[data-section-id]')
        const domSectionIds = Array.from(sectionElements).map(el => el.getAttribute('data-section-id')).filter(Boolean) as string[]
        
        // Combine with provided sectionIds and common section IDs
        const commonSectionIds = ['gentle-advice', 'stern-advice', 'adhd-reasons', 'sources']
        const allIds = [...new Set([...sectionIds, ...domSectionIds, ...commonSectionIds])]
        
        setAllAvailableSections(prevIds => {
          // Only update if the sections have actually changed
          if (prevIds.length !== allIds.length || !prevIds.every(id => allIds.includes(id))) {
            return allIds
          }
          return prevIds
        })
      }
    }
    
    // Update immediately
    updateAvailableSections()
    
    // Update whenever the DOM changes (e.g., when content loads)
    const observer = new MutationObserver(updateAvailableSections)
    if (typeof document !== 'undefined') {
      observer.observe(document.body, { childList: true, subtree: true })
    }
    
    return () => observer.disconnect()
  }, [sectionIds])
  
  const allSectionIds = allAvailableSections.length > 0 ? allAvailableSections : Object.keys(expandedSections)
  const expandedCount = allSectionIds.filter(id => expandedSections[id]).length
  const isAllExpanded = allSectionIds.length > 0 && expandedCount === allSectionIds.length
  const isAllCollapsed = expandedCount === 0
  
  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Alt + T to toggle all sections
      if ((event.metaKey || event.ctrlKey) && event.altKey && event.code === 'KeyT') {
        event.preventDefault()
        
        // Toggle based on current state - if most are expanded, collapse all, otherwise expand all
        const shouldExpand = !isAllExpanded
        toggleAllSections(shouldExpand)
        
        // Show a brief toast notification
        const notification = document.createElement('div')
        notification.textContent = shouldExpand ? 'All sections expanded' : 'All sections collapsed'
        notification.className = `
          fixed top-4 right-4 z-50 ${shouldExpand ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-lg shadow-lg
          animate-in slide-in-from-top duration-300
        `
        document.body.appendChild(notification)
        setTimeout(() => {
          notification.remove()
        }, 2000)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleAllSections, isAllExpanded])
  
  return {
    expandedSections,
    toggleSection,
    toggleAllSections,
    isAllExpanded,
    isAllCollapsed
  }
}