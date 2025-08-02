-- Create feeling_sources table
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

CREATE INDEX IF NOT EXISTS idx_feeling_sources_feeling_slug ON feeling_sources(feeling_slug);

ALTER TABLE feeling_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to feeling_sources" ON feeling_sources;
CREATE POLICY "Allow public read access to feeling_sources" ON feeling_sources
    FOR SELECT TO PUBLIC
    USING (true);

DROP POLICY IF EXISTS "Allow public write access to feeling_sources" ON feeling_sources;  
CREATE POLICY "Allow public write access to feeling_sources" ON feeling_sources
    FOR ALL TO PUBLIC
    USING (true);

-- Insert mental fog sources data
INSERT INTO feeling_sources (feeling_slug, category, title, authors, description) VALUES 
('mental_fog', 'Executive Function, Attention, and Working Memory', 'ADHD 2.0', 'Edward M. Hallowell & John J. Ratey', 'Explores the Default Mode Network (DMN) and how dysregulated focus and mental "drift" fuel fog.'),
('mental_fog', 'Executive Function, Attention, and Working Memory', 'Driven to Distraction', 'Edward M. Hallowell & John J. Ratey', 'A foundational text on ADHD''s impact on attention, impulse control, and inner "tangles" that block mental clarity.'),
('mental_fog', 'Executive Function, Attention, and Working Memory', 'The Disorganized Mind', 'Nancy A. Ratey', 'Describes how erratic working memory and wandering attention create overwhelm and fogginess.'),
('mental_fog', 'Executive Function, Attention, and Working Memory', 'Succeeding With Adult ADHD', 'Abigail L. Levrini', 'Explains how executive deficits — especially working memory and metacognition — contribute to distractibility and disorientation.'),
('mental_fog', 'Executive Function, Attention, and Working Memory', 'The Smart but Scattered Guide to Success', 'Peg Dawson & Richard Guare', 'Connects stress, poor sleep, and emotional dysregulation to attention struggles and cognitive fatigue.'),
('mental_fog', 'Executive Function, Attention, and Working Memory', 'The Neurodivergence Skills Workbook for Autism and ADHD', 'Jennifer Kemp & Monique Mitchelson', 'Covers burnout and overload from executive function difficulties, especially in neurodivergent individuals.'),
('mental_fog', 'Emotional Overwhelm, Shame, and Dysregulation', 'A Radical Guide for Women with ADHD', 'Sari Solden, Michelle Frank, & Ellen Littman', 'Explains how emotional reactivity, shame, and gendered masking lead to overwhelm and mental collapse.'),
('mental_fog', 'Emotional Overwhelm, Shame, and Dysregulation', 'How to ADHD', 'Jessica McCabe', 'Breaks down how attention dysregulation, sensory overload, and emotional intensity contribute to brain fog.'),
('mental_fog', 'Emotional Overwhelm, Shame, and Dysregulation', 'Small Talk: 10 ADHD Lies and How to Stop Believing Them', 'Richard & Roxanne Pink', 'Identifies internalized shame and negative self-talk as fog-generating barriers to clarity and action.'),
('mental_fog', 'Emotional Overwhelm, Shame, and Dysregulation', 'The ADHD Effect on Marriage', 'Melissa Orlov', 'Describes "flat" information processing in ADHD — the struggle to filter and prioritize — leading to cognitive paralysis.'),
('mental_fog', 'Emotional Overwhelm, Shame, and Dysregulation', 'Unapologetically ADHD', 'Nikki Kinzer & Pete D. Wright', 'Frames fog as the natural byproduct of executive overload, especially in emotionally demanding lives.'),
('mental_fog', 'Nutrition, Movement, and Lifestyle', 'Brain Brilliance', 'Lucinda Miller', 'Details how gut health and nutrient deficiencies affect mental stamina and cognitive clarity.'),
('mental_fog', 'Nutrition, Movement, and Lifestyle', 'Nutrition for ADHD and Dyslexia', 'Emma Derbyshire', 'Explores the gut-brain connection and how "under-fueling" worsens task performance and fog.'),
('mental_fog', 'Nutrition, Movement, and Lifestyle', 'Healthy Happy ADHD', 'Lisa Dee', 'Offers lifestyle approaches for regulating dopamine and nervous system balance to reduce brain fog.'),
('mental_fog', 'Nutrition, Movement, and Lifestyle', 'The Body Keeps the Score', 'Bessel van der Kolk', 'Highlights how ADHD brains may have excess slow-wave activity, impairing judgment and clarity.'),
('mental_fog', 'Nutrition, Movement, and Lifestyle', '100+ Successful Tips for Adults with ADHD', '', 'Shares body-based and mindfulness interventions that help improve focus and reduce overwhelm.'),
('mental_fog', 'Mindfulness, Systems, and Mental Load', '6 Essential Mindfulness Practices', 'Alexandra Loewe & The ADHD Centre', 'Discusses breathwork and body scans to quiet the mind and support executive regulation.'),
('mental_fog', 'Mindfulness, Systems, and Mental Load', 'Building a Second Brain', 'Tiago Forte', 'Offers tools for reducing mental clutter and offloading working memory to restore cognitive bandwidth.'),
('mental_fog', 'Mindfulness, Systems, and Mental Load', 'Order from Chaos', 'Jaclyn Paul', 'Connects task friction, attention dysregulation, and internal overwhelm to fog and inertia.'),
('mental_fog', 'Mindfulness, Systems, and Mental Load', 'How to Keep House While Drowning', 'KC Davis', 'Reframes mental fog as the result of stress and executive burnout, not laziness or failure.'),
('mental_fog', 'Mindfulness, Systems, and Mental Load', 'The Anti-Planner', 'Dani Donovan', 'Advocates "brain dumps" and micro-steps to cut through cognitive paralysis and fog.'),
('mental_fog', 'Mindfulness, Systems, and Mental Load', 'One Weird Trick to Quit Stupid, Timewasting Content', '', 'Encourages boredom tolerance and sensory check-ins to quiet overstimulation and restore clarity.'),
('mental_fog', 'Identity, Hormones, and Development', 'It All Makes Sense Now', 'Meredith Carder', 'Frames fog as a signal of system overload, not a personal flaw — especially during hormonal shifts.'),
('mental_fog', 'Identity, Hormones, and Development', 'Mad About Money', 'Maddy Alexander-Grout', 'Links hormone fluctuations to fog and confusion, especially in ADHDers during PMS or menopause.'),
('mental_fog', 'Identity, Hormones, and Development', 'Scattered Minds', 'Gabor Maté', 'Explores how trauma and attachment impact the brain''s ability to regulate thoughts and attention.'),
('mental_fog', 'Identity, Hormones, and Development', 'The Neurodiversity Edge', 'Maureen Dunne', 'Discusses sensory overwhelm as a cognitive bottleneck and frequent trigger for mental shutdown.'),
('mental_fog', 'Identity, Hormones, and Development', 'Women with Attention Deficit Disorder', 'Sari Solden', 'Highlights the fog of confusion and masking in women whose ADHD is undiagnosed or misunderstood.'),
('mental_fog', 'Identity, Hormones, and Development', 'You Mean I''m Not Lazy, Stupid or Crazy!', 'Kate Kelly & Peggy Ramundo', 'Explains how mental fog is a neurological shutdown — not a failure of effort or intelligence.'),
('mental_fog', 'Identity, Hormones, and Development', 'How to Thrive with Adult ADHD', 'James Kustow', 'Offers a "7-pillar" system tackling executive dysfunction, time blindness, and chronic overwhelm.'),
('mental_fog', 'Practical Guides & Coaching Approaches', 'Productivity With ADHD', 'Ju DOMI', 'Explores environmental, physical, and mental clutter as contributors to fog and burnout.'),
('mental_fog', 'Practical Guides & Coaching Approaches', 'Breaking Free From ADHD Procrastination', 'ADDA', 'Unpacks how dopamine deficits, emotional turbulence, and overwhelm fuel task avoidance and fog.');