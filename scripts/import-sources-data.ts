import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const mentalFogSources = [
  {
    feeling_slug: 'mental_fog',
    category: 'Executive Function, Attention, and Working Memory',
    title: 'ADHD 2.0',
    authors: 'Edward M. Hallowell & John J. Ratey',
    description: 'Explores the Default Mode Network (DMN) and how dysregulated focus and mental "drift" fuel fog.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Executive Function, Attention, and Working Memory',
    title: 'Driven to Distraction',
    authors: 'Edward M. Hallowell & John J. Ratey',
    description: 'A foundational text on ADHD\'s impact on attention, impulse control, and inner "tangles" that block mental clarity.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Executive Function, Attention, and Working Memory',
    title: 'The Disorganized Mind',
    authors: 'Nancy A. Ratey',
    description: 'Describes how erratic working memory and wandering attention create overwhelm and fogginess.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Executive Function, Attention, and Working Memory',
    title: 'Succeeding With Adult ADHD',
    authors: 'Abigail L. Levrini',
    description: 'Explains how executive deficits — especially working memory and metacognition — contribute to distractibility and disorientation.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Executive Function, Attention, and Working Memory',
    title: 'The Smart but Scattered Guide to Success',
    authors: 'Peg Dawson & Richard Guare',
    description: 'Connects stress, poor sleep, and emotional dysregulation to attention struggles and cognitive fatigue.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Executive Function, Attention, and Working Memory',
    title: 'The Neurodivergence Skills Workbook for Autism and ADHD',
    authors: 'Jennifer Kemp & Monique Mitchelson',
    description: 'Covers burnout and overload from executive function difficulties, especially in neurodivergent individuals.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Emotional Overwhelm, Shame, and Dysregulation',
    title: 'A Radical Guide for Women with ADHD',
    authors: 'Sari Solden, Michelle Frank, & Ellen Littman',
    description: 'Explains how emotional reactivity, shame, and gendered masking lead to overwhelm and mental collapse.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Emotional Overwhelm, Shame, and Dysregulation',
    title: 'How to ADHD',
    authors: 'Jessica McCabe',
    description: 'Breaks down how attention dysregulation, sensory overload, and emotional intensity contribute to brain fog.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Emotional Overwhelm, Shame, and Dysregulation',
    title: 'Small Talk: 10 ADHD Lies and How to Stop Believing Them',
    authors: 'Richard & Roxanne Pink',
    description: 'Identifies internalized shame and negative self-talk as fog-generating barriers to clarity and action.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Emotional Overwhelm, Shame, and Dysregulation',
    title: 'The ADHD Effect on Marriage',
    authors: 'Melissa Orlov',
    description: 'Describes "flat" information processing in ADHD — the struggle to filter and prioritize — leading to cognitive paralysis.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Emotional Overwhelm, Shame, and Dysregulation',
    title: 'Unapologetically ADHD',
    authors: 'Nikki Kinzer & Pete D. Wright',
    description: 'Frames fog as the natural byproduct of executive overload, especially in emotionally demanding lives.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Nutrition, Movement, and Lifestyle',
    title: 'Brain Brilliance',
    authors: 'Lucinda Miller',
    description: 'Details how gut health and nutrient deficiencies affect mental stamina and cognitive clarity.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Nutrition, Movement, and Lifestyle',
    title: 'Nutrition for ADHD and Dyslexia',
    authors: 'Emma Derbyshire',
    description: 'Explores the gut-brain connection and how "under-fueling" worsens task performance and fog.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Nutrition, Movement, and Lifestyle',
    title: 'Healthy Happy ADHD',
    authors: 'Lisa Dee',
    description: 'Offers lifestyle approaches for regulating dopamine and nervous system balance to reduce brain fog.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Nutrition, Movement, and Lifestyle',
    title: 'The Body Keeps the Score',
    authors: 'Bessel van der Kolk',
    description: 'Highlights how ADHD brains may have excess slow-wave activity, impairing judgment and clarity.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Nutrition, Movement, and Lifestyle',
    title: '100+ Successful Tips for Adults with ADHD',
    authors: '',
    description: 'Shares body-based and mindfulness interventions that help improve focus and reduce overwhelm.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Mindfulness, Systems, and Mental Load',
    title: '6 Essential Mindfulness Practices',
    authors: 'Alexandra Loewe & The ADHD Centre',
    description: 'Discusses breathwork and body scans to quiet the mind and support executive regulation.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Mindfulness, Systems, and Mental Load',
    title: 'Building a Second Brain',
    authors: 'Tiago Forte',
    description: 'Offers tools for reducing mental clutter and offloading working memory to restore cognitive bandwidth.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Mindfulness, Systems, and Mental Load',
    title: 'Order from Chaos',
    authors: 'Jaclyn Paul',
    description: 'Connects task friction, attention dysregulation, and internal overwhelm to fog and inertia.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Mindfulness, Systems, and Mental Load',
    title: 'How to Keep House While Drowning',
    authors: 'KC Davis',
    description: 'Reframes mental fog as the result of stress and executive burnout, not laziness or failure.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Mindfulness, Systems, and Mental Load',
    title: 'The Anti-Planner',
    authors: 'Dani Donovan',
    description: 'Advocates "brain dumps" and micro-steps to cut through cognitive paralysis and fog.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Mindfulness, Systems, and Mental Load',
    title: 'One Weird Trick to Quit Stupid, Timewasting Content',
    authors: '',
    description: 'Encourages boredom tolerance and sensory check-ins to quiet overstimulation and restore clarity.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'It All Makes Sense Now',
    authors: 'Meredith Carder',
    description: 'Frames fog as a signal of system overload, not a personal flaw — especially during hormonal shifts.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'Mad About Money',
    authors: 'Maddy Alexander-Grout',
    description: 'Links hormone fluctuations to fog and confusion, especially in ADHDers during PMS or menopause.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'Scattered Minds',
    authors: 'Gabor Maté',
    description: 'Explores how trauma and attachment impact the brain\'s ability to regulate thoughts and attention.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'The Neurodiversity Edge',
    authors: 'Maureen Dunne',
    description: 'Discusses sensory overwhelm as a cognitive bottleneck and frequent trigger for mental shutdown.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'Women with Attention Deficit Disorder',
    authors: 'Sari Solden',
    description: 'Highlights the fog of confusion and masking in women whose ADHD is undiagnosed or misunderstood.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'You Mean I\'m Not Lazy, Stupid or Crazy!',
    authors: 'Kate Kelly & Peggy Ramundo',
    description: 'Explains how mental fog is a neurological shutdown — not a failure of effort or intelligence.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Identity, Hormones, and Development',
    title: 'How to Thrive with Adult ADHD',
    authors: 'James Kustow',
    description: 'Offers a "7-pillar" system tackling executive dysfunction, time blindness, and chronic overwhelm.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Practical Guides & Coaching Approaches',
    title: 'Productivity With ADHD',
    authors: 'Ju DOMI',
    description: 'Explores environmental, physical, and mental clutter as contributors to fog and burnout.'
  },
  {
    feeling_slug: 'mental_fog',
    category: 'Practical Guides & Coaching Approaches',
    title: 'Breaking Free From ADHD Procrastination',
    authors: 'ADDA',
    description: 'Unpacks how dopamine deficits, emotional turbulence, and overwhelm fuel task avoidance and fog.'
  }
]

