import React from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Construction, RotateCcw, Puzzle, Rainbow } from 'lucide-react';

export function SupportBoxes() {
  return (
    <div className="space-y-4">
      {/* Top Row - Life Areas and Barriers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/life_areas'}
          className="p-4 text-left h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Need help with specific life areas?</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Life Areas</div>
            </div>
          </div>
        </Button>

        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/barriers'}
          className="p-4 text-left h-auto border-2 hover:bg-orange-100 dark:hover:bg-orange-900/40"
        >
          <div className="flex items-center gap-3">
            <Construction className="h-5 w-5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Facing barriers or obstacles?</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Barriers Support</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Middle Row - Complex Loops and Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/complex_loops'}
          className="p-4 text-left h-auto border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Stuck in repetitive patterns?</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">→ Browse Complex Loops</div>
            </div>
          </div>
        </Button>

        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/identities'}
          className="p-4 text-left h-auto border-2 hover:bg-pink-50 dark:hover:bg-pink-900/20"
        >
          <div className="flex items-center gap-3">
            <Rainbow className="h-5 w-5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Need identity-aware support?</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">→ Browse by Identity</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Bottom Row - Systems Lab */}
      <div className="grid grid-cols-1 gap-4">
        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/systems'}
          className="p-4 text-left h-auto border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <div className="flex items-center gap-3">
            <Puzzle className="h-5 w-5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Want to build a system around this?</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">→ Go to Systems Lab</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
} 