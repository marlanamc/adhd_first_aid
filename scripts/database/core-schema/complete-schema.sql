-- ==========================
-- ADHD First Aid Kit - Complete Database Schema
-- ==========================
-- This file contains the complete database schema for the ADHD First Aid Kit application
-- Including all tables, relationships, policies, and sample data
-- 
-- Run this script in your Supabase SQL editor to set up the complete database
-- ==========================

-- ==========================
-- DROP EXISTING TABLES (if needed for reset)
-- ==========================
-- Uncomment the following lines if you need to reset the database
/*
DROP TABLE IF EXISTS strategy_votes CASCADE;
DROP TABLE IF EXISTS strategy_why_does_this_work CASCADE;
DROP TABLE IF EXISTS strategy_styles CASCADE;
DROP TABLE IF EXISTS strategy_solution_types CASCADE;
DROP TABLE IF EXISTS strategy_life_roles CASCADE;
DROP TABLE IF EXISTS strategy_help_tasks CASCADE;
DROP TABLE IF EXISTS strategy_tags CASCADE;
DROP TABLE IF EXISTS strategy_barriers CASCADE;
DROP TABLE IF EXISTS strategy_issues CASCADE;
DROP TABLE IF EXISTS strategy_feelings CASCADE;
DROP TABLE IF EXISTS strategies CASCADE;
DROP TABLE IF EXISTS why_does_this_work CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS solution_types CASCADE;
DROP TABLE IF EXISTS life_roles CASCADE;
DROP TABLE IF EXISTS help_tasks CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS barriers CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS feelings CASCADE;
*/

-- ==========================
-- CORE STRATEGIES TABLE
-- ==========================

CREATE TABLE strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- Strategy name
  subtitle text, -- Short memorable subtitle
  description text, -- Main description content
  example text, -- Usage examples
  use_case text, -- When to use this strategy
  source text, -- Where the strategy comes from
  icon_file text, -- Lucide icon name (e.g., 'brain', 'heart', 'zap')
  image text, -- Image filename in public/strategies_images/ folder
  image_source text, -- Source URL for the image
  further_reading_text text, -- Text to display for further reading link
  further_reading_url text, -- URL for further reading link
  further_reading_suggestions text, -- Additional reading suggestions
  adhd_friendly_improvement text, -- ADHD-friendly improvements
  why_does_this_work text, -- Why this strategy works
  featured boolean DEFAULT false, -- Whether strategy is featured
  price text, -- Cost indicator (Free, $, $$, $$$)
  vote_count integer DEFAULT 0, -- Vote count for popularity
  reviewed boolean DEFAULT false, -- Whether strategy has been reviewed
  help_task_id uuid, -- Direct reference to help task
  barrier_id uuid, -- Direct reference to barrier
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==========================
-- LOOKUP TABLES
-- ==========================

-- Feelings table with categorization and UI metadata
CREATE TABLE feelings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Emotional Turmoil', 'Low Energy'
  emoji text, -- Display emoji
  color text, -- Hex color for UI theming
  hover_description text -- Tooltip text
);

-- Issues table with categorization and UI metadata
CREATE TABLE issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Task Initiation / Completion', 'Mental State Issues'
  emoji text,
  color text,
  hover_description text
);

-- Barriers table with categorization and UI metadata
CREATE TABLE barriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Cognitive Barriers', 'Emotional Barriers'
  emoji text,
  color text,
  hover_description text
);

-- Help Tasks table with categorization and UI metadata
CREATE TABLE help_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Getting Started', 'Planning + Organization'
  emoji text,
  color text,
  hover_description text
);

-- Tags table for miscellaneous categorization
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'energy_state', 'task_context', 'mental_state'
  emoji text,
  color text,
  hover_description text
);

-- Life Roles table
CREATE TABLE life_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Parenting', 'Professional', 'Student'
  emoji text,
  color text,
  hover_description text
);

-- Solution Types table
CREATE TABLE solution_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Tool Type'
  emoji text,
  color text,
  hover_description text
);

