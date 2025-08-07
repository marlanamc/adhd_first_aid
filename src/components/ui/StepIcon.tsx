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
  '🌊': 'Waves',
  
  // Tools & Action
  '🛠️': 'Wrench',
  '⚙️': 'Settings',
  '🔧': 'Wrench',
  '🧰': 'Briefcase',
  '🔑': 'Key',
  '🍳': 'ChefHat',  // Cooking/food prep
  '🧱': 'Construction',  // Building blocks
  
  // People & Support
  '🧍‍♀️': 'User',
  '🧍‍♂️': 'User', 
  '🧍': 'User',
  '🚶': 'User',  // Walking person
  '🚶‍♀️': 'User',  // Walking woman
  '🚶‍♂️': 'User',  // Walking man
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
  
  // Complete emoji mappings from database (deduplicated)
  '⏱️': 'Timer',
  '⏳': 'Timer',
  '⚙️': 'Settings',
  '⚡': 'Zap',
  '🌡️': 'Thermometer',
  '🌬️': 'Wind',
  '🌸': 'Flower',
  '🍳': 'ChefHat',
  '🎮': 'Gamepad2',
  '🎯': 'Target',
  '💛': 'Heart',
  '💜': 'Heart',
  '💪': 'Zap',
  '📅': 'Calendar',
  '📊': 'BarChart3',
  '📏': 'Ruler',
  '📝': 'FileText',
  '📵': 'PhoneOff',
  '🔁': 'Repeat',
  '🔋': 'Battery',
  '🔍': 'Search',
  '🔖': 'Bookmark',
  '🔥': 'Flame',
  '🗒️': 'FileText',
  '🗓️': 'Calendar',
  '🚀': 'Rocket',
  '🚪': 'DoorOpen',
  '🚶': 'User',
  '🛑': 'OctagonX',
  '🛟': 'LifeBuoy',
  '🛠️': 'Wrench',
  '🛡️': 'Shield',
  '🤗': 'Heart',
  '🤝': 'Handshake',
  '🤲': 'Heart',
  '🧍': 'User',
  '🧍‍♀️': 'User',
  '🧑‍⚕️': 'UserCheck',
  '🧑‍🤝‍🧑': 'Users',
  '🧠': 'Brain',
  '🧩': 'Puzzle',
  '🧭': 'Compass',
  '🧱': 'Construction',
  '🧹': 'Brush',
  '🪜': 'TrendingUp',
  '🫶': 'Heart',

  // Text-based mappings (when icon names are stored as text)
  'Yoga': 'Activity',
  'Target': 'Target',
  'Brain': 'Brain',
  'Think': 'Search',
  'Thinking': 'Search',
  'Mind': 'Lightbulb',
  'Mental': 'Lightbulb',
  'Cognitive': 'Search',
  
  // Additional Lucide icon name mappings for content
  'AlertCircle': 'AlertCircle',
  'BarChart3': 'BarChart3',
  'Battery': 'Battery',
  'BatteryCharging': 'BatteryCharging',
  'Bell': 'Bell',
  'Blocks': 'Blocks',
  'Calendar': 'Calendar',
  'CheckCircle': 'CheckCircle',
  'Clock': 'Clock',
  'Cog': 'Cog',
  'Compass': 'Compass',
  'Dumbbell': 'Dumbbell',
  'Eye': 'Eye',
  'FileOutput': 'FileOutput',
  'FileText': 'FileText',
  'GraduationCap': 'GraduationCap',
  'Handshake': 'Handshake',
  'Heart': 'Heart',
  'HeartHandshake': 'HeartHandshake',
  'Home': 'Home',
  'LineChart': 'LineChart',
  'Link': 'Link',
  'MessageCircle': 'MessageCircle',
  'MessageSquare': 'MessageSquare',
  'Moon': 'Moon',
  'Mountain': 'Mountain',
  'PersonStanding': 'PersonStanding',
  'Power': 'Power',
  'RefreshCw': 'RefreshCw',
  'Scale': 'Scale',
  'Search': 'Search',
  'Shield': 'Shield',
  'Sliders': 'Sliders',
  'Sprout': 'Sprout',
  'Star': 'Star',
  'TrendingDown': 'TrendingDown',
  'Users': 'Users',
  'Waves': 'Waves',
  'Wind': 'Wind',
  'Wrench': 'Wrench',
  'Zap': 'Zap',
  
  // New icon mappings from category pages
  'Baby': 'Baby',
  'UserCog': 'UserCog',
  'UserPlus': 'UserPlus',
  'Building': 'Building',
  'Flame': 'Flame',
  'Briefcase': 'Briefcase',
  'Lightbulb': 'Lightbulb',
  'Award': 'Award',
  'BrainCircuit': 'BrainCircuit',
  'ClipboardPlus': 'ClipboardPlus',
  'Fingerprint': 'Fingerprint',
  'HeartPulse': 'HeartPulse',
  'UserX': 'UserX',
  'Rainbow': 'Rainbow',
  'Globe': 'Globe',
  'UserMinus': 'UserMinus',
  'BanknoteX': 'BanknoteX',
  'Sparkles': 'Sparkles',
  'Plus': 'Plus',
  'Hash': 'Hash',
  'BookOpen': 'BookOpen',
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
    console.warn(`⚠️ Missing icon mapping for: "${iconName}"`);
    IconComponent = Icons.HelpCircle;
  }
  
  return (
    <IconComponent className={className} />
  );
} 