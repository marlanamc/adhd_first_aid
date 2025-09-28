# 🎯 Fresh Supabase Database Setup Guide

Complete step-by-step guide to set up your ADHD First Aid Kit database from scratch.

## 📋 Prerequisites

1. **Supabase Project**: Create a new Supabase project or have an existing one ready
2. **Environment Variables**: Ensure your `.env.local` file has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 🗄️ Step 1: Set Up Database Schema

### Option A: Clear Existing Database (if needed)
If you want to completely reset your database:

1. Go to your Supabase project → SQL Editor
2. Open `scripts/database/complete-schema.sql`
3. **Uncomment lines 14-35** (the DROP statements) to clear existing tables
4. Run the entire script

### Option B: Fresh Database
1. Go to your Supabase project → SQL Editor
2. Copy and paste the contents of `scripts/database/complete-schema.sql`
3. Run the script
4. You should see success messages confirming table creation

**Expected Result:**
- ✅ 12 main tables created (strategies, feelings, issues, barriers, help_tasks, etc.)
- ✅ 9 junction tables for relationships
- ✅ Sample data populated for lookup tables
- ✅ RLS policies enabled
- ✅ Indexes created for performance

## 📊 Step 2: Import Strategy Data

### Run the Fresh Database Import Script

```bash
# Navigate to your project directory
cd /path/to/adhd-first-aid-kit

# Run the optimized import script
tsx scripts/fresh-database-import.ts
```

**What this script does:**
1. **Tests database connection** - Ensures schema is properly set up
2. **Reads the enhanced CSV** - `Strategies_ADHDFriendly_final_with_better_icons.csv`
3. **Imports all 289 strategies** with:
   - ✅ ADHD-friendly descriptions with emoji headers
   - ✅ Detailed examples with scenarios and pro tips
   - ✅ Appropriate, meaningful icons
   - ✅ All relationship data (feelings, issues, barriers, help tasks)
   - ✅ Tag associations and "why this works" explanations

**Expected Output:**
```
🎯 ADHD First Aid Kit - Fresh Database Import
===============================================
🔗 Testing Supabase connection...
✅ Database connection successful!
📂 Reading CSV file...
📊 Found 289 strategies to import
📋 Existing strategies in database: 0
🚀 Starting import...
✅ Imported: 1% Better
✅ Imported: 2-Minute Rule
...
📈 Progress: 25/289 strategies processed
...
🎉 Import completed!
✅ Successfully imported: 289 strategies
📊 Total strategies in database: 289
```

## 🧪 Step 3: Verify Everything Works

### Test Database Queries
```bash
# Test the application
npm run dev
```

### Check Key Features:
1. **Strategy Display** - Visit `/strategies` to see all strategies with icons
2. **Feeling Navigation** - Try `/feeling/stuck` or `/feeling/overwhelmed`
3. **Task Navigation** - Try `/task/staying-focused` or `/task/starting-something-hard`
4. **Search & Filter** - Ensure strategies show up with proper relationships
5. **Strategy Details** - Click on strategies to see detailed examples

### Verify Data Integrity:
```sql
-- Run these queries in Supabase SQL Editor to verify:

-- Check strategy count
SELECT COUNT(*) FROM strategies;
-- Should return: 289

-- Check relationships are working
SELECT 
  s.name,
  f.name as feeling,
  h.name as help_task
FROM strategies s
LEFT JOIN strategy_feelings sf ON s.id = sf.strategy_id
LEFT JOIN feelings f ON sf.feeling_id = f.id
LEFT JOIN strategy_help_tasks sht ON s.id = sht.strategy_id  
LEFT JOIN help_tasks h ON sht.help_task_id = h.id
LIMIT 5;

-- Check icons are properly assigned
SELECT name, icon_file FROM strategies WHERE icon_file IS NOT NULL LIMIT 10;

-- Check lookup tables have data
SELECT 'feelings' as table_name, COUNT(*) as count FROM feelings
UNION ALL
SELECT 'help_tasks', COUNT(*) FROM help_tasks
UNION ALL  
SELECT 'issues', COUNT(*) FROM issues
UNION ALL
SELECT 'barriers', COUNT(*) FROM barriers;
```

## 🎉 Step 4: Success Verification

You should now have:

### ✅ **Complete Database Schema**
- All tables with proper relationships
- RLS policies for security
- Indexes for performance

### ✅ **Enhanced Strategy Data**
- **289 strategies** with ADHD-friendly formatting
- **Emoji + bold headers** (e.g., "# 🎯 Focus Boost: Pomodoro Technique")
- **Detailed examples** with real-world scenarios
- **Appropriate icons** that actually relate to each strategy's purpose

### ✅ **Rich Relationship Data**
- Strategies linked to feelings, issues, barriers, and help tasks
- Tag associations for advanced filtering
- "Why this works" explanations for each strategy

### ✅ **Working Application**
- Navigation by feeling or task type
- Strategy search and filtering
- Detailed strategy pages with examples
- Voting system ready (if implemented)

## 🚨 Troubleshooting

### Database Connection Issues
- Verify `.env.local` has correct Supabase URL and key
- Check Supabase project is active and accessible
- Ensure RLS policies allow public read access

### Import Failures
- Make sure CSV file exists: `Strategies_ADHDFriendly_final_with_better_icons.csv`
- Check Supabase project has sufficient storage/database limits
- Verify all tables were created by the schema script

### Application Issues
- Run `npm run build` to check for TypeScript errors
- Verify Supabase client configuration in `src/lib/supabase.ts`
- Check browser network tab for API errors

## 📱 Next Steps

With your fresh database set up, you can now:

1. **Test all application features** thoroughly
2. **Deploy to production** with confidence
3. **Add new strategies** using the same data format
4. **Implement additional features** like user favorites, voting, etc.

## 📁 Key Files

- **Schema**: `scripts/database/complete-schema.sql`
- **Import Script**: `scripts/fresh-database-import.ts`
- **Strategy Data**: `Strategies_ADHDFriendly_final_with_better_icons.csv`
- **Type Definitions**: `src/types/database.ts`
- **Supabase Client**: `src/lib/supabase.ts`

---

🎯 **Your ADHD First Aid Kit database is now ready with all 289 enhanced strategies!**