async function importSourcesData() {
  console.log('🚀 Starting sources data import...')
  
  try {
    // Test table access first
    const { data: testData, error: testError } = await supabase
      .from('feeling_sources')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Cannot access feeling_sources table:', testError.message)
      console.log('Please make sure you have created the table first by running: tsx scripts/create-table-manually.ts')
      return
    }
    
    console.log('✅ Table accessible')
    
    // Clear existing mental fog sources
    const { error: deleteError } = await supabase
      .from('feeling_sources')
      .delete()
      .eq('feeling_slug', 'mental_fog')
    
    if (deleteError) {
      console.log('Note: Could not clear existing data (table might be empty):', deleteError.message)
    } else {
      console.log('✅ Cleared existing mental fog sources')
    }
    
    // Insert sources one by one to see which ones fail
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < mentalFogSources.length; i++) {
      const source = mentalFogSources[i]
      
      const { error } = await supabase
        .from('feeling_sources')
        .insert([source])
      
      if (error) {
        console.error(`❌ Failed to insert source ${i + 1}: ${source.title}`)
        console.error('Error:', error.message)
        failCount++
      } else {
        console.log(`✅ Inserted source ${i + 1}: ${source.title}`)
        successCount++
      }
    }
    
    console.log(`\n📊 Results: ${successCount} successful, ${failCount} failed`)
    
    if (successCount > 0) {
      // Verify final count
      const { data: finalData, error: countError } = await supabase
        .from('feeling_sources')
        .select('*')
        .eq('feeling_slug', 'mental_fog')
      
      if (!countError) {
        console.log(`✅ Final verification: ${finalData.length} sources in database`)
        
        // Show categories
        const categories = [...new Set(finalData.map(s => s.category))]
        console.log(`📚 Categories: ${categories.length}`)
        categories.forEach(cat => {
          const count = finalData.filter(s => s.category === cat).length
          console.log(`  • ${cat}: ${count} sources`)
        })
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

importSourcesData()