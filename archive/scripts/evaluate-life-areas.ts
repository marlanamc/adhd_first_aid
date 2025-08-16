#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

type ContentSection = { title: string; emoji: string; content: string[]; subsections?: { title: string; emoji: string; content: string[] }[] }

type Task = {
  id: string
  task_name: string
  subtitle?: string
  intro_paragraph: string
  gentle_advice: string
  stern_advice: string
  adhd_reasons: string[]
  content_sections: ContentSection[]
}

type Source = { category: string; title: string; authors: string | null; description: string }

const SHAMING_PATTERNS = [
  /\b(lazy|weak|failure|failed|fail)\b/i,
  /\bno\s+excuses\b/i,
  /\bjust\s+(do|start|focus|finish|get|try|stop)\b/i,
  /\bsimply\s+(do|start|focus|finish|get|try|stop)\b/i,
  /\b(you\s+should|you\s+must|you\s+have\s+to)\b/i,
  /\bwhy\s+can(?:'|)t\s+you\b/i,
  /\bdiscipline\b/i,
]

const UNREALISTIC_PATTERNS = [
  /\b(always|never)\b/i,
  /\b(must|should|have to|need to)\b/i,
]

const ADHD_FRIENDLY_MARKERS = [
  /it'?s\s+okay/i,
  /start\s+small|tiny\s+step|break\s+it\s+down|micro\-?task/i,
  /timer|pomodoro|time\s+block/i,
  /body\s+double|accountability/i,
  /externalize|checklist|reminder|calendar/i,
  /compassion|gently|no\s+shame|not\s+your\s+fault/i,
  /executive\s+function|working\s+memory|time\s+blindness|motivation/i,
]

const DOMAIN_TERMS = [
  'executive function', 'working memory', 'time blindness', 'attention', 'motivation', 'dopamine',
  'hyperfocus', 'rejection sensitivity', 'shame', 'perfectionism', 'nervous system', 'sensory',
  'externalize', 'checklist', 'timer', 'body double', 'environment', 'structure', 'routine', 'habit',
  'medication', 'sleep', 'nutrition', 'hormone',
]

function normalizeText(s: string): string {
  return (s || '').toLowerCase().replace(/[_*`~]/g, '').replace(/\s+/g, ' ').trim()
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const urlMappings: Record<string, string> = {
  'adhd hygiene': 'hygiene',
  'adhd & hygiene': 'hygiene',
  'bills money': 'bills-and-money',
  'to do lists': 'to-do-lists',
  'big exam prep long term studying': 'big-exam-prep',
}

const slugMappings: Record<string, string> = {
  'focus-and-time': 'focus-time',
  'bills-and-money': 'bills-money',
  'budgeting-and-tracking': 'budgeting-tracking',
  'big-exam-prep-long-term-studying': 'big-exam-prep',
  'cleaning-out-the-fridge': 'cleaning-out-fridge',
  'filling-out-documents': 'filling-out-docs',
  'to-do-lists': 'todo-lists',
  'trash-and-recycling': 'trash-recycling',
  'planning-and-scheduling': 'planning-scheduling',
}

function generateCandidates(slug: string): string[] {
  const variants = new Set<string>()
  const add = (s: string) => variants.add(s.replace(/--+/g, '-').replace(/^-+|-+$/g, ''))
  add(slug)
  add(slug.replace(/-and-/g, '-'))
  add(slug.replace(/-the-/g, '-'))
  add(slug.replace(/-of-/g, '-'))
  add(slug.replace(/-on-/g, '-'))
  add(slug.replace(/documents/g, 'docs'))
  add(slug.replace(/docs/g, 'documents'))
  add(slug.replace(/to-do/g, 'todo'))
  add(slug.replace(/todo/g, 'to-do'))
  add(slug.replace(/trash-and-recycling/g, 'trash-recycling'))
  add(slug.replace(/-/g, '_'))
  const tokens = slug.split('-').filter(Boolean)
  if (tokens.length > 0) add(tokens[tokens.length - 1])
  if (tokens.length > 1) add(tokens.slice(-2).join('-'))
  return Array.from(variants)
}

async function getSourcesForTask(taskName: string): Promise<Source[]> {
  const baseName = (urlMappings[taskName.toLowerCase()] || taskName).trim()
  const baseSlug = slugMappings[slugify(baseName)] || slugify(baseName)
  const candidates = Array.from(new Set([baseSlug, ...generateCandidates(baseSlug)]))
  for (const cand of candidates) {
    const { data, error } = await supabase
      .from('life_areas_sources')
      .select('*')
      .eq('life_area_slug', cand)
    if (error) continue
    if (data && data.length > 0) return data as Source[]
  }
  return []
}

function collectTaskText(t: Task): string {
  const parts: string[] = []
  parts.push(t.intro_paragraph || '')
  parts.push(t.gentle_advice || '')
  parts.push(t.stern_advice || '')
  ;(t.adhd_reasons || []).forEach(r => parts.push(r))
  ;(t.content_sections || []).forEach(sec => {
    ;(sec.content || []).forEach(c => parts.push(c))
    ;(sec.subsections || []).forEach(sub => (sub.content || []).forEach(c => parts.push(c)))
  })
  return normalizeText(parts.join('\n'))
}

function findMatches(patterns: RegExp[], text: string): string[] {
  const hits: string[] = []
  for (const re of patterns) {
    const m = text.match(re)
    if (m) hits.push(re.source)
  }
  return hits
}

async function main() {
  const { data, error } = await supabase
    .from('tasks_content')
    .select('*')
    .order('task_name')
  if (error) {
    console.error('Error fetching tasks_content:', error.message)
    process.exit(1)
  }
  const tasks = (data || []) as Task[]

  const report: Array<any> = []
  for (const t of tasks) {
    const text = collectTaskText(t)
    const shaming = findMatches(SHAMING_PATTERNS, text)
    const unrealistic = findMatches(UNREALISTIC_PATTERNS, text)
    const friendly = findMatches(ADHD_FRIENDLY_MARKERS, text)

    const sources = await getSourcesForTask(t.task_name)
    const sourcesText = normalizeText(sources.map(s => `${s.title} ${s.description}`).join('\n'))

    const missingTerms = DOMAIN_TERMS.filter(term => {
      const termRe = new RegExp(term.replace(/[-/\\^$*+?.()|[\]{}]/g, '.'), 'i')
      return !termRe.test(text) && termRe.test(sourcesText)
    })

    report.push({
      task: t.task_name,
      shamingCount: shaming.length,
      unrealisticCount: unrealistic.length,
      friendlyMarkers: friendly.length,
      missingTerms,
    })
  }

  // Print concise, readable report
  for (const r of report) {
    const flags: string[] = []
    if (r.shamingCount > 0) flags.push(`shaming:${r.shamingCount}`)
    if (r.unrealisticCount > 1) flags.push(`unrealistic:${r.unrealisticCount}`)
    if (r.friendlyMarkers < 2) flags.push('low-friendly-markers')
    if (r.missingTerms.length > 0) flags.push(`missing:${r.missingTerms.join(', ')}`)
    const status = flags.length ? `⚠ ${flags.join(' | ')}` : '✅ ok'
    console.log(`${r.task}: ${status}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })

