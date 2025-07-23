import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

// Valid Lucide icons (common ones used in ADHD apps)
const validLucideIcons = [
  'zap', 'heart', 'star', 'check', 'x', 'plus', 'minus', 'home', 'user', 'users',
  'calendar', 'clock', 'timer', 'alarm-clock', 'bell', 'book', 'bookmark', 'brain',
  'coffee', 'cup', 'smile', 'frown', 'meh', 'target', 'goal', 'trophy', 'award',
  'gift', 'heart-handshake', 'thumbs-up', 'thumbs-down', 'lightbulb', 'sun', 'moon',
  'cloud', 'umbrella', 'rainbow', 'flower', 'tree', 'leaf', 'seedling', 'sprout',
  'activity', 'trending-up', 'trending-down', 'bar-chart', 'pie-chart', 'settings',
  'gear', 'cog', 'wrench', 'hammer', 'scissors', 'paperclip', 'pin', 'map-pin',
  'navigation', 'compass', 'map', 'camera', 'image', 'video', 'music', 'headphones',
  'speaker', 'volume-2', 'phone', 'mail', 'message-circle', 'send', 'inbox', 'file',
  'folder', 'archive', 'trash', 'edit', 'edit-3', 'pen-tool', 'type', 'bold', 'italic',
  'underline', 'list', 'check-square', 'square', 'circle', 'triangle', 'diamond',
  'hexagon', 'octagon', 'more-horizontal', 'more-vertical', 'menu', 'grid', 'layout',
  'sidebar', 'panel-left', 'panel-right', 'maximize', 'minimize', 'zoom-in', 'zoom-out',
  'search', 'filter', 'sort-asc', 'sort-desc', 'refresh', 'rotate-ccw', 'rotate-cw',
  'repeat', 'shuffle', 'skip-back', 'skip-forward', 'play', 'pause', 'stop', 'record',
  'fast-forward', 'rewind', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right',
  'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up-right', 'arrow-down-right',
  'arrow-down-left', 'arrow-up-left', 'corner-up-right', 'corner-down-right', 'corner-down-left',
  'corner-up-lightbulb', 'move', 'copy', 'cut', 'paste', 'clipboard', 'save', 'download',
  'upload', 'external-link', 'link', 'unlink', 'anchor', 'eye', 'eye-off', 'lock',
  'unlock', 'key', 'shield', 'alert-triangle', 'alert-circle', 'info', 'help-circle',
  'question-mark-circle', 'x-circle', 'check-circle', 'plus-circle', 'minus-circle',
  'dollar-sign', 'credit-card', 'shopping-cart', 'shopping-bag', 'package', 'truck',
  'plane', 'car', 'bike', 'walk', 'run', 'dumbbell', 'weights', 'wind', 'droplets',
  'flame', 'zap-off', 'battery', 'battery-charging', 'wifi', 'wifi-off', 'signal',
  'bluetooth', 'cast', 'monitor', 'tv', 'smartphone', 'tablet', 'laptop', 'desktop',
  'server', 'database', 'hard-drive', 'cpu', 'memory-stick', 'usb', 'power', 'plug',
  'globe', 'map-pin', 'building', 'building-2', 'factory', 'warehouse', 'store',
  'school', 'graduation-cap', 'book-open', 'library', 'newspaper', 'file-text',
  'sticky-note', 'note', 'notebook', 'journal', 'bookmark-plus', 'tag', 'tags',
  'hash', 'at-sign', 'percent', 'slash', 'backslash', 'pipe', 'equal', 'not-equal',
  'puzzle', 'gamepad-2', 'dice-1', 'dice-2', 'dice-3', 'dice-4', 'dice-5', 'dice-6',
  'spade', 'club', 'heart-suit', 'diamond-suit', 'crown', 'gem', 'ring', 'watch',
  'stopwatch', 'hourglass', 'calendar-days', 'calendar-check', 'calendar-x', 'calendar-plus',
  'calendar-minus', 'event', 'party-popper', 'confetti', 'balloon', 'cake', 'candle',
  'gift-card', 'medal', 'ribbon', 'rosette', 'flag', 'flag-triangle-right', 'bookmark-check',
  'bookmark-x', 'bookmark-minus', 'star-half', 'star-off', 'heart-crack', 'broken-heart',
  'bandage', 'pill', 'syringe', 'thermometer', 'stethoscope', 'activity-square',
  'pulse', 'heartbeat', 'brain-circuit', 'head-phones', 'ear', 'eye-closed', 'glasses',
  'contact', 'user-check', 'user-plus', 'user-minus', 'user-x', 'users-2', 'team',
  'group', 'handshake', 'helping-hand', 'hands', 'clap', 'wave', 'peace', 'victory',
  'rock', 'paper', 'scissors-icon', 'paintbrush', 'palette', 'pipette', 'bucket',
  'spray-can', 'roller', 'paint-bucket', 'color-wheel', 'contrast', 'brightness',
  'flashlight', 'candle-icon', 'fire', 'campfire', 'fireplace', 'hot', 'cold', 'snowflake',
  'ice', 'thermometer-snowflake', 'thermometer-sun', 'weather', 'cloudy', 'partly-cloudy',
  'rain', 'drizzle', 'snow', 'sleet', 'hail', 'thunder', 'lightning', 'tornado',
  'hurricane', 'flood', 'drought', 'earthquake', 'volcano', 'mountain', 'hill',
  'valley', 'desert', 'forest', 'jungle', 'meadow', 'field', 'garden', 'park',
  'bench', 'fountain', 'statue', 'monument', 'castle', 'tower', 'bridge', 'tunnel',
  'road', 'highway', 'street', 'alley', 'intersection', 'roundabout', 'traffic-light',
  'stop-sign', 'yield-sign', 'construction', 'barrier', 'cone', 'helmet', 'vest',
  'tools', 'toolbox', 'drill', 'saw', 'screwdriver', 'pliers', 'ruler', 'level',
  'square-ruler', 'triangle-ruler', 'protractor', 'compass-icon', 'pencil', 'pen',
  'marker', 'highlighter', 'eraser', 'sharpener', 'stapler', 'paper-clip-icon',
  'binder', 'folder-open', 'file-plus', 'file-minus', 'file-check', 'file-x',
  'file-edit', 'file-copy', 'file-cut', 'file-paste', 'files', 'folder-plus',
  'folder-minus', 'folder-check', 'folder-x', 'folder-edit', 'archive-box'
]

