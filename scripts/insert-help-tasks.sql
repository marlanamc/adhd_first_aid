-- Insert sample help tasks
INSERT INTO help_tasks (name, emoji, color, category, description) VALUES
('Break it down', '📋', '#4CAF50', 'Task Management', 'Split large tasks into smaller, manageable pieces'),
('Set a timer', '⏰', '#2196F3', 'Time Management', 'Use a timer to stay focused for short periods'),
('Body scan', '🧘‍♀️', '#9C27B0', 'Emotional Regulation', 'Check in with your body to identify tension and emotions'),
('Brain dump', '🧠', '#FF9800', 'Mental Clarity', 'Write down all thoughts to clear your mind'),
('Energy check', '🔋', '#795548', 'Energy Management', 'Assess your current energy level before starting tasks');

-- Verify the data
SELECT * FROM help_tasks ORDER BY category; 