-- Strategy Styles table
CREATE TABLE styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Interaction Style'
  emoji text,
  color text,
  hover_description text
);

-- Why Does This Work mechanisms table
CREATE TABLE why_does_this_work (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- e.g., 'Dopamine & Motivation', 'Executive Function Support'
  emoji text,
  color text,
  hover_description text
);

-- ==========================
-- JUNCTION TABLES (Many-to-Many Relationships)
-- ==========================

CREATE TABLE strategy_feelings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  feeling_id uuid REFERENCES feelings(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, feeling_id)
);

CREATE TABLE strategy_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, issue_id)
);

CREATE TABLE strategy_barriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  barrier_id uuid REFERENCES barriers(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, barrier_id)
);

CREATE TABLE strategy_help_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  help_task_id uuid REFERENCES help_tasks(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, help_task_id)
);

CREATE TABLE strategy_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, tag_id)
);

CREATE TABLE strategy_life_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  life_role_id uuid REFERENCES life_roles(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, life_role_id)
);

CREATE TABLE strategy_solution_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  solution_type_id uuid REFERENCES solution_types(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, solution_type_id)
);

CREATE TABLE strategy_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  style_id uuid REFERENCES styles(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, style_id)
);

CREATE TABLE strategy_why_does_this_work (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  why_id uuid REFERENCES why_does_this_work(id) ON DELETE CASCADE,
  UNIQUE(strategy_id, why_id)
);

-- ==========================
-- VOTING SYSTEM
-- ==========================

CREATE TABLE strategy_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  session_id text NOT NULL, -- Browser session identifier
  vote_type text CHECK (vote_type IN ('up', 'down')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(strategy_id, session_id)
);

-- ==========================
-- INDEXES FOR PERFORMANCE
-- ==========================

-- Strategy indexes
CREATE INDEX idx_strategies_featured ON strategies(featured);
CREATE INDEX idx_strategies_vote_count ON strategies(vote_count DESC);
CREATE INDEX idx_strategies_name ON strategies(name);
CREATE INDEX idx_strategies_subtitle ON strategies(subtitle);
CREATE INDEX idx_strategies_use_case ON strategies(use_case);
CREATE INDEX idx_strategies_icon_file ON strategies(icon_file);
CREATE INDEX idx_strategies_reviewed ON strategies(reviewed);
CREATE INDEX idx_strategies_help_task_id ON strategies(help_task_id);
CREATE INDEX idx_strategies_barrier_id ON strategies(barrier_id);

-- Voting indexes
CREATE INDEX idx_strategy_votes_session ON strategy_votes(session_id);
CREATE INDEX idx_strategy_votes_strategy ON strategy_votes(strategy_id);

-- Junction table indexes for faster joins
CREATE INDEX idx_strategy_feelings_strategy ON strategy_feelings(strategy_id);
CREATE INDEX idx_strategy_feelings_feeling ON strategy_feelings(feeling_id);
CREATE INDEX idx_strategy_issues_strategy ON strategy_issues(strategy_id);
CREATE INDEX idx_strategy_issues_issue ON strategy_issues(issue_id);
CREATE INDEX idx_strategy_barriers_strategy ON strategy_barriers(strategy_id);
CREATE INDEX idx_strategy_barriers_barrier ON strategy_barriers(barrier_id);
CREATE INDEX idx_strategy_help_tasks_strategy ON strategy_help_tasks(strategy_id);
CREATE INDEX idx_strategy_help_tasks_help ON strategy_help_tasks(help_task_id);
CREATE INDEX idx_strategy_tags_strategy ON strategy_tags(strategy_id);
CREATE INDEX idx_strategy_tags_tag ON strategy_tags(tag_id);

-- ==========================
-- ROW LEVEL SECURITY (RLS)
-- ==========================

-- Enable RLS on all tables
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feelings ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_does_this_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_votes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on junction tables
ALTER TABLE strategy_feelings ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_help_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_life_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_solution_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_why_does_this_work ENABLE ROW LEVEL SECURITY;

