import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the correct Core Principles structure
const correctCorePrinciples = [
  {
    icon: '✨',
    title: 'Break it way down',
    description: 'Tiny steps are less overwhelming and easier to start',
    try: 'Add a movement or water break between blocks'
  },
  {
    icon: '⏰',
    title: 'Make time visible',
    description: 'Use timers, calendars, and countdowns to anchor your plan',
    try: 'Set a visible 20-30 min timer'
  },
  {
    icon: '📌',
    title: 'Externalize everything',
    description: "Don't keep your plan in your head, write it down, make it visual",
    try: 'Do one 60-second starter action'
  },
  {
    icon: '↗️',
    title: 'Progress over perfection',
    description: "Every session counts, even if it's short or messy",
    try: 'Write a 3-step checklist you can reuse'
  },
  {
    icon: '🌱',
    title: 'Support is allowed',
    description: 'Accountability, body doubling, and accommodations are valid tools',
    try: 'Park links in a later window'
  },
  {
    icon: '⏰',
    title: 'Make time visible',
    description: 'Use visible timers and countdowns to anchor pacing',
    try: 'Use a kitchen timer in view'
  }
];

async function fixCorePrinciples() {
  console.log('🔧 Starting Core Principles fix...\n');

  // Fix tasks_content
  console.log('📋 Fixing tasks_content table...');
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks_content')
    .select('id, task_name, content_sections');

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
    return;
  }

  let tasksFixed = 0;
  for (const task of tasks) {
    if (task.content_sections && Array.isArray(task.content_sections)) {
      let needsUpdate = false;
      const updatedSections = task.content_sections.map(section => {
        if (section.title && section.title.toLowerCase().includes('core principle')) {
          needsUpdate = true;
          
          // Create properly formatted content array
          const formattedContent = correctCorePrinciples.map(principle => {
            return `${principle.icon} **${principle.title}**: ${principle.description}\n- Try: ${principle.try}`;
          });

          return {
            ...section,
            title: 'Core Principles',
            content: formattedContent
          };
        }
        return section;
      });

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('tasks_content')
          .update({ content_sections: updatedSections })
          .eq('id', task.id);

        if (updateError) {
          console.error(`❌ Error updating task ${task.task_name}:`, updateError);
        } else {
          console.log(`✅ Fixed Core Principles in task: ${task.task_name}`);
          tasksFixed++;
        }
      }
    }
  }

  console.log(`\n✅ Fixed ${tasksFixed} tasks\n`);

  // Fix complex_loops_content
  console.log('📋 Fixing complex_loops_content table...');
  const { data: loops, error: loopsError } = await supabase
    .from('complex_loops_content')
    .select('id, loop_name, content_sections');

  if (loopsError) {
    console.error('Error fetching loops:', loopsError);
    return;
  }

  let loopsFixed = 0;
  for (const loop of loops) {
    if (loop.content_sections && Array.isArray(loop.content_sections)) {
      let needsUpdate = false;
      const updatedSections = loop.content_sections.map(section => {
        if (section.title && section.title.toLowerCase().includes('core principle')) {
          needsUpdate = true;
          
          // Create properly formatted content array
          const formattedContent = correctCorePrinciples.map(principle => {
            return `${principle.icon} **${principle.title}**: ${principle.description}\n- Try: ${principle.try}`;
          });

          return {
            ...section,
            title: 'Core Principles',
            content: formattedContent
          };
        }
        return section;
      });

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('complex_loops_content')
          .update({ content_sections: updatedSections })
          .eq('id', loop.id);

        if (updateError) {
          console.error(`❌ Error updating loop ${loop.loop_name}:`, updateError);
        } else {
          console.log(`✅ Fixed Core Principles in loop: ${loop.loop_name}`);
          loopsFixed++;
        }
      }
    }
  }

  console.log(`\n✅ Fixed ${loopsFixed} loops\n`);
  console.log('🎉 Core Principles fix complete!');
}

// Run the fix
fixCorePrinciples().catch(console.error);