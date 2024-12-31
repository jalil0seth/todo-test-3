import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TimeFrame, TaskStatus, Subtask, Comment } from '../types/task';
import { calculateTaskRank } from '../utils/taskRanking';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'rank' | 'status'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  filterByTimeFrame: (timeFrame: TimeFrame) => void;
  filterByStatus: (status: TaskStatus) => void;
  searchTasks: (query: string) => void;
  filteredTasks: Task[];
  reorderTasks: (startIndex: number, endIndex: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeFrameFilter, setTimeFrameFilter] = useState<TimeFrame | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (tasksError) {
      console.error('Error loading tasks:', tasksError);
      return;
    }

    // Load subtasks and comments for each task
    const tasksWithDetails = await Promise.all(
      tasksData.map(async (task) => {
        const [subtasks, comments] = await Promise.all([
          loadSubtasks(task.id),
          loadComments(task.id),
        ]);
        return { ...task, subtasks, comments };
      })
    );

    setTasks(tasksWithDetails);
  };

  const loadSubtasks = async (taskId: string): Promise<Subtask[]> => {
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error loading subtasks:', error);
      return [];
    }

    return data || [];
  };

  const loadComments = async (taskId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error loading comments:', error);
      return [];
    }

    return data || [];
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'rank' | 'status'>) => {
    if (!user) return;

    const maxOrder = Math.max(0, ...tasks.map(t => t.order));
    const newTask = {
      ...task,
      user_id: user.id,
      order: maxOrder + 1,
      rank: calculateTaskRank(task as Task),
      status: 'active' as TaskStatus
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    setTasks(prev => [...prev, { ...data, subtasks: [], comments: [] }]);
  };

  // ... rest of the context implementation remains the same

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      archiveTask,
      filterByTimeFrame,
      filterByStatus,
      searchTasks,
      filteredTasks,
      reorderTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}