-- Public read access policies for all tables
CREATE POLICY "Public read access" ON strategies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON feelings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON issues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON barriers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON help_tasks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON life_roles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON solution_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON styles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON why_does_this_work FOR SELECT USING (true);

-- Public write access policies for lookup tables and strategies
CREATE POLICY "Public insert access" ON strategies FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON feelings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON barriers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON help_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON life_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON solution_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON styles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON why_does_this_work FOR INSERT WITH CHECK (true);

-- Junction table read policies
CREATE POLICY "Public read access" ON strategy_feelings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_issues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_barriers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_help_tasks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_life_roles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_solution_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_styles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_why_does_this_work FOR SELECT USING (true);
CREATE POLICY "Public read access" ON strategy_votes FOR SELECT USING (true);

-- Junction table insert policies
CREATE POLICY "Public insert access" ON strategy_feelings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_barriers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_help_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_life_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_solution_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_styles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON strategy_why_does_this_work FOR INSERT WITH CHECK (true);

-- Voting policies (allow public voting)
CREATE POLICY "Public vote access" ON strategy_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public vote update" ON strategy_votes FOR UPDATE USING (true) WITH CHECK (true);

-- ==========================
-- SAMPLE DATA POPULATION
-- ==========================

-- ==========================
-- HELP TASKS DATA
-- ==========================

INSERT INTO help_tasks (name, category, emoji, color, hover_description) VALUES

-- 🚀 Getting Started
('Starting Something Hard', 'Getting Started', '🚀', '#ef4444', 'You keep putting it off — even though it matters'),
('Leaving The House', 'Getting Started', '🚪', '#ef4444', 'You need to get out the door, but everything feels like friction'),
('Getting Going In The Morning', 'Getting Started', '🌅', '#ef4444', 'You''re awake, but getting started feels impossible'),
('Overcoming Procrastination', 'Getting Started', '⏰', '#ef4444', 'You keep putting things off and need help taking action'),
('Task Initiation Support', 'Getting Started', '▶️', '#ef4444', 'You need help with the first step of getting started'),

-- 🔁 Following Through
('Finishing What I Start', 'Following Through', '🏁', '#f97316', 'You begin with energy but rarely get to the end'),

-- 🧠 Planning + Organization
('Planning My Time', 'Planning + Organization', '📅', '#eab308', 'You want to use your time better but don''t know where to start'),
('Managing My Schedule', 'Planning + Organization', '🗓️', '#eab308', 'Keeping track of appointments and to-dos feels overwhelming'),

-- 🧼 Cleaning + Resetting
('Cleaning Up', 'Cleaning + Resetting', '🧽', '#22c55e', 'Your space is a mess and it''s making everything harder'),
('Resetting My Space', 'Cleaning + Resetting', '🔄', '#22c55e', 'You need a fresh start — physically and mentally'),

-- 💥 Emotional Support + Self-Regulation
('Calming Down', 'Emotional Support + Self-Regulation', '🧘', '#3b82f6', 'You''re overstimulated or overwhelmed and need to decompress'),
('Recovering From A Crash', 'Emotional Support + Self-Regulation', '🔋', '#3b82f6', 'You pushed too hard and now everything feels impossible'),
('Being Kinder To Myself', 'Emotional Support + Self-Regulation', '💚', '#3b82f6', 'You''re stuck in self-blame and need gentle support'),
('Managing Emotional Dysregulation', 'Emotional Support + Self-Regulation', '🌊', '#3b82f6', 'Your emotions feel intense and hard to control'),

-- 🎯 Focus + Motivation
('Staying Focused', 'Focus + Motivation', '🎯', '#8b5cf6', 'Your brain keeps jumping — and nothing''s getting done'),
('Finding Motivation', 'Focus + Motivation', '⚡', '#8b5cf6', 'You can''t make yourself care — even when you want to'),
('Re-Entering After A Derail', 'Focus + Motivation', '🚂', '#8b5cf6', 'You got thrown off and can''t seem to restart'),
('Focus Enhancement', 'Focus + Motivation', '🔍', '#8b5cf6', 'You need to improve your concentration and attention'),
('Maintaining Focus', 'Focus + Motivation', '⏳', '#8b5cf6', 'You can focus but struggle to sustain it over time'),
('Focus Task Execution', 'Focus + Motivation', '🎯', '#8b5cf6', 'You need help staying on track while completing tasks'),
('Overcoming Resistance', 'Focus + Motivation', '💪', '#8b5cf6', 'You feel internal pushback or avoidance toward tasks'),
('Quick Task Management', 'Focus + Motivation', '⚡', '#8b5cf6', 'You need efficient ways to handle short, urgent tasks'),

