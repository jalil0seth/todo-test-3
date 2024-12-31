/*
  # Update security policies for task management

  This migration adds security policies to existing tables to ensure proper access control.

  1. Security
    - Enable RLS on all tables if not already enabled
    - Add policies for tasks table (CRUD operations)
    - Add policies for subtasks table (all operations)
    - Add policies for comments table (all operations)
*/

-- Enable RLS (idempotent)
DO $$ 
BEGIN
  ALTER TABLE IF EXISTS tasks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS subtasks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS comments ENABLE ROW LEVEL SECURITY;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can manage subtasks of their tasks" ON subtasks;
  DROP POLICY IF EXISTS "Users can manage comments on their tasks" ON comments;
END $$;

-- Tasks policies
CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Subtasks policies
CREATE POLICY "Users can manage subtasks of their tasks"
  ON subtasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = subtasks.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Comments policies
CREATE POLICY "Users can manage comments on their tasks"
  ON comments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND tasks.user_id = auth.uid()
    )
  );