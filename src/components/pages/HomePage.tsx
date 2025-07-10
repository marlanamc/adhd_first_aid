import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Feeling } from '@/lib/supabase'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Task {
  id: string
  name: string
  emoji: string | null
  color: string | null
  category: string | null
  description: string | null
}

interface HomePageProps {
  viewMode: 'feeling' | 'task'
  setViewMode: (mode: 'feeling' | 'task') => void
  feelings: Feeling[]
  tasks: Task[]
  handleFeelingSelect: (feeling: string) => void
  handleTaskSelect: (task: string) => void
  isTransitioning: boolean
}

export default function HomePage({
  viewMode,
  setViewMode,
  feelings,
  tasks,
  handleFeelingSelect,
  handleTaskSelect,
  isTransitioning
}: HomePageProps) {
  // Group feelings by category
  const groupedFeelings = feelings.reduce((acc, feeling) => {
    const category = feeling.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feeling);
    return acc;
  }, {} as Record<string, Feeling[]>);

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    const category = task.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Create a sorted list of categories based on a predefined order
  const getSortedTaskCategories = () => {
    const categoryOrder = [
      'Getting Started',
      'Following Through', 
      'Planning + Organization',
      'Cleaning + Resetting',
      'Focus + Motivation',
      'Emotional Support + Self-Regulation',
      'Life Maintenance',
      'Energy Management',
      'Mental Clarity',
      'Other'
    ];
    
    const categories = Object.keys(groupedTasks);
    
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      
      // If both categories are in the predefined order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the predefined order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the predefined order, sort alphabetically
      return a.localeCompare(b);
    });
  };

  // Get the color and emoji for a task category from the first task in that category
  const getTaskCategoryStyle = (category: string) => {
    const firstTask = groupedTasks[category]?.[0];
    const fallbackStyle = getStyleForCategory(category);
    
    return {
      backgroundColor: firstTask?.color || fallbackStyle.backgroundColor,
      titleColor: fallbackStyle.titleColor,
      titleEmoji: fallbackStyle.titleEmoji
    };
  };

  // Category styling configurations
  interface CategoryStyle {
    backgroundColor: string;
    titleColor: string;
    titleEmoji: string;
    gridSpan: string;
    cardWidth?: string;
  }

  const categoryStyles: Record<string, CategoryStyle> = {
    'Emotional Turmoil': {
      backgroundColor: '#ffc1cc',
      titleColor: 'text-red-800',
      titleEmoji: '🧠',
      gridSpan: 'md:col-span-1',
      cardWidth: 'md:w-[55%]'
    },
    'Mental Clutter': {
      backgroundColor: '#9bb5ff',
      titleColor: 'text-blue-800',
      titleEmoji: '🌀',
      gridSpan: 'md:col-span-1',
      cardWidth: 'md:w-[45%]'
    },
    'Low Energy': {
      backgroundColor: '#c4b5fd',
      titleColor: 'text-purple-800',
      titleEmoji: '🥱',
      gridSpan: 'md:col-span-1',
      cardWidth: 'md:w-[48%]'
    },
    'Too Much at Once': {
      backgroundColor: '#fed7aa',
      titleColor: 'text-orange-800',
      titleEmoji: '🌊',
      gridSpan: 'md:col-span-1',
      cardWidth: 'md:w-[54%]'
    },
    'Overwhelmed': {
      backgroundColor: '#fed7aa',
      titleColor: 'text-orange-800',
      titleEmoji: '🌊',
      gridSpan: 'md:col-span-1'
    },
    'Restless': {
      backgroundColor: '#86efac',
      titleColor: 'text-green-800',
      titleEmoji: '⚡',
      gridSpan: 'md:col-span-1'
    },
    'Unfocused': {
      backgroundColor: '#a5b4fc',
      titleColor: 'text-indigo-800',
      titleEmoji: '🎯',
      gridSpan: 'md:col-span-1'
    },
    'Other': {
      backgroundColor: '#d1d5db',
      titleColor: 'text-gray-800',
      titleEmoji: '🌟',
      gridSpan: 'md:col-span-1'
    }
  };

  // Define the preferred order for categories
  const categoryOrder = ['Emotional Turmoil', 'Mental Clutter', 'Low Energy', 'Too Much at Once'];
  
  // Sort categories by preferred order
  const sortedCategories = (categories: string[]) => {
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      
      // If both are in the preferred order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the preferred order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the preferred order, sort alphabetically
      return a.localeCompare(b);
    });
  };

  const getStyleForCategory = (category: string) => {
    return categoryStyles[category as keyof typeof categoryStyles] || categoryStyles['Other'];
  };

  // Get tooltip color scheme for tasks based on database color
  const getTaskTooltipColorScheme = (task: Task) => {
    const color = task.color;
    
    if (!color) {
      return {
        bgGradient: 'from-gray-50 to-slate-50',
        border: 'border-gray-200/50',
        iconGradient: 'from-gray-400 to-slate-400',
        titleColor: 'text-gray-900',
        textColor: 'text-gray-700/80'
      };
    }
    
    // Convert hex color to appropriate Tailwind classes - exact matches for database colors
    const colorUpper = color.toUpperCase();
    switch (colorUpper) {
      case '#E0E7FF': // Getting Started & Focus + Motivation
        return {
          bgGradient: 'from-indigo-50 to-blue-50',
          border: 'border-indigo-200/50',
          iconGradient: 'from-indigo-400 to-blue-400',
          titleColor: 'text-indigo-900',
          textColor: 'text-indigo-700/80'
        };
      case '#DCFCE7': // Following Through
        return {
          bgGradient: 'from-green-50 to-emerald-50',
          border: 'border-green-200/50',
          iconGradient: 'from-green-400 to-emerald-400',
          titleColor: 'text-green-900',
          textColor: 'text-green-700/80'
        };
      case '#FEF9C3': // Planning + Organization
        return {
          bgGradient: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-200/50',
          iconGradient: 'from-yellow-400 to-amber-400',
          titleColor: 'text-yellow-900',
          textColor: 'text-yellow-700/80'
        };
      case '#CCFBF1': // Cleaning + Resetting
        return {
          bgGradient: 'from-teal-50 to-cyan-50',
          border: 'border-teal-200/50',
          iconGradient: 'from-teal-400 to-cyan-400',
          titleColor: 'text-teal-900',
          textColor: 'text-teal-700/80'
        };
      case '#DBEAFE': // Emotional Support + Self-Regulation
        return {
          bgGradient: 'from-blue-50 to-sky-50',
          border: 'border-blue-200/50',
          iconGradient: 'from-blue-400 to-sky-400',
          titleColor: 'text-blue-900',
          textColor: 'text-blue-700/80'
        };
      case '#D9F99D': // Life Maintenance
        return {
          bgGradient: 'from-lime-50 to-green-50',
          border: 'border-lime-200/50',
          iconGradient: 'from-lime-400 to-green-400',
          titleColor: 'text-lime-900',
          textColor: 'text-lime-700/80'
        };
      case '#F0FDF4': // Energy Management
        return {
          bgGradient: 'from-green-50 to-emerald-50',
          border: 'border-green-200/50',
          iconGradient: 'from-green-400 to-emerald-400',
          titleColor: 'text-green-900',
          textColor: 'text-green-700/80'
        };
      case '#F5F5F4': // Mental Clarity
        return {
          bgGradient: 'from-stone-50 to-gray-50',
          border: 'border-stone-200/50',
          iconGradient: 'from-stone-400 to-gray-400',
          titleColor: 'text-stone-900',
          textColor: 'text-stone-700/80'
        };
      default:
        // Default fallback
        return {
          bgGradient: 'from-gray-50 to-slate-50',
          border: 'border-gray-200/50',
          iconGradient: 'from-gray-400 to-slate-400',
          titleColor: 'text-gray-900',
          textColor: 'text-gray-700/80'
        };
    }
  };

  // Get tooltip color scheme based on category
  const getTooltipColorScheme = (category: string) => {
    const colorMap = {
      'Emotional Turmoil': {
        bgGradient: 'from-red-50 to-pink-50',
        border: 'border-red-200/50',
        iconGradient: 'from-red-400 to-pink-400',
        titleColor: 'text-red-900',
        textColor: 'text-red-700/80'
      },
      'Mental Clutter': {
        bgGradient: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200/50',
        iconGradient: 'from-blue-400 to-indigo-400',
        titleColor: 'text-blue-900',
        textColor: 'text-blue-700/80'
      },
      'Low Energy': {
        bgGradient: 'from-purple-50 to-violet-50',
        border: 'border-purple-200/50',
        iconGradient: 'from-purple-400 to-violet-400',
        titleColor: 'text-purple-900',
        textColor: 'text-purple-700/80'
      },
      'Too Much at Once': {
        bgGradient: 'from-orange-50 to-amber-50',
        border: 'border-orange-200/50',
        iconGradient: 'from-orange-400 to-amber-400',
        titleColor: 'text-orange-900',
        textColor: 'text-orange-700/80'
      },
      'Overwhelmed': {
        bgGradient: 'from-orange-50 to-amber-50',
        border: 'border-orange-200/50',
        iconGradient: 'from-orange-400 to-amber-400',
        titleColor: 'text-orange-900',
        textColor: 'text-orange-700/80'
      },
      'Restless': {
        bgGradient: 'from-green-50 to-emerald-50',
        border: 'border-green-200/50',
        iconGradient: 'from-green-400 to-emerald-400',
        titleColor: 'text-green-900',
        textColor: 'text-green-700/80'
      },
      'Unfocused': {
        bgGradient: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-200/50',
        iconGradient: 'from-indigo-400 to-purple-400',
        titleColor: 'text-indigo-900',
        textColor: 'text-indigo-700/80'
      }
    };
    
    return colorMap[category as keyof typeof colorMap] || {
      bgGradient: 'from-gray-50 to-slate-50',
      border: 'border-gray-200/50',
      iconGradient: 'from-gray-400 to-slate-400',
      titleColor: 'text-gray-900',
      textColor: 'text-gray-700/80'
    };
  };

  return (
    <div className="flex-1">
      <div className="text-center mb-8 md:mb-12">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="ios-segmented-control justify-center ">
              <div 
                className="ios-segment-slider"
                style={{
                  width: '50%',
                  transform: `translateX(${viewMode === 'task' ? '100%' : '0%'})`
                }}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode('feeling')}
                      className={`ios-segment ${viewMode === 'feeling' ? 'active' : ''}`}
                    >
                      <span className="w-full">Emotions</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg border border-gray-700">
                    Browse strategies based on your emotional state.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode('task')}
                      className={`ios-segment ${viewMode === 'task' ? 'active' : ''}`}
                    >
                      <span className="w-full">Tasks</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg border border-gray-700">
                    See strategies based on the task you need help with.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground leading-relaxed">
            {viewMode === 'feeling' ? 'How are you feeling right now?' : 'What do you need help with?'}
          </h2>
        </div>

        {viewMode === 'feeling' ? (
          // Feelings view with categories in 2x2 layout
          <div className="space-y-6">
            {/* First row: Emotional Turmoil + Mental Clutter */}
            <div className="flex flex-col md:flex-row gap-6">
              {sortedCategories(Object.keys(groupedFeelings)).slice(0, 2).map((category) => {
                const categoryFeelings = groupedFeelings[category];
                const categoryStyle = getStyleForCategory(category);
                return (
                  <div 
                    key={category} 
                    className={`category-card rounded-2xl p-6 md:p-8 shadow-md border border-gray-200/30 transition-all duration-300 hover:shadow-lg ${categoryStyle.cardWidth || 'flex-1'}`}
                    style={{ backgroundColor: categoryStyle.backgroundColor }}
                  >
                    <h2 className={`text-xl font-bold md:text-2xl ${categoryStyle.titleColor} mb-6 flex items-center gap-3 font-sans`}>
                      <span className="text-2xl">{categoryStyle.titleEmoji}</span>
                      <span>{category}</span>
                    </h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {categoryFeelings.map((feeling, index) => {
                        const tooltipColors = getTooltipColorScheme(category);
                        return (
                          <TooltipProvider key={feeling.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleFeelingSelect(feeling.name)}
                                  className="feeling-button bg-white hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-gray-700 text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-white rounded-full px-3 py-1.5 text-base font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                  style={{
                                    animationDelay: `${index * 0.1}s`,
                                    transform: isTransitioning ? 'translateY(-10px) scale(0.95)' : 'translateY(0) scale(1)',
                                    opacity: isTransitioning ? 0 : 1
                                  }}
                                  aria-label={`Select feeling: ${feeling.name}`}
                                >
                                  <span className="mr-2 text-lg">{feeling.emoji || '🌟'}</span>
                                  <span>{feeling.name}</span>
                                </button>
                              </TooltipTrigger>
                              {feeling.description && (
                                <TooltipContent className={`bg-gradient-to-br ${tooltipColors.bgGradient} backdrop-blur-md text-sm p-4 max-w-sm rounded-xl shadow-xl border ${tooltipColors.border} ring-1 ring-white/20`}>
                                  <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${tooltipColors.iconGradient} rounded-full flex items-center justify-center text-white text-lg`}>
                                      {feeling.emoji || '💭'}
                                    </div>
                                    <div>
                                      <p className={`font-medium ${tooltipColors.titleColor} mb-1`}>{feeling.name}</p>
                                      <p className={`${tooltipColors.textColor} leading-relaxed`}>{feeling.description}</p>
                                    </div>
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Second row: Low Energy + Too Much at Once */}
            <div className="flex flex-col md:flex-row gap-6">
              {sortedCategories(Object.keys(groupedFeelings)).slice(2, 4).map((category) => {
                const categoryFeelings = groupedFeelings[category];
                const categoryStyle = getStyleForCategory(category);
                return (
                  <div 
                    key={category} 
                    className={`category-card rounded-2xl p-6 md:p-8 shadow-md border border-gray-200/30 transition-all duration-300 hover:shadow-lg ${categoryStyle.cardWidth || 'flex-1'}`}
                    style={{ backgroundColor: categoryStyle.backgroundColor }}
                  >
                    <h2 className={`text-xl font-bold md:text-2xl ${categoryStyle.titleColor} mb-6 flex items-center gap-3 font-sans`}>
                      <span className="text-2xl">{categoryStyle.titleEmoji}</span>
                      <span>{category}</span>
                    </h2>
                    <div className={`${
                      category === 'Too Much at Once' 
                        ? 'flex overflow-x-auto pb-4 hide-scrollbar' 
                        : 'flex flex-wrap'
                    } gap-x-3 gap-y-2`}>
                      {categoryFeelings.map((feeling, index) => {
                        const tooltipColors = getTooltipColorScheme(category);
                        return (
                          <TooltipProvider key={feeling.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleFeelingSelect(feeling.name)}
                                  className="feeling-button bg-white hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-gray-700 text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-white rounded-full px-3 py-1.5 text-base font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                  style={{
                                    animationDelay: `${index * 0.1}s`,
                                    transform: isTransitioning ? 'translateY(-10px) scale(0.95)' : 'translateY(0) scale(1)',
                                    opacity: isTransitioning ? 0 : 1
                                  }}
                                  aria-label={`Select feeling: ${feeling.name}`}
                                >
                                  <span className="mr-2 text-lg">{feeling.emoji || '🌟'}</span>
                                  <span>{feeling.name}</span>
                                </button>
                              </TooltipTrigger>
                              {feeling.description && (
                                <TooltipContent className={`bg-gradient-to-br ${tooltipColors.bgGradient} backdrop-blur-md text-sm p-4 max-w-sm rounded-xl shadow-xl border ${tooltipColors.border} ring-1 ring-white/20`}>
                                  <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${tooltipColors.iconGradient} rounded-full flex items-center justify-center text-white text-lg`}>
                                      {feeling.emoji || '💭'}
                                    </div>
                                    <div>
                                      <p className={`font-medium ${tooltipColors.titleColor} mb-1`}>{feeling.name}</p>
                                      <p className={`${tooltipColors.textColor} leading-relaxed`}>{feeling.description}</p>
                                    </div>
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Tasks view with categories sorted by predefined order
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getSortedTaskCategories().map((category) => {
              const categoryTasks = groupedTasks[category];
              const categoryStyle = getTaskCategoryStyle(category);
              return (
                <div 
                  key={category} 
                  className="category-card rounded-2xl p-6 md:p-8 shadow-md border border-gray-200/30 transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: categoryStyle.backgroundColor }}
                >
                  <h2 className={`text-xl font-bold md:text-2xl ${categoryStyle.titleColor} mb-6 flex items-center gap-3 font-sans`}>
                    <span className="text-2xl">{categoryStyle.titleEmoji}</span>
                    <span>{category}</span>
                  </h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {categoryTasks.map((task, index) => {
                      const tooltipColors = getTaskTooltipColorScheme(task);
                      return (
                        <TooltipProvider key={task.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleTaskSelect(task.name)}
                                className="feeling-button bg-white hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-gray-700 text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-white rounded-full px-4 py-2 text-lg font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                style={{
                                  animationDelay: `${index * 0.1}s`,
                                  transform: isTransitioning ? 'translateY(-10px) scale(0.95)' : 'translateY(0) scale(1)',
                                  opacity: isTransitioning ? 0 : 1
                                }}
                                aria-label={`Select task: ${task.name}`}
                              >
                                <span className="mr-2 text-lg">{task.emoji || '🛠'}</span>
                                <span>{task.name}</span>
                              </button>
                            </TooltipTrigger>
                            {task.description && (
                              <TooltipContent className={`bg-gradient-to-br ${tooltipColors.bgGradient} backdrop-blur-md text-sm p-4 max-w-sm rounded-xl shadow-xl border ${tooltipColors.border} ring-1 ring-white/20`}>
                                <div className="flex items-start gap-3">
                                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${tooltipColors.iconGradient} rounded-full flex items-center justify-center text-white text-lg`}>
                                    {task.emoji || '🛠️'}
                                  </div>
                                  <div>
                                    <p className={`font-medium ${tooltipColors.titleColor} mb-1`}>{task.name}</p>
                                    <p className={`${tooltipColors.textColor} leading-relaxed`}>{task.description}</p>
                                  </div>
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hover-only Reassuring Message */}
      <div className="text-center py-8 md:py-12 group cursor-default">
        <div className="max-w-2xl mx-auto space-y-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light italic">
            This is a gentle space with tools designed specifically for ADHD minds. 
            Take your time, breathe, and choose what feels right for you today.
          </p>
        </div>
      </div>
    </div>
  )
}