-- 🧺 Life Maintenance
('Meal Planning Or Prep', 'Life Maintenance', '🍽️', '#ec4899', 'You''re tired of scrambling for food — and decisions'),
('Catching Up On Life Tasks', 'Life Maintenance', '📋', '#ec4899', 'The little things are piling up and becoming big things'),
('Doing Errands', 'Life Maintenance', '🛒', '#ec4899', 'Everything you need is outside the house — but so is your energy'),
('Getting Through Emails', 'Life Maintenance', '📧', '#ec4899', 'Your inbox is a mountain and you don''t know where to begin'),
('Managing Bills And Finances', 'Life Maintenance', '💳', '#ec4899', 'You keep missing due dates or avoiding money tasks'),
('Personal Hygiene', 'Life Maintenance', '🛁', '#ec4899', 'Basic self-care tasks feel overwhelming or hard to remember'),

-- 🔄 Transitions & Changes
('Switching Between Tasks', 'Transitions & Changes', '🔄', '#06b6d4', 'You get stuck in one activity and can''t shift gears'),
('Adapting To Changes', 'Transitions & Changes', '🌀', '#06b6d4', 'Unexpected changes throw you off completely'),
('Ending Hyperfocus', 'Transitions & Changes', '🛑', '#06b6d4', 'You get absorbed and can''t stop when you need to'),

-- 💬 Social & Communication
('Having Difficult Conversations', 'Social & Communication', '💬', '#84cc16', 'You avoid confrontation or hard topics'),
('Setting Boundaries', 'Social & Communication', '🚧', '#84cc16', 'You say yes to everything and get overwhelmed'),
('Asking For Help', 'Social & Communication', '🙋', '#84cc16', 'You struggle to reach out when you need support'),

-- 🧠 Executive Function Specific
('Breaking Down Big Projects', 'Executive Function Specific', '🧩', '#f59e0b', 'Large tasks feel impossible to tackle'),
('Prioritizing When Everything Feels Urgent', 'Executive Function Specific', '🚨', '#f59e0b', 'You can''t figure out what to do first'),
('Following Through On Commitments', 'Executive Function Specific', '🤝', '#f59e0b', 'You make promises but struggle to keep them'),

-- ⚡ Energy Management
('Managing Energy Crashes', 'Energy Management', '🔋', '#dc2626', 'You hit a wall and can''t function'),
('Working With Inconsistent Energy', 'Energy Management', '📊', '#dc2626', 'Some days you''re on fire, others you can''t function');

-- ==========================
-- FEELINGS DATA
-- ==========================

INSERT INTO feelings (name, category, emoji, color, hover_description) VALUES

-- 🌪️ Emotional Turmoil
('Ashamed', 'Emotional Turmoil', '😔', '#dc2626', 'You feel like you''re not good enough or that you''ve disappointed someone — maybe even yourself'),
('Anxious', 'Emotional Turmoil', '😰', '#dc2626', 'Your mind is racing with worry or fear about what might happen'),
('Guilty', 'Emotional Turmoil', '😞', '#dc2626', 'You feel bad about something you did (or didn''t do), and it''s weighing on you'),
('Stressed', 'Emotional Turmoil', '😵', '#dc2626', 'There''s too much coming at you, and it''s pressing on your body and brain'),

-- 🔋 Low Energy
('Stuck', 'Low Energy', '🧊', '#6b7280', 'You want to move forward but just can''t — like something invisible is holding you in place'),
('Hopeless', 'Low Energy', '🌫️', '#6b7280', 'It feels like nothing will work, and you''re not sure it''s even worth trying'),

