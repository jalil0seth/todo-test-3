/*
  # Add RLS Policies

  1. Security Changes
    - Add RLS policies for tasks, subtasks, and comments tables
    - Ensure users can only access their own data
    - Enable cascading policies for subtasks and comments
*/

-- Tasks policies
CREATE POLICY IF NOT EXISTS "Users can create their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Subtasks policies
CREATE POLICY IF NOT EXISTS "Users can manage subtasks of their tasks"
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
CREATE POLICY IF NOT EXISTS "Users can manage comments on their tasks"
  ON comments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND tasks.user_id = auth.uid()
    )
  );