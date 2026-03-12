
export interface ScriptScenario {
  title: string
  content: string
}

export interface ScriptContent {
  intro: string
  scripts: ScriptScenario[]
  tips: string[]
}

export interface Script {
  name: string
  category: string
  emoji: string
  slug: string
  content: ScriptContent
}

export const scripts: Script[] = [
  {
    name: 'How to talk to a friend who doubts ADHD',
    category: 'Advocacy & Boundaries',
    emoji: '🗣️',
    slug: 'how-to-talk-to-a-friend-who-doubts-adhd',
    content: {
      intro: "When someone doubts your ADHD, it can feel invalidating and hurtful. Here's a gentle but firm script to help you navigate this conversation.",
      scripts: [
        {
          title: "For the Skeptical Friend",
          content: `"I understand ADHD might seem overdiagnosed or trendy to you, but my experience is real. This isn't about making excuses—it's about understanding why my brain works differently. I'd appreciate your support rather than skepticism."`
        },
        {
          title: "When They Say 'Everyone's a Little ADHD'",
          content: `"That's like saying everyone's a little diabetic because everyone gets tired sometimes. ADHD isn't just being distracted—it's a neurodevelopmental difference that affects my daily life in significant ways."`
        },
        {
          title: "Setting a Boundary",
          content: `"I'm not asking you to become an expert on ADHD, but I am asking you to trust my experience and respect that this is real for me. Can we agree on that?"`
        }
      ],
      tips: [
        "Practice these phrases beforehand so they feel natural",
        "Stay calm—your tone matters as much as your words",
        "Remember: you don't need to convince everyone, just set boundaries",
        "It's okay to end the conversation if they remain dismissive"
      ]
    }
  },
  {
    name: 'How to ask your doctor for an ADHD evaluation',
    category: 'Medical Navigation',
    emoji: '🩺',
    slug: 'how-to-ask-your-doctor-for-an-adhd-evaluation',
    content: {
      intro: "Asking for an ADHD evaluation can feel daunting. Here's how to advocate for yourself with confidence and clarity.",
      scripts: [
        {
          title: "Opening the Conversation",
          content: `"I'd like to discuss the possibility of an ADHD evaluation. I've been experiencing [specific symptoms] that are impacting my work/relationships/daily life, and I think ADHD might explain some of these challenges."`
        },
        {
          title: "When They Dismiss Your Concerns",
          content: `"I understand you might not see ADHD immediately, but these symptoms are significantly affecting my quality of life. Could we explore this possibility or perhaps refer me to a specialist who can do a comprehensive evaluation?"`
        },
        {
          title: "If They Say You're Too Old/Smart/Successful",
          content: `"ADHD can present differently in adults and can be masked by intelligence or coping strategies I've developed over time. I'd appreciate a thorough evaluation to rule it in or out definitively."`
        }
      ],
      tips: [
        "Bring a list of specific symptoms and examples",
        "Mention how symptoms impact your daily functioning",
        "Consider bringing a trusted friend or family member for support",
        "Don't be afraid to seek a second opinion if dismissed"
      ]
    }
  },
  {
    name: 'How to tell your partner what you need',
    category: 'Relationship Communication',
    emoji: '💕',
    slug: 'how-to-tell-your-partner-what-you-need',
    content: {
      intro: "Clear communication about your ADHD needs can strengthen your relationship. Here's how to have this important conversation.",
      scripts: [
        {
          title: "Explaining Your ADHD",
          content: `"I want to help you understand how my ADHD affects me so we can work together better. When I [specific behavior], it's not because I don't care—it's because my brain processes things differently."`
        },
        {
          title: "Asking for Specific Support",
          content: `"It would really help me if you could [specific request]. For example, when we make plans, could you send me a reminder text the day before? It's not that I don't value our time together—my brain just needs that extra support."`
        },
        {
          title: "When You Make a Mistake",
          content: `"I know I messed up by [specific mistake], and I'm sorry it affected you. This is one of those areas where my ADHD trips me up. Can we problem-solve together how to prevent this in the future?"`
        }
      ],
      tips: [
        "Be specific about what support looks like",
        "Explain the 'why' behind your needs",
        "Focus on solutions, not just problems",
        "Appreciate their efforts to understand and help"
      ]
    }
  },
  {
    name: 'What to say when you forgot again',
    category: 'Repair & Reassurance',
    emoji: '😔',
    slug: 'what-to-say-when-you-forgot-again',
    content: {
      intro: "ADHD memory challenges can strain relationships. Here's how to acknowledge, apologize, and move forward constructively.",
      scripts: [
        {
          title: "Taking Responsibility",
          content: `"I forgot about [specific thing], and I can see that this affected you. This isn't an excuse, but my ADHD makes it hard for me to keep track of everything. I'm sorry, and I want to figure out how to do better."`
        },
        {
          title: "When Someone's Frustrated",
          content: `"I can hear that you're frustrated, and I don't blame you. I'm frustrated with myself too. My forgetting isn't about you not being important to me—you are incredibly important. Can we brainstorm some systems to help me remember better?"`
        },
        {
          title: "Making Amends",
          content: `"I know saying sorry doesn't undo the impact of my forgetting. What can I do right now to help repair this? And what systems can we put in place so this doesn't happen again?"`
        }
      ],
      tips: [
        "Acknowledge the impact, not just the mistake",
        "Avoid over-explaining or making it about your ADHD struggles",
        "Focus on solutions and prevention",
        "Follow through on any commitments you make to do better"
      ]
    }
  },
  {
    name: 'How to ask your boss for accommodations',
    category: 'Workplace Advocacy',
    emoji: '💼',
    slug: 'how-to-ask-your-boss-for-accommodations',
    content: {
      intro: "Requesting workplace accommodations is your right. Here's how to approach this conversation professionally and effectively.",
      scripts: [
        {
          title: "Initial Request",
          content: `"I'd like to schedule a meeting to discuss some workplace accommodations that would help me perform my job more effectively. I have ADHD, which affects [specific work areas], and there are some reasonable adjustments that could really improve my productivity."`
        },
        {
          title: "Explaining the Need",
          content: `"Due to my ADHD, I sometimes struggle with [specific challenge]. A helpful accommodation would be [specific request], which would allow me to [specific benefit]. This is similar to how someone might need a standing desk for back issues."`
        },
        {
          title: "Addressing Concerns",
          content: `"I understand you might have questions about how this would work. I'm committed to my role and my team's success. These accommodations would actually help me contribute more effectively, not less."`
        }
      ],
      tips: [
        "Know your rights under the ADA (if applicable)",
        "Be specific about what accommodations you need",
        "Focus on how accommodations improve your work performance",
        "Consider bringing documentation from your healthcare provider"
      ]
    }
  },
  {
    name: "I'm trying my best (to family/friends/self)",
    category: 'Self-Compassion',
    emoji: '💙',
    slug: 'im-trying-my-best-to-family-friends-self',
    content: {
      intro: "Sometimes you need to remind others—and yourself—that you're doing your best with the brain you have.",
      scripts: [
        {
          title: "To Family/Friends",
          content: `"I know it might not always look like it, but I am trying my best. My ADHD brain works differently, and what looks effortless for you might be incredibly difficult for me. I'm not making excuses—I'm explaining my reality."`
        },
        {
          title: "When Someone Says 'Just Try Harder'",
          content: `"I understand that from the outside it might look like I'm not trying hard enough. But having ADHD means that 'just trying harder' isn't always the solution. Sometimes I need to try differently, not harder."`
        },
        {
          title: "To Yourself",
          content: `"I am doing my best with the brain I have. ADHD makes some things harder for me, and that's not a character flaw. I'm learning, growing, and finding strategies that work for me. My progress might look different from others', but it's still progress."`
        }
      ],
      tips: [
        "Remember: effort and results aren't always proportional with ADHD",
        "Your best might look different day to day—that's okay",
        "Focus on progress, not perfection",
        "Surround yourself with people who understand and support you"
      ]
    }
  },
  {
    name: 'Declining an Invite (Overwhelmed)',
    category: 'Boundaries & Energy',
    emoji: '🔋',
    slug: 'declining-an-invite-overwhelmed',
    content: {
      intro: "When you're running on empty, saying no is self-care. Here's how to decline plans without guilt.",
      scripts: [
        {
          title: "The Simple No",
          content: `"Thank you so much for the invite! I've had a really long week and need to rest and recharge tonight, so I won't be able to make it."`
        },
        {
          title: "Leaving the Door Open",
          content: `"I'd love to see you, but I'm completely tapped out energetically right now. Can we take a rain check for when I can be fully present?"`
        },
        {
          title: "Honest but Gentle",
          content: `"I really appreciate you thinking of me. My social battery is at 0% right now, so I'm going to stay in. I hope you have a great time!"`
        }
      ],
      tips: [
        "You don't need to give a detailed excuse",
        "Protecting your downtime prevents burnout",
        "True friends will understand",
        "Offer an alternative date only if you mean it"
      ]
    }
  },
  {
    name: 'Asking for Body Doubling',
    category: 'Productivity Support',
    emoji: '👯',
    slug: 'asking-for-body-doubling',
    content: {
      intro: "Body doubling (working alongside someone) is a powerful ADHD tool. Here's how to ask for it.",
      scripts: [
        {
          title: "To a Friend/Partner",
          content: `"I'm really struggling to get started on [task]. Would you mind just sitting with me while I do it? You don't have to help, just having you there keeps me accountable."`
        },
        {
          title: "Virtual Body Doubling",
          content: `"Hey, do you have any work to do? I need to focus for an hour – want to jump on a silent video call and work 'together'?"`
        },
        {
          title: "Explaining Why It Helps",
          content: `"I just need a 'body double' – basically, your presence helps anchor my attention so I don't drift off. It's like having a gym buddy but for chores/work."`
        }
      ],
      tips: [
        "Clarify that they don't need to actively help",
        "Set a specific time limit to make it easier for them to say yes",
        "Offer to return the favor",
        "You can use online communities for this too"
      ]
    }
  },
  {
    name: "Responding to 'You're Just Lazy'",
    category: 'Advocacy & Defense',
    emoji: '🛡️',
    slug: 'responding-to-youre-just-lazy',
    content: {
      intro: "The 'lazy' label is a common ADHD wound. Here's how to defend yourself and correct the narrative.",
      scripts: [
        {
          title: "Fact-Based Correction",
          content: `"Actually, laziness is a choice – it's deciding not to do something you don't care about. Executive dysfunction (which is what I have) is wanting to do the thing, but being chemically unable to initiate it. There's a big difference."`
        },
        {
          title: "Setting a Firm Boundary",
          content: `"I don't appreciate being called lazy. I work incredibly hard just to function in a world not built for my brain. Please don't use that word with me."`
        },
        {
          title: "The Internal Dialogue (Self-Defense)",
          content: `"I am not lazy. I am dealing with a invisible disability that affects my motivation and energy. I am doing the best I can."`
        }
      ],
      tips: [
        "You don't have to engage with people who are committed to misunderstanding you",
        "Protect your peace first",
        "Remind yourself of all the things you DO accomplish",
        "Laziness is rest that feels good; paralysis feels awful"
      ]
    }
  },
  {
    name: 'The "I Ghosted You" Re-entry',
    category: 'Repair & Reassurance',
    emoji: '👻',
    slug: 'the-i-ghosted-you-re-entry',
    content: {
      intro: "You didn't text back for 3 weeks, and now the shame is making it impossible to text back at all. Here's how to break the silence.",
      scripts: [
        {
          title: "The Honest Truth",
          content: `"Hey! I know it's been ages. I realized I never replied to this, and then the shame of not replying paralyzed me. I've been thinking of you and missed you!"`
        },
        {
          title: "The 'No Excuse' Approach",
          content: `"I am so sorry for the radio silence! Life got overwhelming and I accidentally went into hibernation mode. I'm resurfacing now—how are you?"`
        },
        {
          title: "The Low-Pressure Check-in",
          content: `"Thinking of you! No need to reply to this, just wanted to send some love and apologize for being MIA lately."`
        }
      ],
      tips: [
        "Don't wait for 'the perfect time' to reply—do it badly now rather than perfectly never",
        "Most friends won't be mad, they'll just be glad you're back",
        "Avoid over-explaining the specific reasons (too many details can sound like excuses)"
      ]
    }
  },
  {
    name: "Sensory Overload Exit Strategy",
    category: "Sensory Support",
    emoji: "🤯",
    slug: "sensory-overload-exit-strategy",
    content: {
      intro: "When you are about to explode from noise/lights/textures and need to leave NOW without causing a scene.",
      scripts: [
        {
          title: "To a Boss/Colleague",
          content: `"I'm developing a severe migraine/headache from the lights in here. I need to step out for 10 minutes to grab some air and reset so I can focus."`
        },
        {
          title: "To Friends/Family (Code Red)",
          content: `"I am feeling really overstimulated right now and need to reduce sensory input before I get irritable. I'm going to go sit in the quiet room/car for a bit. Please don't come check on me, I just need silence."`
        },
        {
          title: "The Graceful Exit (Party/Event)",
          content: `"I've hit a bit of a wall physically and need to head out. Thank you so much for having me!"`
        }
      ],
      tips: [
        "Use 'migraine' or 'headache' if you don't feel safe explaining sensory processing—people understand physical pain better",
        "Leaving *before* the meltdown is responsible self-care, not flaking",
        "It's okay to wear sunglasses indoors or earplugs"
      ]
    }
  },
  {
    name: "The 'I Can't Cook' Negotiation",
    category: "Boundaries & Energy",
    emoji: "🍳",
    slug: "the-i-cant-cook-negotiation",
    content: {
      intro: "When you have zero executive function for meal prep and need to communicate that to a partner or family member without shame.",
      scripts: [
        {
          title: "The Capacity Check",
          content: `"I have zero executive function left for cooking tonight. The idea of deciding/chopping is making me panic. Can we do 'fend for yourself' night, or can you take lead on food?"`
        },
        {
          title: "The Compromise",
          content: `"I can't cook a full meal, but I can help with the 'robot' tasks. If you decide what we eat and manage the stove, I can chop veggies or do the dishes after."`
        },
        {
          title: "Setting the Standard (Long term)",
          content: `"I'm realizing that me cooking on weeknights is leading to burnout/takeout. Can we simplify our meal plan? I need 'girl tax' meals (cheese, crackers, fruit) to be an acceptable dinner option."`
        }
      ],
      tips: [
        "Fed is best. Cereal for dinner is morally neutral.",
        "Separate the 'decision' of food from the 'act' of cooking—often the decision is the hardest part",
        "Keep 'emergency meals' (frozen pizza) for exactly these nights"
      ]
    }
  }
]
