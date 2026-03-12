
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
      intro: "When someone acts like your ADHD is fake or exaggerated, it can hit hard. These versions sound more human while still holding the line.",
      scripts: [
        {
          title: "For the Skeptical Friend",
          content: `"I get that ADHD might sound overused to you, but this is not some trend for me. It affects my actual life. I am not making excuses. I am trying to explain what is going on with me, and I need support more than skepticism."`
        },
        {
          title: "When They Say 'Everyone's a Little ADHD'",
          content: `"Everybody gets distracted sometimes, but that is not the same thing. ADHD affects how I function every day, not just once in a while when I am having an off day."`
        },
        {
          title: "Setting a Boundary",
          content: `"I am not asking you to be an expert on ADHD. I am asking you to trust that this is real for me and not argue with my experience. Can we do that?"`
        }
      ],
      tips: [
        "Practice these phrases beforehand so they feel natural",
        "Stay calm, your tone matters as much as the words",
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
      intro: "Asking for an evaluation can feel awkward and high stakes. These scripts keep it direct without sounding robotic.",
      scripts: [
        {
          title: "Opening the Conversation",
          content: `"I want to talk about getting evaluated for ADHD. I have been dealing with [specific symptoms], and they are affecting my work, relationships, and daily life. I think ADHD could be part of what is going on."`
        },
        {
          title: "When They Dismiss Your Concerns",
          content: `"I know ADHD might not be the first thing that comes to mind, but these symptoms are seriously affecting my life. If you do not think you can evaluate this, can you refer me to someone who can?"`
        },
        {
          title: "If They Say You're Too Old/Smart/Successful",
          content: `"I know ADHD can look different in adults, especially when someone has spent years masking or overcompensating. I would still like a proper evaluation so we can rule it in or out based on the full picture."`
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
      intro: "Telling your partner what you need is easier when it sounds like you and not a therapy worksheet. These are more grounded starting points.",
      scripts: [
        {
          title: "Explaining Your ADHD",
          content: `"I want to explain what ADHD looks like for me so we can be on the same page. When I [specific behavior], it is not because I do not care. It is usually because my brain is dropping a ball somewhere."`
        },
        {
          title: "Asking for Specific Support",
          content: `"It would help me a lot if you could [specific request]. For example, if we make plans, can you text me the day before? It is not because I do not care about our time. I just do better with an extra prompt."`
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
      intro: "Forgetting something again can bring up guilt fast. These scripts own it without spiraling.",
      scripts: [
        {
          title: "Taking Responsibility",
          content: `"I forgot about [specific thing], and I can see that this affected you. This isn't an excuse, but my ADHD makes it hard for me to keep track of everything. I'm sorry, and I want to figure out how to do better."`
        },
        {
          title: "When Someone's Frustrated",
          content: `"I can hear that you are frustrated, and I get why. I am frustrated too. Me forgetting is not about you not mattering to me, because you do. Can we figure out a better system so this does not keep happening?"`
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
      intro: "Asking for accommodations at work can feel loaded. These keep it clear, calm, and professional.",
      scripts: [
        {
          title: "Initial Request",
          content: `"I would like to set up time to talk about a few accommodations that would help me do my job more effectively. I have ADHD, and it affects [specific work areas]. I have a couple of practical adjustments in mind that would make a real difference."`
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
      intro: "Sometimes you need words for the moment when you are trying so hard and someone still does not see it, including you.",
      scripts: [
        {
          title: "To Family/Friends",
          content: `"I know it might not always look like it, but I really am trying. My brain does not handle things the same way yours might. What looks easy from the outside can take a ton out of me. I am not making excuses. I am trying to be honest about what is hard."`
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
        "Your best might look different day to day, and that is okay",
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
      intro: "When you are completely drained, a real no is kinder than a fake yes. These keep it simple and honest.",
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
      intro: "Body doubling helps a lot, but asking for it can feel weird if you have never said it out loud. These make it sound normal.",
      scripts: [
        {
          title: "To a Friend/Partner",
          content: `"I'm really struggling to get started on [task]. Would you mind just sitting with me while I do it? You don't have to help, just having you there keeps me accountable."`
        },
        {
          title: "Virtual Body Doubling",
          content: `"Hey, do you have stuff to do too? I need to focus for an hour. Want to sit on a silent video call and work at the same time?"`
        },
        {
          title: "Explaining Why It Helps",
          content: `"I just need a body double. Basically, having another person there helps me stay anchored so I do not drift off. It is kind of like having a gym buddy, but for chores or work."`
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
      intro: "Being called lazy hits a nerve for a reason. These responses push back without sounding rehearsed.",
      scripts: [
        {
          title: "Fact-Based Correction",
          content: `"This is not me choosing not to care. The problem is that I want to do it and still cannot get myself to start. That is very different from being lazy."`
        },
        {
          title: "Setting a Firm Boundary",
          content: `"I don't appreciate being called lazy. I work incredibly hard just to function in a world not built for my brain. Please don't use that word with me."`
        },
        {
          title: "The Internal Dialogue (Self-Defense)",
          content: `"I am not lazy. I am dealing with an invisible disability that affects motivation, energy, and follow-through. I am doing the best I can."`
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
      intro: "When you disappear and then feel too weird to come back, you need something that sounds real, not overexplained.",
      scripts: [
        {
          title: "The Honest Truth",
          content: `"Hey! I know it's been ages. I realized I never replied to this, and then the shame of not replying paralyzed me. I've been thinking of you and missed you!"`
        },
        {
          title: "The 'No Excuse' Approach",
          content: `"I am so sorry I disappeared. Life got really overwhelming and then I got weird about replying because it had been so long. I am popping back up now. How are you?"`
        },
        {
          title: "The Low-Pressure Check-in",
          content: `"Thinking of you! No need to reply to this, just wanted to send some love and apologize for being MIA lately."`
        }
      ],
      tips: [
        "Do not wait for the perfect reply, send the imperfect one now",
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
      intro: "When you are about to hit sensory overload and need out fast, these help you leave without a whole explanation.",
      scripts: [
        {
          title: "To a Boss/Colleague",
          content: `"I'm developing a severe migraine/headache from the lights in here. I need to step out for 10 minutes to grab some air and reset so I can focus."`
        },
        {
          title: "To Friends/Family (Code Red)",
          content: `"I am getting really overstimulated and need quiet before I tip over the edge. I am going to sit in the quiet room or in the car for a bit. Please do not come check on me. I just need silence for a minute."`
        },
        {
          title: "The Graceful Exit (Party/Event)",
          content: `"I've hit a bit of a wall physically and need to head out. Thank you so much for having me!"`
        }
      ],
      tips: [
        "Use 'migraine' or 'headache' if you do not feel safe explaining sensory overload, people usually get physical pain faster",
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
      intro: "When the idea of figuring out food makes you want to cry, you need words that sound normal and not dramatic.",
      scripts: [
        {
          title: "The Capacity Check",
          content: `"I have nothing left for cooking tonight. Even deciding what to make feels like too much. Can we do fend-for-yourself night, or can you take the lead on food?"`
        },
        {
          title: "The Compromise",
          content: `"I can't cook a full meal, but I can help with the 'robot' tasks. If you decide what we eat and manage the stove, I can chop veggies or do the dishes after."`
        },
        {
          title: "Setting the Standard (Long term)",
          content: `"I am realizing that trying to cook on weeknights is burning me out and setting us up for takeout. Can we make the meal plan simpler? I need low-effort meals like cheese, crackers, and fruit to count as a valid dinner sometimes."`
        }
      ],
      tips: [
        "Fed is best. Cereal for dinner is morally neutral.",
        "Separate the decision about food from the act of cooking, because choosing is often the hardest part",
        "Keep 'emergency meals' (frozen pizza) for exactly these nights"
      ]
    }
  }
]
