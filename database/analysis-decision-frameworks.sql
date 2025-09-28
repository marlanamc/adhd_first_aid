-- Analysis & Decision Framework Implementation
-- Populate "The Thinking Spiral" framework sections for all 3 analysis/decision loops

-- 1. Analysis Paralysis
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "You need to **make a decision** (buy something, choose a path, start a project)"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your brain **craves certainty** but **struggles with executive function**",
    "mechanisms": [
      "🧩 **Executive dysfunction** makes weighing options feel overwhelming",
      "🧠 **Working memory** gets overloaded juggling all the possibilities",
      "💥 **Perfectionism + RSD** make the \"wrong\" choice feel catastrophic",
      "💥 **Low dopamine** creates shutdown when there''s no clear \"best\" answer"
    ]
  },
  "mental_traffic_jam": {
    "title": "The Mental Traffic Jam", 
    "steps": [
      "You start **researching** to find the \"**perfect**\" choice",
      "Each new piece of information **spawns 3 more questions**",
      "**Options multiply** instead of narrowing down",
      "Your brain gets **stuck in analysis mode**, unable to **switch to action**"
    ]
  },
  "paralysis": {
    "title": "The Paralysis",
    "content": "**Research becomes avoidance** — a way to escape the **anxiety of deciding**, but it **never actually reduces** that anxiety"
  }
}'
WHERE loop_name = 'Analysis Paralysis';

-- 2. Decision Overwhelm
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "**Too many options** (restaurant menu, career paths, what to watch)"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "**Choice overload** crashes your **executive system**",
    "mechanisms": [
      "🧩 **Executive dysfunction** can''t prioritize or filter options effectively",
      "🧠 **Working memory limits** get maxed out by trying to hold multiple possibilities",
      "🎯 **All-or-nothing thinking** makes every choice feel permanent and critical",
      "⏰ **Time blindness** makes quick decisions feel rushed and scary"
    ]
  },
  "mental_traffic_jam": {
    "title": "The Mental Traffic Jam", 
    "steps": [
      "Your brain tries to **process every option simultaneously**",
      "Analysis branches into **infinite \"what if\" scenarios**",
      "**Fear of missing out** keeps you from **eliminating choices**",
      "**Mental energy gets depleted** by decision-making **before you even choose**"
    ]
  },
  "paralysis": {
    "title": "The Paralysis",
    "content": "You **avoid choosing** until **external pressure** forces a **hasty decision** you **second-guess immediately**"
  }
}'
WHERE loop_name = 'Decision Overwhelm';

-- 3. Perfectionism Cycles
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Starting any task where the **outcome matters** to you"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your brain equates **imperfection with failure**",
    "mechanisms": [
      "🎯 **All-or-nothing thinking** tells you if it''s not perfect, it''s worthless",
      "💥 **RSD and fear of judgment** make criticism feel like rejection of your entire self",
      "🧩 **Executive dysfunction** makes it hard to know when something is \"done\"",
      "🧠 **Working memory gaps** lose track of what actually matters vs. perfectionist details"
    ]
  },
  "mental_traffic_jam": {
    "title": "The Mental Traffic Jam", 
    "steps": [
      "You start a task with **impossibly high standards**",
      "Each **imperfection** feels like evidence you're \"**not good enough**\"",
      "You **restart, revise, or abandon** work that's actually fine",
      "**Fear of judgment** prevents you from **sharing or finishing** anything"
    ]
  },
  "paralysis": {
    "title": "The Paralysis",
    "content": "**Perfectionism becomes procrastination** — **avoiding the task** feels safer than risking **imperfect results**"
  }
}'
WHERE loop_name = 'Perfectionism Cycles';

-- Verify all Analysis & Decision frameworks are populated
SELECT loop_name, framework_title,
       CASE WHEN framework_sections IS NOT NULL THEN '✅ Framework Complete' ELSE '❌ Missing Framework' END as status
FROM complex_loops_content 
WHERE loop_type = 'analysis_decision'
ORDER BY loop_name;