-- 🧠 Mental Clutter
('Forgetful', 'Mental Clutter', '🤔', '#f59e0b', 'Things keep slipping — plans, ideas, or even why you walked into the room'),
('Scattered', 'Mental Clutter', '🌪️', '#f59e0b', 'Your thoughts are all over the place, and it''s hard to grab onto just one'),

-- 🚨 Too Much at Once
('Overwhelmed', 'Too Much at Once', '🤯', '#ef4444', 'Everything feels like too much at once — too many tabs open in your mind'),
('Overstimulated', 'Too Much at Once', '🌈', '#ef4444', 'Your senses are overloaded — lights, sounds, and tasks are all too loud'),
('Burned Out', 'Too Much at Once', '🔥', '#ef4444', 'You''ve been pushing for too long, and now you feel empty, drained, or numb'),

-- 🏃 Physical/Body Feelings
('Restless', 'Physical/Body Feelings', '🏃', '#22c55e', 'You feel fidgety, like you need to move or do something'),
('Drained', 'Physical/Body Feelings', '🔋', '#22c55e', 'You feel depleted, like your battery is at 5%'),
('Wired', 'Physical/Body Feelings', '⚡', '#22c55e', 'You feel overly energized but can''t channel it productively'),

-- 🎭 Emotional Complexity
('Frustrated', 'Emotional Complexity', '😤', '#f97316', 'You''re annoyed or irritated, things aren''t working'),
('Defeated', 'Emotional Complexity', '😔', '#f97316', 'You feel like you''ve tried everything and nothing works'),
('Numb', 'Emotional Complexity', '😶', '#f97316', 'You don''t feel much of anything, emotionally flat'),

-- 👥 Social/Interpersonal
('Misunderstood', 'Social/Interpersonal', '🙄', '#8b5cf6', 'You feel like others don''t get your struggles'),
('Lonely', 'Social/Interpersonal', '😢', '#8b5cf6', 'You feel isolated in your ADHD experience');

-- ==========================
-- ISSUES DATA
-- ==========================

INSERT INTO issues (name, category, emoji, color, hover_description) VALUES

-- 🔄 Task Initiation / Completion
('Can''t Start', 'Task Initiation / Completion', '⏸️', '#dc2626', 'Tasks feel impossible to begin'),
('Can''t Finish', 'Task Initiation / Completion', '🔄', '#dc2626', 'Tasks get abandoned partway'),
('Avoidant', 'Task Initiation / Completion', '🙈', '#dc2626', 'Avoiding tasks on purpose or by instinct'),
('Frozen/Shut Down', 'Task Initiation / Completion', '🧊', '#dc2626', 'Paralyzed under pressure or overload'),
('Avoiding Routine', 'Task Initiation / Completion', '❌', '#dc2626', 'Rejecting repetitive structure'),
('Task Initiation', 'Task Initiation / Completion', '▶️', '#dc2626', 'Specific difficulty with starting tasks'),

-- 💭 Mental State Issues
('Bored', 'Mental State Issues', '😴', '#6b7280', 'Lack of stimulation or engagement'),
('Anxious', 'Mental State Issues', '😰', '#6b7280', 'Fear, dread, or unease interfering with action'),
('Depressed / Hopeless', 'Mental State Issues', '🌫️', '#6b7280', 'Emotionally flattened or directionless'),
('Spiraling', 'Mental State Issues', '🌀', '#6b7280', 'Thoughts are racing, looping, or catastrophizing'),
('Can''t Decide', 'Mental State Issues', '🤷', '#6b7280', 'Stuck in indecision or perfectionism'),
('Rejection Sensitive', 'Mental State Issues', '💔', '#6b7280', 'Feel crushed or defensive at even small signs of criticism'),
('Perfectionist', 'Mental State Issues', '✨', '#6b7280', 'Fixate on doing it "right," so nothing gets done'),
('Time Blind', 'Mental State Issues', '⏰', '#6b7280', 'Misjudge how long things take or when to start'),
('Hyperfocused', 'Mental State Issues', '🎯', '#6b7280', 'Get absorbed and can''t stop when you need to'),
('Anxiety Management', 'Mental State Issues', '😨', '#6b7280', 'Struggling with worry, fear, or anxious thoughts'),
('Emotional Regulation', 'Mental State Issues', '🌊', '#6b7280', 'Managing emotions, reactions, and emotional intensity'),

