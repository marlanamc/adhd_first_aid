import React from 'react'
import { Expand, Minimize2 } from 'lucide-react'
import { Button } from './button'

interface CollapsibleToggleProps {
  isAllExpanded: boolean
  isAllCollapsed: boolean
  onToggleAll: (expand?: boolean) => void
  className?: string
}

export function CollapsibleToggle({ 
  isAllExpanded, 
  isAllCollapsed: _isAllCollapsed, 
  onToggleAll, 
  className = "" 
}: CollapsibleToggleProps) {
  const handleToggle = () => {
    if (isAllExpanded) {
      onToggleAll(false) // Collapse all
    } else {
      onToggleAll(true) // Expand all
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="sm"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        title="Toggle all sections (Cmd/Ctrl+Alt+T)"
      >
        {isAllExpanded ? (
          <Minimize2 className="h-4 w-4 mr-1.5" />
        ) : (
          <Expand className="h-4 w-4 mr-1.5" />
        )}
        {isAllExpanded ? "Collapse All" : "Expand All"}
      </Button>
      
      {/* Keyboard shortcut hint */}
      <div className="text-xs text-gray-500 dark:text-gray-500 hidden sm:block">
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border text-xs">
          ⌘⌥T
        </kbd>
      </div>
    </div>
  )
}