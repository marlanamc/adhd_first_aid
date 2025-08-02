import React from 'react';
import * as Icons from 'lucide-react';

interface StepIconProps {
  iconName: string;
  className?: string;
}

// Mapping of emoji characters to Lucide icon names
const emojiToIconMap: Record<string, keyof typeof Icons> = {
  // Navigation & Direction
  '🧭': 'Compass',
  '🗺️': 'Map',
  '🎯': 'Target',
  '🔍': 'Search',
  '📍': 'MapPin',
  '🔄': 'RotateCcw',
  '🔁': 'Repeat',
  '↻': 'RotateCcw',
  
  // Growth & Nature
  '🌱': 'Sprout',
  '🌟': 'Star',
  '🌈': 'Rainbow',
  '🔥': 'Flame',
  '✨': 'Sparkles',
  
  // Tools & Action
  '🛠️': 'Wrench',
  '⚙️': 'Settings',
  '🔧': 'Wrench',
  '🧰': 'Briefcase',
  '🔑': 'Key',
  
  // People & Support
  '🧍‍♀️': 'User',
  '🧍‍♂️': 'User', 
  '🧍': 'User',
  '👥': 'Users',
  '🤝': 'Handshake',
  '💬': 'MessageCircle',
  
  // Brain & Mental
  '🧠': 'Lightbulb',
  '💡': 'Lightbulb',
  '🎭': 'Smile',
  '😌': 'Smile',
  '🧘‍♀️': 'Activity',
  '🧘‍♂️': 'Activity',
  '🧘': 'Activity',
  '🧘🏻': 'Activity',
  '🧘🏼': 'Activity',
  '🧘🏽': 'Activity',
  '🧘🏾': 'Activity',
  '🧘🏿': 'Activity',
  '💭': 'MessageCircle',
  '🤔': 'Search',
  '💫': 'Sparkles',
  '🔮': 'Sparkles',
  '🪄': 'Sparkles',
  '🌀': 'RotateCcw',
  '💝': 'Heart',
  '🎈': 'Heart',
  
  // Energy & Motion
  '⚡': 'Zap',
  '🔄': 'RotateCcw',
  '🔁': 'Repeat',
  '⏰': 'Clock',
  '⏳': 'Timer',
  '⏱️': 'Timer',
  
  // Organization & Structure
  '📝': 'FileText',
  '📋': 'ClipboardList',
  '📚': 'BookOpen',
  '📖': 'Book',
  '🗃️': 'Archive',
  '🗂️': 'Folder',
  '🗓️': 'Calendar',
  '📅': 'Calendar',
  '📆': 'Calendar',
  
  // Emotions & States
  '❤️': 'Heart',
  '💔': 'HeartCrack',
  '💛': 'Heart',
  '💚': 'Heart',
  '💙': 'Heart',
  '💜': 'Heart',
  '🤍': 'Heart',
  '🖤': 'Heart',
  '😔': 'Frown',
  '😊': 'Smile',
  '😌': 'Smile',
  '🥺': 'Heart',
  
  // Barriers & Challenges
  '🚧': 'Construction',
  '⛔': 'Ban',
  '🛑': 'OctagonX',
  '❌': 'X',
  '⚠️': 'AlertTriangle',
  
  // Success & Achievement
  '✅': 'CheckCircle',
  '🎉': 'Sparkles',
  '🏆': 'Trophy',
  '👍': 'ThumbsUp',
  '💪': 'Zap',
  
  // Communication
  '📢': 'Megaphone',
  '📣': 'Megaphone',
  '💭': 'MessageCircle',
  '🗣️': 'MessageSquare',
  
  // Memory & Learning
  '📚': 'BookOpen',
  '📝': 'FileText',
  '🔗': 'Link',
  '🧩': 'Puzzle',
  '📋': 'ClipboardList',
  '📌': 'Pin',
  '🔖': 'Bookmark',
  
  // Reflection & Understanding  
  '🪞': 'Eye',
  '👁️': 'Eye',
  '🔍': 'Search',
  '🧐': 'Search',
  '🔄': 'RotateCcw',
  '🔃': 'RotateCcw',
  '🔂': 'Repeat',
  '🎪': 'Sparkles',
  '🌊': 'Waves',
  '💎': 'Gem',
  '🗝️': 'Key',
  '🧘': 'Heart',
  
  // Default fallbacks for common patterns
  '🔮': 'Sparkles',
  '🎪': 'Sparkles',
  '🎨': 'Palette',
  '🎵': 'Music',
  '🎬': 'Video',
  '📸': 'Camera',
  
  // Text-based mappings (when emoji names are stored as text)
  'Yoga': 'Activity',
  'Target': 'Target',
  'Brain': 'Lightbulb',
  'Think': 'Search',
  'Thinking': 'Search',
  'Mind': 'Lightbulb',
  'Mental': 'Lightbulb',
  'Cognitive': 'Search',
};

export function StepIcon({ iconName, className = "" }: StepIconProps) {
  // First try to map emoji or text to icon name
  const mappedIconName = emojiToIconMap[iconName];
  
  // Then try to get the icon component
  let IconComponent;
  if (mappedIconName) {
    IconComponent = (Icons as any)[mappedIconName];
  } else {
    // Try direct name lookup (for cases where iconName is already a Lucide icon name)
    IconComponent = (Icons as any)[iconName];
  }
  
  // Fall back to HelpCircle if no icon found
  if (!IconComponent) {
    IconComponent = Icons.HelpCircle;
  }
  
  return (
    <IconComponent className={className} />
  );
} 