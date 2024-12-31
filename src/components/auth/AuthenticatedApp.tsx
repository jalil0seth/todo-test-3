import React from 'react';
import { Layout } from '../Layout';
import { TaskProvider } from '../../context/TaskContext';
import { TaskList } from '../TaskList';

export function AuthenticatedApp() {
  return (
    <TaskProvider>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <TaskList />
        </div>
      </Layout>
    </TaskProvider>
  );
}