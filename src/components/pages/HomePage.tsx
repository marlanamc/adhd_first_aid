import { Button } from '@/components/ui/button'

interface HomePageProps {
  viewMode: 'feeling' | 'task'
  setViewMode: (mode: 'feeling' | 'task') => void
  feelings: string[]
  tasks: string[]
  handleFeelingSelect: (feeling: string) => void
  handleTaskSelect: (task: string) => void
  isTransitioning: boolean
}

export default function HomePage({
  viewMode,
  setViewMode,
  feelings,
  tasks,
  handleFeelingSelect,
  handleTaskSelect,
  isTransitioning
}: HomePageProps) {
  return (
    <div className="ocean-gradient min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-foreground mb-4 leading-relaxed">
              {viewMode === 'feeling' ? 'How are you feeling right now?' : 'What would you like help with?'}
            </h2>
            
            <Button
              variant="ghost"
              size="default"
              onClick={() => setViewMode(viewMode === 'feeling' ? 'task' : 'feeling')}
              className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-300 underline decoration-dotted underline-offset-4 font-light"
            >
              {viewMode === 'feeling' ? 'Switch to tasks' : 'Switch to feelings'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {(viewMode === 'feeling' ? feelings : tasks).map((item, index) => (
              <Button
                key={item}
                variant="ghost"
                size="lg"
                onClick={() => viewMode === 'feeling' ? handleFeelingSelect(item) : handleTaskSelect(item)}
                className="feeling-button"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
                  opacity: isTransitioning ? 0 : 1
                }}
              >
                <span className="text-center leading-tight">{item}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Hover-only Reassuring Message */}
        <div className="text-center py-8 md:py-12 group cursor-default">
          <div className="max-w-2xl mx-auto space-y-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-light">
              You're not failing — you're just overwhelmed.
            </p>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light italic">
              This is a gentle space with tools designed specifically for ADHD minds. 
              Take your time, breathe, and choose what feels right for you today.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

