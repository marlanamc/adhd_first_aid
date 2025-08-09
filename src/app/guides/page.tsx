import { getAllGuides, type GuideMetadata } from '@/lib/markdown'
import GuidesClient from './GuidesClient'

// Server-side guide loading
async function getGuides(): Promise<GuideMetadata[]> {
  try {
    return getAllGuides()
  } catch (error) {
    console.error('Error loading guides:', error)

    return []
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

function buildCategories(guides: GuideMetadata[]) {
  const counts = new Map<string, number>()
  for (const g of guides) {
    const name = g.category || 'Uncategorized'
    counts.set(name, (counts.get(name) || 0) + 1)
  }
  const list = Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      color: (categoryColors as Record<string, string>)[name] || 'from-gray-400 to-gray-600',
      count
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
  list.push({ name: 'View All', color: 'from-gray-400 to-gray-600', count: guides.length })
  return list
}

export default async function GuidesPage() {
  const guides = await getGuides()
  const categories = buildCategories(guides)
  return <GuidesClient guides={guides} categories={categories} />
}