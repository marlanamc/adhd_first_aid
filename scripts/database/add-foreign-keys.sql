-- Add foreign key constraints after all tables are created
-- Run this after running the complete-schema.sql

-- Add foreign key constraints to strategies table
ALTER TABLE strategies 
ADD CONSTRAINT fk_strategies_help_task 
FOREIGN KEY (help_task_id) REFERENCES help_tasks(id) ON DELETE SET NULL;

ALTER TABLE strategies 
ADD CONSTRAINT fk_strategies_barrier 
FOREIGN KEY (barrier_id) REFERENCES barriers(id) ON DELETE SET NULL; 