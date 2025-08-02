-- Enable RLS on help_tasks table
ALTER TABLE help_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on help_tasks"
ON help_tasks
FOR SELECT
USING (true);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'help_tasks'; 