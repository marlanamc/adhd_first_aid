import React from 'react';
import { iconRegistry, HelpCircle } from '@/lib/iconRegistry';

interface StepIconProps {
  iconName: string;
  className?: string;
}

// Mapping of emoji characters to Lucide icon names (split into sections to avoid duplicate-key literal errors)
const mapNavDirection: Record<string, keyof typeof iconRegistry> = {
  '🧭': 'Compass', '🗺️': 'Map', '🎯': 'Target', '🔍': 'Search', '📍': 'MapPin', '🔄': 'RotateCcw', '🔁': 'Repeat', '↻': 'RotateCcw',
};
const mapGrowthNature: Record<string, keyof typeof iconRegistry> = {
  '🌱': 'Sprout', '🌟': 'Star', '🌈': 'Rainbow', '🔥': 'Flame', '✨': 'Sparkles', '🌊': 'Waves',
};
const mapToolsAction: Record<string, keyof typeof iconRegistry> = {
  '🛠️': 'Wrench', '⚙️': 'Settings', '🔧': 'Wrench', '🧰': 'Briefcase', '🔑': 'Key', '🍳': 'ChefHat', '🧱': 'Construction',
};
const mapPeopleSupport: Record<string, keyof typeof iconRegistry> = {
  '🧍‍♀️': 'User', '🧍‍♂️': 'User', '🧍': 'User', '🚶': 'User', '🚶‍♀️': 'User', '🚶‍♂️': 'User', '👥': 'Users', '🤝': 'Handshake', '💬': 'MessageCircle',
};
const mapBrainMental: Record<string, keyof typeof iconRegistry> = {
  '🧠': 'Lightbulb', '💡': 'Lightbulb', '🎭': 'Smile', '😌': 'Smile', '🧘‍♀️': 'Activity', '🧘‍♂️': 'Activity', '🧘': 'Activity', '🧘🏻': 'Activity', '🧘🏼': 'Activity', '🧘🏽': 'Activity', '🧘🏾': 'Activity', '🧘🏿': 'Activity', '💭': 'MessageCircle', '🤔': 'Search', '💫': 'Sparkles', '🔮': 'Sparkles', '🪄': 'Sparkles', '🌀': 'RotateCcw', '💝': 'Heart', '🎈': 'Heart',
};
const mapEnergyMotion: Record<string, keyof typeof iconRegistry> = {
  '⚡': 'Zap', '🔄': 'RotateCcw', '🔁': 'Repeat', '⏰': 'Clock', '⏳': 'Timer', '⏱️': 'Timer',
};
const mapOrgStructure: Record<string, keyof typeof iconRegistry> = {
  '📝': 'FileText', '📋': 'ClipboardList', '📚': 'BookOpen', '📖': 'Book', '🗃️': 'Archive', '🗂️': 'Folder', '🗓️': 'Calendar', '📅': 'Calendar', '📆': 'Calendar',
};
const mapEmotionsStates: Record<string, keyof typeof iconRegistry> = {
  '❤️': 'Heart', '💔': 'HeartCrack', '💛': 'Heart', '💚': 'Heart', '💙': 'Heart', '💜': 'Heart', '🤍': 'Heart', '🖤': 'Heart', '😔': 'Frown', '😊': 'Smile', '😌': 'Smile', '🥺': 'Heart',
};
const mapBarriersChallenges: Record<string, keyof typeof iconRegistry> = {
  '🚧': 'Construction', '⛔': 'Ban', '🛑': 'OctagonX', '❌': 'X', '⚠️': 'AlertTriangle',
};
const mapSuccessAchievement: Record<string, keyof typeof iconRegistry> = {
  '✅': 'CheckCircle', '🎉': 'Sparkles', '🏆': 'Trophy', '👍': 'ThumbsUp', '💪': 'Zap',
};
const mapCommunication: Record<string, keyof typeof iconRegistry> = {
  '📢': 'Megaphone', '📣': 'Megaphone', '💭': 'MessageCircle', '🗣️': 'MessageSquare',
};
const mapMemoryLearning: Record<string, keyof typeof iconRegistry> = {
  '📚': 'BookOpen', '📝': 'FileText', '🔗': 'Link', '🧩': 'Puzzle', '📋': 'ClipboardList', '📌': 'Pin', '🔖': 'Bookmark',
};
const mapReflectionUnderstanding: Record<string, keyof typeof iconRegistry> = {
  '🪞': 'Eye', '👁️': 'Eye', '🔍': 'Search', '🧐': 'Search', '🔄': 'RotateCcw', '🔃': 'RotateCcw', '🔂': 'Repeat', '🎪': 'Sparkles', '🌊': 'Waves', '💎': 'Gem', '🗝️': 'Key', '🧘': 'Heart',
};
const mapDefaults: Record<string, keyof typeof iconRegistry> = {
  '🔮': 'Sparkles', '🎪': 'Sparkles', '🎨': 'Palette', '🎵': 'Music', '🎬': 'Video', '📸': 'Camera',
};
const mapFromDb: Record<string, keyof typeof iconRegistry> = {
  '⏱️': 'Timer', '⏳': 'Timer', '⚙️': 'Settings', '⚡': 'Zap', '🌡️': 'Thermometer', '🌬️': 'Wind', '🌸': 'Flower', '🍳': 'ChefHat', '🎮': 'Gamepad2', '🎯': 'Target', '💛': 'Heart', '💜': 'Heart', '💪': 'Zap', '📅': 'Calendar', '📊': 'BarChart3', '📏': 'Ruler', '📝': 'FileText', '📵': 'PhoneOff', '🔁': 'Repeat', '🔋': 'Battery', '🔍': 'Search', '🔖': 'Bookmark', '🔥': 'Flame', '🗒️': 'FileText', '🗓️': 'Calendar', '🚀': 'Rocket', '🚪': 'DoorOpen', '🚶': 'User', '🛑': 'OctagonX', '🛟': 'LifeBuoy', '🛠️': 'Wrench', '🛡️': 'Shield', '🤗': 'Heart', '🤝': 'Handshake', '🤲': 'Heart', '🧍': 'User', '🧍‍♀️': 'User', '🧑‍⚕️': 'UserCheck', '🧑‍🤝‍🧑': 'Users', '🧠': 'Brain', '🧩': 'Puzzle', '🧭': 'Compass', '🧱': 'Construction', '🧹': 'Brush', '🪜': 'TrendingUp', '🫶': 'Heart',
};
const mapTextBased: Record<string, keyof typeof iconRegistry> = {
  'Yoga': 'Activity', 'Target': 'Target', 'Brain': 'Brain', 'Think': 'Search', 'Thinking': 'Search', 'Mind': 'Lightbulb', 'Mental': 'Lightbulb', 'Cognitive': 'Search',
};
const mapAdditionalLucide: Record<string, keyof typeof iconRegistry> = {
  'AlertCircle': 'AlertCircle', 'BarChart3': 'BarChart3', 'Battery': 'Battery', 'BatteryCharging': 'BatteryCharging', 'Bell': 'Bell', 'Blocks': 'Blocks', 'Calendar': 'Calendar', 'CheckCircle': 'CheckCircle', 'Clock': 'Clock', 'Cog': 'Cog', 'Compass': 'Compass', 'Dumbbell': 'Dumbbell', 'Eye': 'Eye', 'FileOutput': 'FileOutput', 'FileText': 'FileText', 'GraduationCap': 'GraduationCap', 'Handshake': 'Handshake', 'Heart': 'Heart', 'HeartHandshake': 'HeartHandshake', 'Home': 'Home', 'LineChart': 'LineChart', 'Link': 'Link', 'MessageCircle': 'MessageCircle', 'MessageSquare': 'MessageSquare', 'Moon': 'Moon', 'Mountain': 'Mountain', 'PersonStanding': 'PersonStanding', 'Power': 'Power', 'RefreshCw': 'RefreshCw', 'Scale': 'Scale', 'Search': 'Search', 'Shield': 'Shield', 'Sliders': 'Sliders', 'Sprout': 'Sprout', 'Star': 'Star', 'TrendingDown': 'TrendingDown', 'Users': 'Users', 'Waves': 'Waves', 'Wind': 'Wind', 'Wrench': 'Wrench', 'Zap': 'Zap',
};
const mapNewIcons: Record<string, keyof typeof iconRegistry> = {
  'Baby': 'Baby', 'UserCog': 'UserCog', 'UserPlus': 'UserPlus', 'Building': 'Building', 'Flame': 'Flame', 'Briefcase': 'Briefcase', 'Lightbulb': 'Lightbulb', 'Award': 'Award', 'BrainCircuit': 'BrainCircuit', 'ClipboardPlus': 'ClipboardPlus', 'Fingerprint': 'Fingerprint', 'HeartPulse': 'HeartPulse', 'UserX': 'UserX', 'Rainbow': 'Rainbow', 'Globe': 'Globe', 'UserMinus': 'UserMinus', 'BanknoteX': 'BanknoteX', 'Sparkles': 'Sparkles', 'Plus': 'Plus', 'Hash': 'Hash', 'BookOpen': 'BookOpen',
};

