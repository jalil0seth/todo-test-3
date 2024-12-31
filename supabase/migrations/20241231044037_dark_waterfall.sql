/*
  # Update security policies

  1. Security
    - Drop existing policies if they exist
    - Recreate policies for tasks, subtasks, and comments
    - Ensure users can only access their own data
*/

-- Drop existing policies using DO block
DO $$ 
BEGIN
  -- Drop task policies if they exist
  DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
  
  -- Drop subtask policies if they exist
  DROP POLICY IF EXISTS "Users can manage subtasks of their tasks" ON subtasks;
  
  -- Drop comment policies if they exist
  DROP POLICY IF EXISTS "Users can manage comments on their tasks" ON comments;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Recreate tasks policies
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

-- Recreate subtasks policy
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

-- Recreate comments policy
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