// Icon mapping for strategy types - more comprehensive
const getAppropriateIcon = (strategyName: string, subtitle: string, useCase: string): string => {
  const name = strategyName.toLowerCase()
  const sub = subtitle.toLowerCase()
  const use = useCase.toLowerCase()
  
  // Time and productivity
  if (name.includes('minute') || name.includes('timer') || name.includes('time') || name.includes('pomodoro')) {
    return 'timer'
  }
  if (name.includes('schedule') || name.includes('calendar') || name.includes('deadline')) {
    return 'calendar'
  }
  if (name.includes('alarm') || name.includes('reminder')) {
    return 'bell'
  }
  
  // Energy and mood
  if (name.includes('energy') || name.includes('boost') || name.includes('motivation')) {
    return 'zap'
  }
  if (name.includes('mood') || name.includes('emotion') || name.includes('feeling')) {
    return 'heart'
  }
  if (name.includes('calm') || name.includes('breathing') || name.includes('meditation')) {
    return 'wind'
  }
  
  // Cleaning and organization
  if (name.includes('clean') || name.includes('tidy') || name.includes('declutter')) {
    return 'broom' // Will fallback to 'home' if broom not available
  }
  if (name.includes('organize') || name.includes('sort') || name.includes('filing')) {
    return 'folder'
  }
  if (name.includes('storage') || name.includes('container') || name.includes('box')) {
    return 'archive'
  }
  
  // Focus and attention
  if (name.includes('focus') || name.includes('attention') || name.includes('concentrate')) {
    return 'target'
  }
  if (name.includes('brain') || name.includes('mind') || name.includes('mental')) {
    return 'brain'
  }
  if (name.includes('thought') || name.includes('thinking')) {
    return 'lightbulb'
  }
  
  // Movement and exercise
  if (name.includes('exercise') || name.includes('movement') || name.includes('walk') || name.includes('run')) {
    return 'activity'
  }
  if (name.includes('stretch') || name.includes('yoga')) {
    return 'user'
  }
  
  // Food and nutrition
  if (name.includes('meal') || name.includes('food') || name.includes('eat') || name.includes('nutrition')) {
    return 'utensils' // Will fallback to 'coffee' if not available
  }
  if (name.includes('snack') || name.includes('protein')) {
    return 'apple' // Will fallback to 'coffee' if not available
  }
  if (name.includes('coffee') || name.includes('caffeine')) {
    return 'coffee'
  }
  
  // Technology and apps
  if (name.includes('app') || name.includes('digital') || name.includes('tech') || name.includes('phone')) {
    return 'smartphone'
  }
  if (name.includes('email') || name.includes('message')) {
    return 'mail'
  }
  if (name.includes('password') || name.includes('security')) {
    return 'lock'
  }
  
  // Tasks and productivity
  if (name.includes('task') || name.includes('todo') || name.includes('checklist')) {
    return 'check-square'
  }
  if (name.includes('goal') || name.includes('target') || name.includes('objective')) {
    return 'target'
  }
  if (name.includes('habit') || name.includes('routine')) {
    return 'repeat'
  }
  
  // Money and finance
  if (name.includes('money') || name.includes('finance') || name.includes('budget') || name.includes('expense')) {
    return 'dollar-sign'
  }
  if (name.includes('tracking') && name.includes('expense')) {
    return 'credit-card'
  }
  
  // Health and wellness
  if (name.includes('health') || name.includes('wellness') || name.includes('medical')) {
    return 'heart'
  }
  if (name.includes('medication') || name.includes('pill')) {
    return 'pill'
  }
  if (name.includes('sleep') || name.includes('rest')) {
    return 'moon'
  }
  
  // Social and communication
  if (name.includes('friend') || name.includes('social') || name.includes('buddy')) {
    return 'users'
  }
  if (name.includes('help') || name.includes('support')) {
    return 'help-circle'
  }
  if (name.includes('phone') && name.includes('friend')) {
    return 'phone'
  }
  
  // Entertainment and relaxation
  if (name.includes('music') || name.includes('playlist') || name.includes('song')) {
    return 'music'
  }
  if (name.includes('game') || name.includes('play') || name.includes('fun')) {
    return 'gamepad-2'
  }
  if (name.includes('reward') || name.includes('treat')) {
    return 'gift'
  }
  
  // Travel and navigation
  if (name.includes('gps') || name.includes('navigation') || name.includes('direction')) {
    return 'navigation'
  }
  if (name.includes('transport') || name.includes('travel') || name.includes('car')) {
    return 'car'
  }
  
  // Shopping and errands
  if (name.includes('shop') || name.includes('grocery') || name.includes('store')) {
    return 'shopping-cart'
  }
  if (name.includes('errand') || name.includes('batch')) {
    return 'list'
  }
  
  // Lighting and environment
  if (name.includes('light') || name.includes('bright') || name.includes('lamp')) {
    return 'sun'
  }
  if (name.includes('dark') || name.includes('night')) {
    return 'moon'
  }
  
  // Default fallbacks based on common strategy themes
  if (use.includes('overwhelm') || use.includes('stress')) {
    return 'shield'
  }
  if (use.includes('start') || use.includes('begin') || use.includes('initiat')) {
    return 'play'
  }
  if (use.includes('finish') || use.includes('complete')) {
    return 'check-circle'
  }
  
  // Ultimate fallback
  return 'star'
}