const emojiToIconMap: Record<string, keyof typeof iconRegistry> = {
  ...mapNavDirection,
  ...mapGrowthNature,
  ...mapToolsAction,
  ...mapPeopleSupport,
  ...mapBrainMental,
  ...mapEnergyMotion,
  ...mapOrgStructure,
  ...mapEmotionsStates,
  ...mapBarriersChallenges,
  ...mapSuccessAchievement,
  ...mapCommunication,
  ...mapMemoryLearning,
  ...mapReflectionUnderstanding,
  ...mapDefaults,
  ...mapFromDb,
  ...mapTextBased,
  ...mapAdditionalLucide,
  ...mapNewIcons,
};

export function StepIcon({ iconName, className = "" }: StepIconProps) {
  // First try to map emoji or text to icon name
  const mappedIconName = emojiToIconMap[iconName];
  
  // Then try to get the icon component from registry
  let IconComponent;
  if (mappedIconName) {
    IconComponent = iconRegistry[mappedIconName];
  } else {
    // Try direct name lookup (for cases where iconName is already a Lucide icon name)
    IconComponent = iconRegistry[iconName];
  }
  
  // Fall back to HelpCircle if no icon found
  if (!IconComponent) {
    console.warn(`⚠️ Missing icon mapping for: "${iconName}"`);
    IconComponent = HelpCircle;
  }
  
  return (
    <IconComponent className={className} />
  );
} 