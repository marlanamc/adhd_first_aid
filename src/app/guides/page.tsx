import { ArrowLeft, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAllGuides, type GuideMetadata } from '@/lib/markdown'
import GuidesClient from './GuidesClient'

// Server-side guide loading
async function getGuides(): Promise<GuideMetadata[]> {
  try {
    const allGuides = getAllGuides()
    return allGuides
  } catch (error) {
    console.error('Error loading guides:', error)
    // Fallback sample data
    return [
      {
        title: 'Habit Stacking vs Habit Bundling',
        category: 'Task Help',
        emoji: '🔗',
        slug: 'habit-stacking-vs-bundling',
        description: 'Learn the difference between these two powerful ADHD-friendly habit techniques',
        tags: ['habits', 'productivity'],
        difficulty: 'beginner' as const,
        readTime: '5 min'
      },
      {
        title: 'Cognitive & Overload Guide',
        category: 'Feelings Support',
        emoji: '😶‍🌫️',
        slug: 'mentalfog',
        description: 'Navigate cognitive challenges and overwhelm with practical ADHD-friendly strategies',
        tags: ['feelings', 'overwhelm', 'executive function'],
        difficulty: 'beginner' as const,
        readTime: '5 min'
      },
      {
        title: 'Dysregulation & Shutdown Guide',
        category: 'Feelings Support',
        emoji: '🧯',
        slug: 'dysregulation',
        description: 'Navigate emotional overwhelm and nervous system shutdown with compassionate ADHD-friendly strategies',
        tags: ['feelings', 'regulation', 'nervous system'],
        difficulty: 'beginner' as const,
        readTime: '6 min'
      }
    ]
  }
}

const categoryColors = {
  'Behavior Change': 'from-green-400 to-emerald-500',
  'Medical Navigation': 'from-blue-400 to-cyan-500',
  'Support Systems': 'from-purple-400 to-indigo-500',
  'Decision Making': 'from-yellow-400 to-orange-500',
  'Prioritization': 'from-red-400 to-pink-500',
  'Mindset & Shame': 'from-indigo-400 to-purple-500',
  'Psychoeducation': 'from-teal-400 to-cyan-500',
  'Shame & Money': 'from-orange-400 to-amber-500',
  'Intersectional Understanding': 'from-pink-400 to-rose-500',
  'Shame & Environment': 'from-emerald-400 to-green-500',
  'Task Initiation': 'from-violet-400 to-purple-500',
  'Health & Supplements': 'from-lime-400 to-green-500',
  'Medication Education': 'from-sky-400 to-blue-500',
  'Medication Access': 'from-amber-400 to-yellow-500',
  'Sensory Support': 'from-cyan-400 to-teal-500',
  'Whole-Person Care': 'from-rose-400 to-pink-500'
}

const categories = [
  { name: 'Medication Support', color: 'from-blue-400 to-cyan-500', count: 0 },
  { name: 'Support Systems', color: 'from-purple-400 to-indigo-500', count: 0 },
  { name: 'Task Help', color: 'from-green-400 to-emerald-500', count: 1 },
  { name: 'Shame and Emotions', color: 'from-pink-400 to-rose-500', count: 0 },
  { name: 'Feelings Support', color: 'from-rose-400 to-pink-500', count: 2 },
  { name: 'Barriers Support', color: 'from-orange-400 to-amber-500', count: 0 },
  { name: 'Tasks Support', color: 'from-teal-400 to-cyan-500', count: 0 },
  { name: 'Identities Support', color: 'from-violet-400 to-purple-500', count: 0 },
  { name: 'View All', color: 'from-gray-400 to-gray-600', count: 3 }
]

export default async function GuidesPage() {
  const guides = await getGuides()
  
  return <GuidesClient guides={guides} categories={categories} />
}