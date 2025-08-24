import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to convert markdown-style formatting to JSX
export const formatMarkdownText = (text: string): React.ReactNode[] => {
  if (!text) return [text];

  // Handle bold text (**text**)
  const withBold = text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { type: 'bold', content: part.slice(2, -2), key: `bold-${index}` };
    }
    return { type: 'text', content: part, key: `text-${index}` };
  });

  // Then handle italics (_text_) within each part
  const result: React.ReactNode[] = [];
  withBold.forEach((item) => {
    if (item.type === 'bold') {
      result.push(<strong key={item.key}>{item.content}</strong>);
    } else {
      // Process italics in text parts
      const italicParts = item.content.split(/(_[^_]+_)/).map((part, index) => {
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={`${item.key}-italic-${index}`}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
      result.push(...italicParts);
    }
  });

  return result;
};

// Enhanced version for content pages with intelligent formatting
export const formatMarkdownTextWithIntelligence = (text: string, context: 'feelings' | 'tasks' | 'barriers' | 'complex_loops' = 'feelings'): React.ReactNode[] => {
  // If text already has markdown formatting, process it as-is
  if (text.includes('**') || text.includes('_')) {
    return formatMarkdownText(text);
  }

    // For plain text advice, add intelligent formatting based on context
  const basePatterns = [
    // Emotional validation (common to both)
    { pattern: /\b(you are safe|you're safe|you are enough|you're enough|you matter|this is valid|this is real)\b/gi, style: 'bold' },
    { pattern: /\b(not your fault|not weakness|not overreacting|not broken)\b/gi, style: 'bold' },

    // Core actions and techniques (common to both)
    { pattern: /\b(breathe|pause|stop|slow down|take a break|rest)\b/gi, style: 'bold' },
    { pattern: /\b(one step|one thing|small steps|tiny actions)\b/gi, style: 'bold' },
    { pattern: /\b(body knows|brain knows|you know|trust yourself)\b/gi, style: 'bold' },

    // Time and urgency reframes (common to both)
    { pattern: /\b(right now|this moment|today|not forever|will pass|temporary)\b/gi, style: 'bold' },
    { pattern: /\b(doesn't have to be perfect|good enough|done is better|progress not perfection)\b/gi, style: 'bold' },

    // ADHD-specific concepts (common to both)
    { pattern: /\b(executive function|working memory|dopamine|nervous system|sensory|overwhelm)\b/gi, style: 'bold' },
    { pattern: /\b(ADHD brain|neurodivergent|rejection sensitivity|time blindness)\b/gi, style: 'bold' },

    // Gentle self-talk patterns for italics (common to both)
    { pattern: /\b(maybe|perhaps|gently|softly|kindly|compassionately)\b/gi, style: 'italic' },
    { pattern: /\b(it's okay to|it's normal to|you're allowed to|you can)\b/gi, style: 'italic' },
  ];

  // Context-specific patterns
  const contextPatterns = context === 'feelings' ? [
    // Feelings-specific patterns
    { pattern: /\b(you've got this|you're capable|you're learning)\b/gi, style: 'bold' },
  ] : context === 'tasks' ? [
    // Tasks-specific patterns
    { pattern: /\b(start small|tiny step|micro-task|break it down|chunk it)\b/gi, style: 'bold' },
    { pattern: /\b(timer|pomodoro|time block|schedule|deadline|priority)\b/gi, style: 'bold' },
    { pattern: /\b(focus|attention|concentration|distraction|multitask)\b/gi, style: 'bold' },
    { pattern: /\b(energy|momentum|motivation|reward)\b/gi, style: 'bold' },
    { pattern: /\b(body double|accountability|support|help|collaborate)\b/gi, style: 'bold' },
    { pattern: /\b(finish later|come back to it|pause and resume|save and continue)\b/gi, style: 'bold' },
    { pattern: /\b(task switching|initiation|completion|hyperfocus)\b/gi, style: 'bold' },
    { pattern: /\b(organize|structure|system|routine|habit|workflow)\b/gi, style: 'bold' },
    { pattern: /\b(environment|workspace|setup|prepare|tools|resources)\b/gi, style: 'bold' },
    { pattern: /\b(checklist|reminder|alarm|calendar|notes|external brain)\b/gi, style: 'bold' },
    { pattern: /\b(hydrate|eat|sleep|move|stretch|walk|exercise)\b/gi, style: 'bold' },
    { pattern: /\b(medication|supplements|therapy|support group)\b/gi, style: 'bold' },
  ] : context === 'barriers' ? [
    // Barriers-specific patterns
    { pattern: /\b(start small|tiny step|micro-action|break it down)\b/gi, style: 'bold' },
    { pattern: /\b(ask for help|reach out|support|accountability|body doubling)\b/gi, style: 'bold' },
    { pattern: /\b(you can do this|you've got this|you're capable|you're stronger)\b/gi, style: 'bold' },
    { pattern: /\b(not lazy|not stupid|not failing|not broken)\b/gi, style: 'bold' },
  ] : [
    // Complex loops-specific patterns
    { pattern: /\b(notice the pattern|recognize the loop|catch yourself|awareness|mindfulness)\b/gi, style: 'bold' },
    { pattern: /\b(interrupt|break the cycle|stop the spiral|pause the loop|redirect)\b/gi, style: 'bold' },
    { pattern: /\b(choice point|decision moment|crossroads|turning point)\b/gi, style: 'bold' },
    { pattern: /\b(self-compassion|be kind|gentle with yourself|forgive yourself)\b/gi, style: 'bold' },
    { pattern: /\b(you can break this|break the pattern|shift the loop)\b/gi, style: 'bold' },
  ];

  const emphasisPatterns = [...basePatterns, ...contextPatterns];

  let formattedText = text;
  const replacements: Array<{start: number, end: number, replacement: string, originalText: string}> = [];

  // Find and mark all patterns for replacement
  emphasisPatterns.forEach(({ pattern, style }) => {
    let match;
    // Reset the regex to start from beginning
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      const marker = style === 'bold' ? '**' : '_';
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: `${marker}${match[0]}${marker}`,
        originalText: match[0]
      });
    }
  });

  // Sort replacements by position (reverse order to avoid index shifting)
  replacements.sort((a, b) => b.start - a.start);

  // Apply replacements
  replacements.forEach(({ start, end, replacement }) => {
    formattedText = formattedText.slice(0, start) + replacement + formattedText.slice(end);
  });

  // Now process the enhanced text with our original markdown processor
  return formatMarkdownText(formattedText);
};

// Color scheme type for identity pages
interface ColorScheme {
  bg: string;
  border: string;
  bulletColor: string;
}

// Specialized formatter for identity pages with callout boxes and color schemes
export const formatIdentityMarkdownText = (text: string, colorScheme?: ColorScheme): React.ReactNode => {
  // Handle callout boxes (> content) first
  if (text.startsWith('> ')) {
    const calloutContent = text.substring(2);

    // Split by double newlines to handle multi-paragraph callouts
    const paragraphs = calloutContent.split('\n\n');

    // Use section color scheme if provided, otherwise default to blue
    const calloutColors = colorScheme ? {
      bg: colorScheme.bg.replace('/50', '/30'), // Make callout slightly more subtle
      border: colorScheme.border.split(' ')[0], // Get just the border color class
      textColor: colorScheme.bulletColor
    } : {
      bg: 'bg-blue-100/30 dark:bg-blue-900/15',
      border: 'border-blue-200',
      textColor: 'text-blue-600 dark:text-blue-400'
    };

    return (
      <div className={`${calloutColors.bg} border-l-4 ${calloutColors.border} p-4 rounded-r-lg my-4`}>
        <div className={`${calloutColors.textColor} font-medium space-y-2`}>
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              {processIdentityTextFormatting(paragraph.trim())}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return processIdentityTextFormatting(text);
};

// Helper function for identity text formatting (simplified version of the original)
const processIdentityTextFormatting = (text: string): React.ReactNode[] => {
  // If text already has markdown formatting, process it as-is
  if (text.includes('**') || text.includes('_') || text.includes('*')) {
    const result: React.ReactNode[] = [];
    let keyCounter = 0;

    // Simple approach: find all markdown patterns and replace them in order
    const processedText = text;
    const replacements: Array<{ start: number; end: number; element: React.ReactNode }> = [];

    // Find all bold patterns (**text**)
    const boldMatches = [...processedText.matchAll(/\*\*([^*]+?)\*\*/g)];
    boldMatches.forEach(match => {
      if (match.index !== undefined) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          element: <strong key={`bold-${keyCounter++}`}>{match[1]}</strong>
        });
      }
    });

    // Find all italic patterns (*text*) that don't overlap with bold
    const italicMatches = [...processedText.matchAll(/\*([^*]+?)\*/g)];
    italicMatches.forEach(match => {
      if (match.index !== undefined) {
        // Check if this overlaps with any bold matches or is part of **text**
        const overlaps = replacements.some(r =>
          (match.index! < r.end && match.index! + match[0].length > r.start)
        );

        // Also check if this is part of a **text** pattern
        const isPartOfBold = (match.index! > 0 && processedText[match.index! - 1] === '*') ||
                            (match.index! + match[0].length < processedText.length && processedText[match.index! + match[0].length] === '*');

        if (!overlaps && !isPartOfBold) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            element: <em key={`italic-${keyCounter++}`}>{match[1]}</em>
          });
        }
      }
    });

    // Find all italic patterns (_text_)
    const underscoreMatches = [...processedText.matchAll(/_([^_]+?)_/g)];
    underscoreMatches.forEach(match => {
      if (match.index !== undefined) {
        // Check if this overlaps with existing matches
        const overlaps = replacements.some(r =>
          (match.index! < r.end && match.index! + match[0].length > r.start)
        );
        if (!overlaps) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            element: <em key={`italic-${keyCounter++}`}>{match[1]}</em>
          });
        }
      }
    });

    // Sort replacements by position
    replacements.sort((a, b) => a.start - b.start);

    // Build result by interleaving text and elements
    let lastEnd = 0;
    replacements.forEach(replacement => {
      // Add text before this replacement
      if (replacement.start > lastEnd) {
        const textBefore = processedText.slice(lastEnd, replacement.start);
        if (textBefore) {
          result.push(textBefore);
        }
      }
      // Add the replacement element
      result.push(replacement.element);
      lastEnd = replacement.end;
    });

    // Add remaining text
    if (lastEnd < processedText.length) {
      const remainingText = processedText.slice(lastEnd);
      if (remainingText) {
        result.push(remainingText);
      }
    }

    // If no replacements, return original text
    return result.length > 0 ? result : [text];
  }

  return [text]; // Return plain text if no formatting
};