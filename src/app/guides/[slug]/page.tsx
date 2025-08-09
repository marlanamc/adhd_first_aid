import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getGuideBySlug, type Guide } from '@/lib/markdown'
import GuideClient from './GuideClient'
import GuideClientEnhanced from './GuideClientEnhanced'

interface GuidePageProps {
  params: {
    slug: string
  }
}

async function getGuide(slug: string): Promise<Guide | null> {
  try {
    const guide = getGuideBySlug(slug)
    return guide
  } catch (error) {
    console.error('Error loading guide:', error)
    return null
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuide(params.slug)

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#CAE5FF] dark:bg-[#2B4365] relative flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Guide Not Found</h1>
          <p className="text-black/70 dark:text-white/70 mb-6">
            The guide you're looking for doesn't exist or hasn't been created yet.
          </p>
          <Button 
            onClick={() => window.history.back()} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Use enhanced version for guides with timeline or complex scientific content
  const enhancedGuides = ['is-it-time-to-rethink-adhd']
  const useEnhanced = enhancedGuides.includes(params.slug)

  return useEnhanced ? <GuideClientEnhanced guide={guide} /> : <GuideClient guide={guide} />
}