-- 📅 Time + Planning Issues
('Poor Time Estimation', 'Time + Planning Issues', '⌛', '#f59e0b', 'Chronically underestimate how long things take'),
('Missed Appointments', 'Time + Planning Issues', '📅', '#f59e0b', 'Trouble keeping track of events or deadlines'),
('Overcommitted', 'Time + Planning Issues', '📋', '#f59e0b', 'Said yes to too much, now overwhelmed'),

-- 🧠 Memory / Organization Issues
('Forgetful', 'Memory / Organization Issues', '🤔', '#8b5cf6', 'Lose track of details, plans, or ideas'),
('Disorganized', 'Memory / Organization Issues', '📚', '#8b5cf6', 'Struggle to manage clutter, routines, or mental systems'),

-- 🛌 Energy / Body Issues
('Sleep Issues', 'Energy / Body Issues', '😴', '#22c55e', 'Trouble falling or staying asleep'),
('Sensory Overload', 'Energy / Body Issues', '🌈', '#22c55e', 'Environment is too loud, bright, chaotic'),
('Can''t Focus', 'Energy / Body Issues', '👀', '#22c55e', 'Mind wanders or won''t stay on track');

-- ==========================
-- BARRIERS DATA
-- ==========================

INSERT INTO barriers (name, category, emoji, color, hover_description) VALUES

-- 🧠 Cognitive Barriers
('Time Blindness', 'Cognitive Barriers', '⏰', '#dc2626', 'Misjudge how long things take or when to start'),
('Working Memory Failures', 'Cognitive Barriers', '🧠', '#dc2626', 'Forget steps, details, or what you were just doing'),
('Task Initiation', 'Cognitive Barriers', '▶️', '#dc2626', 'Struggle to get started, even with simple tasks'),
('Executive Dysfunction', 'Cognitive Barriers', '⚙️', '#dc2626', 'Struggle to plan, prioritize, or follow through on tasks'),
('Inertia', 'Cognitive Barriers', '🧊', '#dc2626', 'Stay stuck in one mode — can''t shift gears easily'),
('Decision Fatigue', 'Cognitive Barriers', '🤯', '#dc2626', 'Feel drained by too many choices, even small ones'),
('Decision Paralysis', 'Cognitive Barriers', '❄️', '#dc2626', 'Freeze when faced with decisions — fear making the wrong one'),
('Perfectionism', 'Cognitive Barriers', '✨', '#dc2626', 'Fixate on doing it "right," so nothing gets done'),

-- 💥 Emotional Barriers
('Emotional Dysregulation', 'Emotional Barriers', '🌊', '#f97316', 'React strongly to small triggers or feel stuck in intense emotions'),
('Rejection Sensitivity', 'Emotional Barriers', '💔', '#f97316', 'Feel crushed or defensive at even small signs of criticism'),
('Masking & Shame', 'Emotional Barriers', '🎭', '#f97316', 'Hide your needs or struggles to appear "normal," then crash later'),
('Low Motivation', 'Emotional Barriers', '📉', '#f97316', 'Struggle to care or act, even when you want the outcome'),

-- 🌪️ Sensory / Physical Barriers
('Overstimulation', 'Sensory / Physical Barriers', '🌈', '#22c55e', 'Feel overwhelmed by noise, lights, notifications, or general input'),
('Environmental Cues', 'Sensory / Physical Barriers', '🏠', '#22c55e', 'Your surroundings make it harder to focus or take action'),

-- 🔧 Structural Barriers
('Task Structuring', 'Structural Barriers', '🧩', '#8b5cf6', 'Difficulty breaking down or organizing complex tasks'),
('Working Memory Engagement', 'Structural Barriers', '💾', '#8b5cf6', 'Struggle to hold information in mind while working');

