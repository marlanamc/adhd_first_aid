import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface LegalSection {
  title: string
  content: string
}

export interface LegalDocument {
  content: string
  data: {
    [key: string]: any
  }
  sections: LegalSection[]
}

export async function getLegalDocument(filename: string): Promise<LegalDocument> {
  const fullPath = path.join(process.cwd(), 'public', filename)
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const sections = parseMarkdownToSections(content)
    
    return {
      content,
      data,
      sections
    }
  } catch (error) {
    console.error(`Error reading legal document ${filename}:`, error)
    throw new Error(`Could not load legal document: ${filename}`)
  }
}

export function parseMarkdownToSections(content: string): LegalSection[] {
  // Split content by headers (## sections)
  const sections = content.split(/(?=^## )/gm).filter(section => section.trim())
  
  return sections.map(section => {
    const lines = section.trim().split('\n')
    const title = lines[0].replace(/^## /, '').trim()
    const sectionContent = lines.slice(1).join('\n').trim()
    
    return {
      title,
      content: sectionContent
    }
  })
}

// Simple markdown to HTML converter for basic formatting
export function renderMarkdown(text: string): string {
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks for paragraphs
    .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed">')
    // Lists
    .replace(/^- (.+)/gm, '<li class="text-muted-foreground">$1</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul class="space-y-2 ml-4">$1</ul>')
}

export async function getTermsOfService(): Promise<LegalDocument> {
  return getLegalDocument('terms-of-service.md')
}

export async function getPrivacyPolicy(): Promise<LegalDocument> {
  return getLegalDocument('privacy-policy.md')
}