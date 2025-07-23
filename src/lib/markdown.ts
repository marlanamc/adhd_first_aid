import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const guidesDirectory = path.join(process.cwd(), 'content/guides')

export interface GuideMetadata {
  title: string
  category: string
  emoji: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: string
  slug: string
}

export interface Guide extends GuideMetadata {
  content: string
}

export function getAllGuides(): GuideMetadata[] {
  if (!fs.existsSync(guidesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(guidesDirectory)
  const allGuides = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const slug = name.replace(/\.md$/, '')
      const fullPath = path.join(guidesDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        category: data.category || 'Uncategorized',
        emoji: data.emoji || '📝',
        description: data.description || '',
        tags: data.tags || [],
        difficulty: data.difficulty || 'beginner',
        readTime: data.readTime || '5 min'
      } as GuideMetadata
    })

  return allGuides.sort((a, b) => a.title.localeCompare(b.title))
}

export function getGuideBySlug(slug: string): Guide | null {
  if (!fs.existsSync(guidesDirectory)) {
    return null
  }

  try {
    const fullPath = path.join(guidesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      category: data.category || 'Uncategorized', 
      emoji: data.emoji || '📝',
      description: data.description || '',
      tags: data.tags || [],
      difficulty: data.difficulty || 'beginner',
      readTime: data.readTime || '5 min',
      content
    } as Guide
  } catch (error) {
    console.error(`Error loading guide ${slug}:`, error)
    return null
  }
}

export function getGuidesByCategory(category: string): GuideMetadata[] {
  return getAllGuides().filter(guide => guide.category === category)
}