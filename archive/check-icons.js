import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import * as LucideIcons from 'lucide-react'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Icon name mapping to Lucide icons (same as in the app)
const iconMapping = {
  'footprints': 'FootprintsIcon',
  'book': 'Book',
  'zap': 'Zap',
  'brain': 'Brain',
  'heart': 'Heart',
  'target': 'Target',
  'clock': 'Clock',
  'home': 'Home',
  'settings': 'Settings',
  'users': 'Users',
  'calendar': 'Calendar',
  'check-circle': 'CheckCircle',
  'alert-circle': 'AlertCircle',
  'lightbulb': 'Lightbulb',
  'shield': 'Shield',
  'trending-up': 'TrendingUp',
  'activity': 'Activity',
  'coffee': 'Coffee',
  'sun': 'Sun',
  'moon': 'Moon',
  'star': 'Star',
  'award': 'Award',
  'gift': 'Gift',
  'sparkles': 'Sparkles',
  'rocket': 'Rocket',
  'flag': 'Flag',
  'map-pin': 'MapPin',
  'phone': 'Phone',
  'mail': 'Mail',
  'message-square': 'MessageSquare',
  'camera': 'Camera',
  'video': 'Video',
  'music': 'Music',
  'play': 'Play',
  'pause': 'Pause',
  'skip-back': 'SkipBack',
  'skip-forward': 'SkipForward',
  'volume-2': 'Volume2',
  'volume-x': 'VolumeX',
  'mic': 'Mic',
  'mic-off': 'MicOff',
  'headphones': 'Headphones',
  'speaker': 'Speaker',
  'monitor': 'Monitor',
  'smartphone': 'Smartphone',
  'tablet': 'Tablet',
  'laptop': 'Laptop',
  'wifi': 'Wifi',
  'wifi-off': 'WifiOff',
  'battery': 'Battery',
  'battery-charging': 'BatteryCharging',
  'lock': 'Lock',
  'unlock': 'Unlock',
  'eye': 'Eye',
  'eye-off': 'EyeOff',
  'search': 'Search',
  'search-x': 'SearchX',
  'plus': 'Plus',
  'minus': 'Minus',
  'x': 'X',
  'check': 'Check',
  'alert-triangle': 'AlertTriangle',
  'info': 'Info',
  'help-circle': 'HelpCircle',
  'file-text': 'FileText',
  'file': 'File',
  'folder': 'Folder',
  'folder-open': 'FolderOpen',
  'download': 'Download',
  'upload': 'Upload',
  'share': 'Share',
  'link': 'Link',
  'external-link': 'ExternalLink',
  'copy': 'Copy',
  'edit': 'Edit',
  'trash': 'Trash',
  'save': 'Save',
  'undo': 'Undo',
  'redo': 'Redo',
  'rotate-ccw': 'RotateCcw',
  'rotate-cw': 'RotateCw',
  'zoom-in': 'ZoomIn',
  'zoom-out': 'ZoomOut',
  'maximize': 'Maximize',
  'minimize': 'Minimize',
  'move': 'Move',
  'crop': 'Crop',
  'scissors': 'Scissors',
  'type': 'Type',
  'bold': 'Bold',
  'italic': 'Italic',
  'underline': 'Underline',
  'strikethrough': 'Strikethrough',
  'align-left': 'AlignLeft',
  'align-center': 'AlignCenter',
  'align-right': 'AlignRight',
  'list': 'List',
  'grid': 'Grid',
  'columns': 'Columns',
  'rows': 'Rows',
  'hash': 'Hash',
  'at-sign': 'AtSign',
  'dollar-sign': 'DollarSign',
  'percent': 'Percent',
  'fast-forward': 'FastForward',
  'anchor': 'Anchor',
  'hand': 'Hand',
  'refrigerator': 'Refrigerator',
  'timer': 'Timer',
  'toolbox': 'Toolbox',
  'credit-card': 'CreditCard',
  'brush': 'Brush',
  'gem': 'Gem',
  'chef-hat': 'ChefHat',
  'hand-coins': 'HandCoins',
  'grid-3x3': 'Grid3X3',
  'broom': 'Broom',
  'lamp': 'Lamp',
  'package-2': 'Package2',
  'notebook-pen': 'NotebookPen',
  'scan-face': 'ScanFace',
  'shower-head': 'ShowerHead',
  'sunset': 'Sunset',
  'layout-dashboard': 'LayoutDashboard'
}

async function checkIcons() {
  try {
    console.log('Checking icons in database...')
    
    // Get all strategies with icon_file
    const { data, error } = await supabase
      .from('strategies')
      .select('name, icon_file')
      .not('icon_file', 'is', null)

    if (error) {
      console.error('Error fetching strategies:', error)
      return
    }

    console.log(`Found ${data.length} strategies with icons\n`)

    const iconStatus = {
      valid: [],
      invalid: [],
      missing: []
    }

    data.forEach(strategy => {
      const iconName = strategy.icon_file
      const mappedIconName = iconMapping[iconName.toLowerCase()] || 
                            iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()
      
      const IconComponent = LucideIcons[mappedIconName] || LucideIcons[`Lucide${mappedIconName}`] || LucideIcons[mappedIconName.charAt(0).toUpperCase() + mappedIconName.slice(1)]
      
      if (IconComponent) {
        iconStatus.valid.push({
          strategy: strategy.name,
          icon: iconName,
          mapped: mappedIconName
        })
      } else {
        iconStatus.invalid.push({
          strategy: strategy.name,
          icon: iconName,
          mapped: mappedIconName,
          fallback: iconName.charAt(0).toUpperCase()
        })
      }
    })

    // Report results
    console.log('✅ VALID ICONS:')
    iconStatus.valid.forEach(item => {
      console.log(`  ${item.strategy}: "${item.icon}" → ${item.mapped}`)
    })

    console.log('\n❌ INVALID ICONS (showing fallback letters):')
    iconStatus.invalid.forEach(item => {
      console.log(`  ${item.strategy}: "${item.icon}" → ${item.mapped} (fallback: "${item.fallback}")`)
    })

    console.log(`\n📊 SUMMARY:`)
    console.log(`  Valid icons: ${iconStatus.valid.length}`)
    console.log(`  Invalid icons: ${iconStatus.invalid.length}`)
    console.log(`  Total: ${data.length}`)

    // Check for "The Minimum Viable Day" specifically
    const minViableDay = data.find(s => s.name === "The Minimum Viable Day")
    if (minViableDay) {
      console.log(`\n🔍 "The Minimum Viable Day" icon: "${minViableDay.icon_file}"`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

checkIcons() 