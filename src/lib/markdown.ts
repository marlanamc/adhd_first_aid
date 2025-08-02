import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const guidesDirectory = path.join(process.cwd(), 'content/guides')

// Security: Sanitize file names to prevent path traversal attacks
function sanitizeFileName(fileName: string): string {
  // Remove any path separators and relative path components
  return fileName.replace(/[\/\\\.]+/g, '').replace(/[^a-zA-Z0-9_-]/g, '')
}

// Security: Validate and sanitize slug input
function validateSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug provided')
  }
  
  // Only allow alphanumeric characters, hyphens, and underscores
  const sanitized = slug.replace(/[^a-zA-Z0-9_-]/g, '')
  
  if (sanitized.length === 0) {
    throw new Error('Invalid slug: must contain alphanumeric characters')
  }
  
  return sanitized
}

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
      // Security: Sanitize the file name before using it in path.join
      const sanitizedName = sanitizeFileName(name.replace(/\.md$/, ''))
      if (!sanitizedName) {
        return null // Skip invalid files
      }
      // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
      const fullPath = path.join(guidesDirectory, sanitizedName + '.md')
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
    .filter((guide): guide is GuideMetadata => guide !== null)

  return allGuides.sort((a, b) => a.title.localeCompare(b.title))
}

export function getGuideBySlug(slug: string): Guide | null {
  if (!fs.existsSync(guidesDirectory)) {
    return null
  }

  try {
    // Security: Validate and sanitize the slug before using it in path.join
    const sanitizedSlug = validateSlug(slug)
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    const fullPath = path.join(guidesDirectory, `${sanitizedSlug}.md`)
    
    // Additional security check: ensure the resolved path is still within the guides directory
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
    const resolvedPath = path.resolve(fullPath)
    const resolvedGuidesDir = path.resolve(guidesDirectory)
    if (!resolvedPath.startsWith(resolvedGuidesDir)) {
      throw new Error('Invalid path: attempting to access file outside guides directory')
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: sanitizedSlug, // Use sanitized slug
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