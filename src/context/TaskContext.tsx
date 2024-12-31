import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TimeFrame, TaskStatus } from '../types/task';
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
      .eq('user_id', user.id)
      .order('order', { ascending: true });

    if (tasksError) {
      console.error('Error loading tasks:', tasksError);
      return;
    }

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

  const loadSubtasks = async (taskId: string) => {
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

  const loadComments = async (taskId: string) => {
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

  const updateTask = async (task: Task) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        priority: task.priority,
        time_frame: task.timeFrame,
        completed: task.completed,
        tags: task.tags,
        status: task.status,
        rank: calculateTaskRank(task)
      })
      .eq('id', task.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting task:', error);
      return;
    }

    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const archiveTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask({ ...task, status: 'archived' });
  };

  const filterByTimeFrame = (timeFrame: TimeFrame) => {
    setTimeFrameFilter(timeFrame);
  };

  const filterByStatus = (status: TaskStatus) => {
    setStatusFilter(status);
  };

  const searchTasks = (query: string) => {
    setSearchQuery(query);
  };

  const filteredTasks = tasks
    .filter(task => {
      if (statusFilter && task.status !== statusFilter) return false;
      if (timeFrameFilter && task.timeFrame !== timeFrameFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const reorderTasks = async (startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;

    const newTasks = [...filteredTasks];
    const [removed] = newTasks.splice(startIndex, 1);
    newTasks.splice(endIndex, 0, removed);

    // Update order for all affected tasks
    const updates = newTasks.map((task, index) => ({
      id: task.id,
      order: index
    }));

    const { error } = await supabase
      .from('tasks')
      .upsert(updates.map(update => ({
        id: update.id,
        order: update.order,
        user_id: user?.id
      })));

    if (error) {
      console.error('Error reordering tasks:', error);
      return;
    }

    setTasks(prev => {
      const updated = [...prev];
      updates.forEach(update => {
        const index = updated.findIndex(t => t.id === update.id);
        if (index !== -1) {
          updated[index] = { ...updated[index], order: update.order };
        }
      });
      return updated;
    });
  };

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