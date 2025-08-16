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

async function main() {
  const taskName = 'Big Exam Prep (Long-Term Studying)'

  const gentle_advice = [
    'Open what you already have and highlight 3 key terms — then stop.',
    'Set a 5‑minute timer: read one concept and jot one messy cue card.',
    'Send a “body double?” text; study together for 10 minutes and check in.',
    'Put tomorrow’s study kit in plain sight (book, pen, timer) so starting is easier.',
  ].join(' ')

  const stern_advice = [
    'Waiting to “feel ready” usually means not starting. Two minutes now is better than perfect later.',
    'Put your phone in another room, start a 15‑minute timer, and open just one tab.',
    'Perfect plans are procrastination in disguise. One card > none.',
  ].join(' ')

  const adhd_reasons: string[] = [
    'You might:',
    '- Re‑read the same page and not remember it later',
    '- Plan to study but freeze when it is time to start',
    '- Lose track of materials or what comes next',
    '- Crash when energy or interest dips',
    "Here's what's really going on:",
    '🧩 **Executive function load** — initiation and sequencing are hard. Use 1‑step starts + checklists.',
    '🧠 **Working memory gaps** — information slips without retrieval. Favor flashcards over re‑reading.',
    '⏰ **Time blindness** — time feels fuzzy. Use visible timers + short time boxes.',
    '💥 **Motivation follows interest/urgency** — create stakes: body doubling and micro‑deadlines.',
    '🌬️ **Sensory + environment** — noise/visual clutter drains focus. Tidy a 1‑ft zone; headphones help.',
    '🔁 **Routines externalize effort** — same place, same time, same first action.',
  ]

  const content_sections = [
    {
      emoji: '🧠',
      title: 'Core Principles',
      content: [
        'Make it visible (materials out where you start).',
        'Start tiny (60–120 seconds) to warm up the brain.',
        'Retrieve > re‑read (cue cards and quick recalls).',
        'Repeat rhythms, not heroic sprints.',
        'Name the value this exam serves; schedule to protect that value.',
        'Map “If I study, I fear …” → competing commitments → safe experiments.',
        "Set 'enough' criteria per session; stop when met—no guilt.",
      ],
    },
    {
      emoji: '🔧',
      title: 'Strategies',
      content: [
        '**Two‑Card Rule**: 1 definition + 1 example — stop.',
        '**Pomodoro‑Lite**: 10 min on, 2 min off, 3 cycles max.',
        '**Explain‑out‑loud**: record a 30‑sec voice note per concept.',
        'Pick the easiest or most interesting next tiny action.',
        'Anchor a 2‑minute start after an existing habit; celebrate each rep.',
      ],
    },
    {
      emoji: '🧰',
      title: 'Tools & Externalization',
      content: [
        'Daily 3‑slot mini‑plan (Now / Next / Later).',
        'Cue cards + spaced repetition (1d / 3d / 7d).',
        'Keep a simple “study kit” container on the desk.',
        'Use a 3‑column Kanban (To‑do / Doing / Done) and a daily checklist to offload working memory.',
        'Store materials using PARA (Projects, Areas, Resources, Archive) so you always know where to put/ find notes.',
        'Bullet Journal index + daily log for study tasks.',
      ],
    },
    {
      emoji: '🌬️',
      title: 'Environment & Sensory',
      content: [
        'Clear 1 square foot of desk; everything else in a bin.',
        'Noise management (NC headphones, brown noise, or quiet).',
        'Adjust lighting/posture for alertness without strain.',
      ],
    },
    {
      emoji: '🤝',
      title: 'Support & Accountability',
      content: [
        'Body‑double check‑ins at :00 and :30 (text or call).',
        'Micro‑deadlines (send a proof pic of notes/cards).',
        'Weekly check‑in script: What worked? What got in the way? What’s the next smallest step?',
        'Even if you usually go solo, external structure (class/tutor) helps many ADHD brains.',
      ],
    },
    {
      emoji: '💊',
      title: 'Health Anchors',
      content: [
        'Water + small protein/carb before a session.',
        'Sleep target for memory consolidation.',
        'Medication timing (if applicable).',
      ],
    },
  ]

  const { data: row, error: fetchErr } = await supabase
    .from('tasks_content')
    .select('id, task_name')
    .eq('task_name', taskName)
    .single()

  if (fetchErr) {
    console.error('Fetch error:', fetchErr.message)
    process.exit(1)
  }
  if (!row) {
    console.error('Task not found:', taskName)
    process.exit(1)
  }

  const { error: updErr } = await supabase
    .from('tasks_content')
    .update({ gentle_advice, stern_advice, adhd_reasons, content_sections })
    .eq('id', row.id)

  if (updErr) {
    console.error('Update error:', updErr.message)
    process.exit(1)
  }

  console.log('Updated content for:', taskName)
}

main().catch(e => { console.error(e); process.exit(1) })

