-- Update Barrier Categories
-- Split the large "Cognitive Barriers" category into more specific, user-friendly categories

-- Getting Started (3 items)
UPDATE barriers SET category = 'Getting Started' WHERE name = 'Executive Dysfunction';
UPDATE barriers SET category = 'Getting Started' WHERE name = 'Inertia';
UPDATE barriers SET category = 'Getting Started' WHERE name = 'Task Initiation';

-- Decision & Planning (3 items)
UPDATE barriers SET category = 'Decision & Planning' WHERE name = 'Decision Fatigue';
UPDATE barriers SET category = 'Decision & Planning' WHERE name = 'Decision Paralysis';
UPDATE barriers SET category = 'Decision & Planning' WHERE name = 'Perfectionism';

-- Memory & Time (2 items)
UPDATE barriers SET category = 'Memory & Time' WHERE name = 'Time Blindness';
UPDATE barriers SET category = 'Memory & Time' WHERE name = 'Working Memory Failures';

-- Verify the changes
SELECT category, count(*) as count
FROM barriers 
GROUP BY category 
ORDER BY category;