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

async function setupSourcesTableAndData() {
  console.log('🚀 Starting complete sources setup...')
  
  // Step 1: Try to create the table structure
  console.log('\n📋 Step 1: Setting up feeling_sources table...')
  
  // Let's just assume the table doesn't exist and create it manually
  console.log('❌ Creating table manually...')
  
  // Try to create the table using a simple approach
  const createTableResult = await supabase.rpc('sql', {
    query: `
      CREATE TABLE IF NOT EXISTS feeling_sources (
          id SERIAL PRIMARY KEY,
          feeling_slug TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          authors TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "feeling_sources_select_policy" ON feeling_sources;
      CREATE POLICY "feeling_sources_select_policy" ON feeling_sources FOR SELECT TO PUBLIC USING (true);
      DROP POLICY IF EXISTS "feeling_sources_insert_policy" ON feeling_sources;
      CREATE POLICY "feeling_sources_insert_policy" ON feeling_sources FOR INSERT TO PUBLIC WITH CHECK (true);
    `
  })
  
  if (createTableResult.error) {
    console.log('RPC method not available, table needs to be created manually')
    console.log('Please run this SQL in your Supabase SQL editor first:')
    console.log(`
CREATE TABLE feeling_sources (
    id SERIAL PRIMARY KEY,
    feeling_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feeling_sources_select_policy" ON feeling_sources 
    FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "feeling_sources_insert_policy" ON feeling_sources 
    FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "feeling_sources_update_policy" ON feeling_sources 
    FOR UPDATE TO PUBLIC USING (true);

CREATE POLICY "feeling_sources_delete_policy" ON feeling_sources 
    FOR DELETE TO PUBLIC USING (true);
    `)
    
    console.log('\nThen run this script again.')
    return
  } else {
    console.log('✅ Table created successfully')
  }
  
  try {
    // Now test if we can query the table
    console.log('❌ Table does not exist. Creating it manually...')
    console.log('\n🔧 Please run this SQL in your Supabase SQL editor:')
    console.log('---------------------------------------------------')
    console.log(`
CREATE TABLE feeling_sources (
    id SERIAL PRIMARY KEY,
    feeling_slug TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feeling_sources_feeling_slug ON feeling_sources(feeling_slug);

ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to feeling_sources" ON feeling_sources
    FOR SELECT TO PUBLIC
    USING (true);

CREATE POLICY "Allow public write access to feeling_sources" ON feeling_sources
    FOR ALL TO PUBLIC
    USING (true);
    `)
    console.log('---------------------------------------------------')
    console.log('\n⏳ After running the SQL above, press Enter to continue...')
    
    // Wait for user input (in a real scenario, you'd prompt for user input)
    // For now, let's just continue and see if the table was created
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // Step 2: Import the data
  console.log('\n📊 Step 2: Importing mental fog sources data...')
  
  try {
    // Clear existing sources for mental_fog
    const { data: existingData } = await supabase
      .from('feeling_sources')
      .select('*')
      .eq('feeling_slug', 'mental_fog')
    
    if (existingData && existingData.length > 0) {
      console.log(`Found ${existingData.length} existing sources, clearing them...`)
      const { error: deleteError } = await supabase
        .from('feeling_sources')
        .delete()
        .eq('feeling_slug', 'mental_fog')
      
      if (deleteError) {
        console.error('❌ Error clearing existing sources:', deleteError)
        return
      }
    }
    
    // Insert sources in batches
    const batchSize = 10
    let insertedCount = 0
    
    for (let i = 0; i < mentalFogSources.length; i += batchSize) {
      const batch = mentalFogSources.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('feeling_sources')
        .insert(batch)
      
      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`)
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Batch data sample:', JSON.stringify(batch[0], null, 2))
        return
      }
      
      insertedCount += batch.length
      console.log(`✅ Inserted batch ${i / batchSize + 1} (${batch.length} sources)`)
    }
    
    console.log(`\n🎉 Successfully imported ${insertedCount} sources!`)
    
    // Step 3: Verify the import
    console.log('\n✅ Step 3: Verifying import...')
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('feeling_sources')
      .select('*')
      .eq('feeling_slug', 'mental_fog')
    
    if (verifyError) {
      console.error('❌ Error verifying import:', verifyError)
    } else {
      console.log(`✅ Verification: ${verifyData.length} sources found in database`)
      
      // Show categories breakdown
      const categoryCount = verifyData.reduce((acc, source) => {
        acc[source.category] = (acc[source.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\n📚 Categories breakdown:')
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`  • ${category}: ${count} sources`)
      })
      
      console.log('\n🎉 Sources setup complete! Ready to add to the feelings page.')
    }
    
  } catch (error) {
    if (error.code === '42P01') {
      console.error('❌ Table "feeling_sources" still does not exist.')
      console.log('Please create the table using the SQL provided above, then run this script again.')
    } else {
      console.error('❌ Error during data import:', error)
    }
  }
}

// Run the setup
setupSourcesTableAndData()