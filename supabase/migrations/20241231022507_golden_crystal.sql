/*
  # Task Management Schema

  1. Tables
    - tasks: Main tasks table with user-specific tasks
    - subtasks: Subtasks belonging to tasks
    - comments: Comments on tasks
  
  2. Security
    - RLS enabled on all tables
    - Policies ensure users can only access their own data
*/

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  priority text NOT NULL,
  time_frame text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  "order" integer DEFAULT 0,
  rank integer DEFAULT 0,
  status text DEFAULT 'active',
  tags text[] DEFAULT ARRAY[]::text[]
);

-- Subtasks table
CREATE TABLE subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  completed boolean DEFAULT false
);

-- Comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

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