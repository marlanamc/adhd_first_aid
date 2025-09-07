-- Social & Relationship Framework Implementation
-- Populate "The Social Spiral" framework sections for all 6 social/relationship loops

-- 1. Rejection Sensitivity Loops
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Real or perceived rejection (delayed text response, someone''s tone, being left out)"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your nervous system treats social pain like physical threat",
    "mechanisms": [
      "💥 **Rejection Sensitive Dysphoria** makes emotional pain feel life-threatening",
      "💥 **Emotional dysregulation** floods your logical brain with panic",
      "🔁 **Negative rumination** replays the \"evidence\" endlessly",
      "🧠 **Working memory** gets hijacked by the spiral, crowding out other thoughts"
    ]
  },
  "protective_response": {
    "title": "The Protective Response",
    "steps": [
      "Your brain scans every interaction for signs of rejection",
      "You withdraw to avoid more potential hurt",
      "Isolation confirms your brain''s story that you''re \"too much\"",
      "Future social situations feel even more threatening"
    ]
  },
  "reinforcement": {
    "title": "The Reinforcement",
    "content": "Avoidance feels protective but teaches your brain that social connection equals danger"
  }
}'
WHERE loop_name = 'Rejection Sensitivity Loops';

-- 2. Difficult Conversations
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Need to have a challenging conversation (conflict, boundaries, asking for help)"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your brain anticipates rejection and prepares for battle",
    "mechanisms": [
      "💥 **RSD** makes potential criticism feel like personal attack",
      "💥 **Emotional dysregulation** makes it hard to stay calm and clear",
      "🧩 **Executive dysfunction** scrambles your ability to organize thoughts",
      "💭 **Verbal processing** means you don''t know what you think until you''re talking"
    ]
  },
  "protective_response": {
    "title": "The Protective Response",
    "steps": [
      "You rehearse the conversation obsessively, imagining worst-case scenarios",
      "Emotional flooding makes you say too much, too fast, or shut down entirely",
      "You read rejection into neutral responses and react defensively",
      "Perfectionism makes you feel like you \"failed\" if it wasn''t smooth"
    ]
  },
  "reinforcement": {
    "title": "The Reinforcement",
    "content": "Each difficult conversation confirms that conflict is dangerous and should be avoided"
  }
}'
WHERE loop_name = 'Difficult Conversations';

-- 3. People-Pleasing Burnout
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Someone needs something or seems upset/disappointed"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your brain prioritizes others'' needs over your own capacity",
    "mechanisms": [
      "💥 **RSD** makes disappointing others feel unbearable",
      "⚡ **Impulsivity** leads to saying yes before checking your bandwidth",
      "🧩 **Executive dysfunction** makes it hard to see how full your plate already is",
      "🔁 **Low self-worth** drives the belief that you must earn love through service"
    ]
  },
  "protective_response": {
    "title": "The Protective Response",
    "steps": [
      "You say yes to everything to avoid potential conflict or disappointment",
      "Overcommitment leads to exhaustion and resentment",
      "You feel guilty about feeling resentful, creating more shame",
      "Burnout makes you less able to help anyone, including yourself"
    ]
  },
  "reinforcement": {
    "title": "The Reinforcement",
    "content": "Each time you disappoint someone (due to overcommitment), it \"proves\" you need to try harder to please them"
  }
}'
WHERE loop_name = 'People-Pleasing Burnout';

-- 4. Last-Minute Cancelling
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "You have social plans but suddenly feel overwhelmed by the idea"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Your brain miscalculated the energy cost of social interaction",
    "mechanisms": [
      "🧩 **Executive dysfunction** made you say yes without checking your real capacity",
      "🎭 **Masking exhaustion** from the week catches up all at once",
      "🧠 **Working memory** forgot about other drains on your energy",
      "🔊 **Sensory overwhelm** makes the thought of socializing feel impossible"
    ]
  },
  "protective_response": {
    "title": "The Protective Response",
    "steps": [
      "You realize you''re completely drained right when you need to leave",
      "The guilt of cancelling wars with the impossibility of going",
      "You cancel last-minute and feel terrible about letting people down",
      "Shame makes future invitations feel even more pressure-filled"
    ]
  },
  "reinforcement": {
    "title": "The Reinforcement",
    "content": "People stop inviting you, which confirms your fear that you''re unreliable and disappointing"
  }
}'
WHERE loop_name = 'Last-Minute Cancelling';

-- 5. Friendships & ADHD
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Maintaining friendships requires consistent effort and emotional regulation"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Friendship maintenance tasks overwhelm your executive system",
    "mechanisms": [
      "🧩 **Executive dysfunction** affects memory, follow-through, and social planning",
      "⏰ **Time blindness** makes you lose track of how long it''s been since you connected",
      "💥 **Emotional dysregulation** makes small conflicts feel relationship-ending",
      "🎭 **Masking** makes authentic connection exhausting"
    ]
  },
  "protective_response": {
    "title": "The Protective Response",
    "steps": [
      "You forget to reply to texts and feel too guilty to respond later",
      "Social overwhelm makes you withdraw when you most need connection",
      "You hyperfocus on one relationship, then ghost when it feels too intense",
      "Fear of being \"too much\" makes you hold back your authentic self"
    ]
  },
  "reinforcement": {
    "title": "The Reinforcement",
    "content": "Distance creates more distance, and friendships fade despite your genuine care"
  }
}'
WHERE loop_name = 'Friendships & ADHD';

-- 6. Intimacy & Connection
UPDATE complex_loops_content
SET framework_sections = '{
  "trigger": {
    "title": "The Trigger",
    "content": "Intimate relationships require vulnerability, consistency, and emotional regulation"
  },
  "adhd_amplification": {
    "title": "The ADHD Amplification",
    "content": "Close relationships amplify ADHD challenges with emotional regulation and follow-through",
    "mechanisms": [
      "🔁 **Working memory** issues make follow-through and consistency hard",
      "💥 **Emotional dysregulation** causes quick shifts in mood and reactions",
      "🎭 **Masking** and people-pleasing create internal tension",
      "⏰ **Time blindness** makes it easy to miss special dates or forget to check in"
    ]
  },
  "protective_response": {
    "title": "The Protective Response",
    "steps": [
      "You crave connection but feel overwhelmed when someone gets close",
      "You panic after small disagreements, fearing the relationship is over",
      "You get caught up in tasks and forget to emotionally check in",
      "You say yes when you mean no, then feel resentful or overstimulated"
    ]
  },
  "reinforcement": {
    "title": "The Reinforcement",
    "content": "Relationship struggles confirm your fear that you''re \"too much\" or \"not enough\" for lasting love"
  }
}'
WHERE loop_name = 'Intimacy & Connection';

-- Verify all Social & Relationship frameworks are populated
SELECT loop_name, framework_title,
       CASE WHEN framework_sections IS NOT NULL THEN '✅ Framework Complete' ELSE '❌ Missing Framework' END as status
FROM complex_loops_content 
WHERE loop_type = 'social_relationship'
ORDER BY loop_name;