-- ==========================
-- WHY DOES THIS WORK DATA
-- ==========================

INSERT INTO why_does_this_work (name, category, emoji, color, hover_description) VALUES

-- 🧠 Dopamine & Motivation
('Activates Dopamine', 'Dopamine & Motivation', '🎯', '#ef4444', 'Triggers reward pathways and motivation'),
('Gamifies Action', 'Dopamine & Motivation', '🎮', '#ef4444', 'Makes tasks feel like games with rewards'),
('Provides Instant Rewards', 'Dopamine & Motivation', '⚡', '#ef4444', 'Offers immediate positive feedback'),

-- ⚙️ Executive Function Support  
('Executive Function Support', 'Executive Function Support', '⚙️', '#f97316', 'Strategies that support planning, decision-making, and task management'),
('Reduces Decision Fatigue', 'Executive Function Support', '🧠', '#f97316', 'Minimizes choices and cognitive load'),
('Provides External Structure', 'Executive Function Support', '🏗️', '#f97316', 'Creates frameworks and systems'),
('Breaks Down Complexity', 'Executive Function Support', '🧩', '#f97316', 'Simplifies overwhelming tasks'),

-- 🧮 Cognitive Load Management
('Cognitive Load Management', 'Cognitive Load Management', '🧮', '#eab308', 'Strategies that reduce mental bandwidth and working memory demands'),
('Frees Up Working Memory', 'Cognitive Load Management', '💾', '#eab308', 'Reduces mental bandwidth requirements'),
('Minimizes Friction', 'Cognitive Load Management', '🛤️', '#eab308', 'Removes barriers to starting/continuing'),
('Externalizes Tasks', 'Cognitive Load Management', '📝', '#eab308', 'Moves info from brain to external systems'),

-- 🎯 Sensory & Engagement
('Sensory Engagement', 'Sensory & Engagement', '👁️', '#22c55e', 'Uses multiple senses to enhance focus and retention'),

-- 💚 Emotional Support
('Emotional Support', 'Emotional Support', '💚', '#3b82f6', 'Strategies that address ADHD-related emotional challenges and build resilience'),
('Emotional Regulation', 'Emotional Support', '🌊', '#3b82f6', 'Helps manage emotional intensity and reactions'),
('Reduces Shame', 'Emotional Support', '💚', '#3b82f6', 'Addresses ADHD-related guilt and self-criticism'),
('Meets You Where You Are', 'Emotional Support', '🤗', '#3b82f6', 'Accepts current capacity without judgment'),
('Builds Confidence', 'Emotional Support', '💪', '#3b82f6', 'Creates success experiences'),
('Helps Regulate Emotions', 'Emotional Support', '🌊', '#3b82f6', 'Calms nervous system and manages emotional intensity'),

-- 🚀 Implementation Support
('Starts Small', 'Implementation Support', '🌱', '#8b5cf6', 'Uses manageable first steps'),
('Builds Momentum', 'Implementation Support', '🚀', '#8b5cf6', 'Creates forward motion and energy'),
('Creates Accountability', 'Implementation Support', '👥', '#8b5cf6', 'Adds external motivation and tracking');

-- ==========================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ==========================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for strategies table
CREATE TRIGGER update_strategies_updated_at 
    BEFORE UPDATE ON strategies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================
-- COMPLETION MESSAGE
-- ==========================

DO $$ 
BEGIN 
    RAISE NOTICE 'ADHD First Aid Kit database schema has been successfully created!';
    RAISE NOTICE 'Tables created: strategies, feelings, issues, barriers, help_tasks, tags, life_roles, solution_types, styles, why_does_this_work';
    RAISE NOTICE 'Junction tables created for all relationships';
    RAISE NOTICE 'Sample data populated for lookup tables';
    RAISE NOTICE 'RLS policies enabled with public read access';
    RAISE NOTICE 'Indexes created for optimal performance';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run your import script: npm run import-data';
    RAISE NOTICE '2. Verify data import completed successfully';
    RAISE NOTICE '3. Test your application with the new schema';
END $$;