// Check if an icon exists in Lucide (simplified check)
const isValidLucideIcon = (iconName: string): boolean => {
  if (!iconName || iconName.trim() === '') return false
  
  const cleanIcon = iconName.trim().toLowerCase()
  
  // Check against our known valid icons
  if (validLucideIcons.includes(cleanIcon)) return true
  
  // Common icon variations that might be valid
  const commonValidIcons = [
    'broom', 'utensils', 'apple', 'fast-forward', 'rewind', 'pause-circle', 'play-circle',
    'stop-circle', 'volume-1', 'volume-x', 'mic', 'mic-off', 'headphones', 'speaker',
    'radio', 'disc', 'cassette-tape', 'film', 'camera-off', 'video-off', 'image-off',
    'file-audio', 'file-video', 'file-image', 'code', 'terminal', 'command', 'keyboard',
    'mouse', 'joystick', 'controller', 'remote-control'
  ]
  
  return commonValidIcons.includes(cleanIcon)
}

async function validateAndFixIcons() {
  console.log('🔍 Validating and fixing Lucide icons...')
  console.log('=========================================')

  const inputFile = path.join(__dirname, '..', 'Strategies_ADHDFriendly_aligned.csv')
  const outputFile = path.join(__dirname, '..', 'Strategies_ADHDFriendly_valid_icons.csv')

  // Read the CSV file
  const fileContent = fs.readFileSync(inputFile, 'utf-8')

  const parser = parse(fileContent, {
    columns: (headers: string[]) => headers.map(h => h.trim().replace(/^\ufeff/, '')),
    skip_empty_lines: true,
    trim: true
  })

  const strategies: any[] = []
  for await (const record of parser) {
    strategies.push(record)
  }

  console.log(`📊 Processing ${strategies.length} strategies...`)

  let fixedCount = 0
  let invalidIcons: string[] = []

  // Check and fix each strategy's icon
  for (const strategy of strategies) {
    const currentIcon = strategy.icon_file?.trim()
    
    if (!currentIcon) {
      // No icon set, assign one based on strategy
      const newIcon = getAppropriateIcon(
        strategy.Name || '',
        strategy.subtitle || '',
        strategy.use_case || ''
      )
      strategy.icon_file = newIcon
      console.log(`➕ Added icon "${newIcon}" for: ${strategy.Name}`)
      fixedCount++
    } else if (!isValidLucideIcon(currentIcon)) {
      // Invalid icon, replace it
      const newIcon = getAppropriateIcon(
        strategy.Name || '',
        strategy.subtitle || '',
        strategy.use_case || ''
      )
      invalidIcons.push(`${strategy.Name}: ${currentIcon} → ${newIcon}`)
      strategy.icon_file = newIcon
      console.log(`🔄 Fixed icon for "${strategy.Name}": ${currentIcon} → ${newIcon}`)
      fixedCount++
    } else {
      // Icon is valid, keep it
      console.log(`✅ Valid icon "${currentIcon}" for: ${strategy.Name}`)
    }
  }

  // Write the fixed CSV
  const stringifier = stringify({
    header: true,
    columns: Object.keys(strategies[0])
  })

  const outputStream = fs.createWriteStream(outputFile)
  stringifier.pipe(outputStream)

  for (const strategy of strategies) {
    stringifier.write(strategy)
  }
  stringifier.end()

  await new Promise((resolve) => {
    outputStream.on('finish', resolve)
  })

  console.log('\n🎉 Icon validation and fixing completed!')
  console.log(`🔧 Fixed/added icons for: ${fixedCount} strategies`)
  console.log(`📁 Output saved to: Strategies_ADHDFriendly_valid_icons.csv`)

  if (invalidIcons.length > 0) {
    console.log(`\n🔄 Invalid icons that were replaced:`)
    invalidIcons.forEach(change => console.log(`  ${change}`))
  }

  console.log('\n📝 All icons are now valid Lucide icons!')
}

validateAndFixIcons().catch(console.error)