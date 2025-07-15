# 📋 Complete Database Review Guide

*Quick reference for manually reviewing all fields in strategiesdb_current.csv*

## 🎯 Review Order & Focus

### 1. **Core Strategy Info** (High Priority)
- **Name** - Clear, descriptive, unique
- **subtitle** - Concise explanation of what it is
- **description** - Complete, actionable, ADHD-friendly language
- **example** - Specific, relatable scenario
- **why_does_this_work** - 1-5 mechanisms from approved list

### 2. **User Experience Fields** (High Priority)
- **feeling_1/feeling_2** - Match approved feelings list
- **help_task** - Match approved help tasks
- **use_case** - Clear when-to-use guidance

### 3. **Classification Fields** (Medium Priority)
- **barrier** - Match approved barriers
- **issue_1/issue_2/issue_3** - Match approved issues
- **energy_state_tags** - Match approved energy states

### 4. **Tagging Fields** (Medium Priority)
- **task_context_tags** - Comma-separated, match approved list
- **solution_type_tags** - Match approved types
- **strategy_style_tags** - Match approved styles

### 5. **Metadata Fields** (Lower Priority)
- **price** - Free, $, $$, $$$, $$$$
- **source** - Proper attribution
- **Reviewed?** - Should be "yes" when complete

---

## 🔍 Field-by-Field Quick Checks

### **Name & Description**
✅ **Good:** Action-oriented, clear benefit  
❌ **Bad:** Vague, academic jargon, too long

### **feeling_1/feeling_2** 
✅ **Valid options:** Ashamed, Anxious, Guilty, Stressed, Stuck, Hopeless, Forgetful, Scattered, Overwhelmed, Overstimulated, Burned out, Restless, Drained, Wired, Frustrated, Defeated, Numb, Misunderstood, Lonely
❌ **Invalid:** Anything not on the approved list

### **help_task**
✅ **Valid options:** Starting something hard, Leaving the house, Getting going in the morning, Finishing what I start, Planning my time, Managing my schedule, Cleaning up, Resetting my space, Calming down, Recovering from a crash, Being kinder to myself, Staying focused, Finding motivation, Re-entering after a derail, Meal planning or prep, Catching up on life tasks, Doing errands, Getting through emails, Managing bills and finances, Switching between tasks, Adapting to changes, Ending hyperfocus, Having difficult conversations, Setting boundaries, Asking for help, Breaking down big projects, Prioritizing when everything feels urgent, Following through on commitments, Managing energy crashes, Working with inconsistent energy

### **barrier**
✅ **Valid options:** Time Blindness, Working Memory Failures, Task Initiation, Executive Dysfunction, Inertia, Decision Fatigue, Decision Paralysis, Perfectionism, Emotional Dysregulation, Rejection Sensitivity, Masking & Shame, Low Motivation, Overstimulation

### **energy_state_tags**
✅ **Valid options:** Low Energy, Burnout, Overstimulated, Shutdown, Wired but Tired, Hyperfocus, Restless, Scattered, Crash Recovery, Inconsistent Energy

### **task_context_tags**
✅ **Format:** "Work, Cleaning, Meal Prep" (comma-separated)
✅ **Valid options:** Work, Cleaning, Meal Prep, Planning, Time Planning, School, Errands, Emails, Grocery Shopping, Decision Making, Emotional Regulation, Self-Compassion, Recovery, Rest, Reset, Health/Medical, Social/Relationships, Finances, Exercise/Movement

### **price**
✅ **Valid options:** Free, $, $$, $$$, $$$$
❌ **Invalid:** Numbers, words like "cheap"

---

## 🚨 Common Issues to Fix

### **Text Quality Issues**
- **Missing examples** - Every strategy needs a specific example
- **Vague descriptions** - Should be actionable and specific
- **Academic language** - Should be conversational and accessible
- **Missing ADHD context** - Should address ADHD-specific challenges

### **Classification Mismatches**
- **feelings ≠ help_task** - "Anxious" feeling should match appropriate help task
- **barrier ≠ strategy** - Strategy should actually address the listed barrier
- **energy_state ≠ requirements** - High-energy strategy shouldn't be for "Burnout"

### **Format Errors**
- **Inconsistent capitalization** - Should match approved lists exactly
- **Wrong separators** - Use commas for all multi-value fields
- **Typos in approved values** - Must match data dictionary exactly

---

## ⚡ Speed Review Tips

### **Row-by-Row Method:**
1. **Scan name + description** - Does it make sense?
2. **Check feelings/help_task match** - Logical pairing?
3. **Verify tags format** - Commas, proper values?
4. **why_does_this_work** - 1-5 approved mechanisms?
5. **Mark "Reviewed? = yes"** when row is clean

### **Column-by-Column Method:**
1. **Review all Names** - Look for duplicates, unclear titles
2. **Review all feelings** - Check against approved list
3. **Review all help_tasks** - Check against approved list
4. **Continue column by column**

### **Red Flag Scanning:**
- **Empty required fields** (Name, description, example)
- **Non-approved values** in classification fields
- **Obvious mismatches** (happy strategy for sad feeling)
- **Format errors** (wrong separators, capitalization)

---

## 📊 Quality Metrics to Track

**Per Strategy:**
- [ ] All required fields filled
- [ ] All values match approved lists
- [ ] Logical field relationships
- [ ] Clear, actionable content
- [ ] ADHD-specific benefits explained

**Overall Database:**
- **Completion rate:** What % have all required fields?
- **Accuracy rate:** What % use only approved values?
- **Quality score:** How many need content improvements?

---

## 🎯 Priority Fix Order

1. **Fix empty required fields** (Name, description, example)
2. **Fix invalid classification values** (feelings, barriers, etc.)
3. **Fix format errors** (separators, capitalization)
4. **Improve content quality** (vague → specific)
5. **Add missing context** (ADHD-specific improvements)

Good luck with the review! 🚀