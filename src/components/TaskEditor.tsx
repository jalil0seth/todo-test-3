import React, { useState } from 'react';
import { Task } from '../types/task';
import { Save, X, FileText, ListChecks, MessageSquare, Edit2 } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';
import { PrioritySelect } from './PrioritySelect';
import { TimeFrameSelect } from './TimeFrameSelect';
import { TagInput } from './TagInput';
import { SubtaskList } from './task/SubtaskList';
import { Comments } from './Comments';
import { TabView } from './TabView';

interface TaskEditorProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

export function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="form-control">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="w-full text-xl font-semibold px-3 py-2 border-b focus:border-[#ff6600] focus:outline-none bg-transparent"
          placeholder="Task title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PrioritySelect
          value={editedTask.priority}
          onChange={(priority) => setEditedTask({ ...editedTask, priority })}
        />
        <TimeFrameSelect
          value={editedTask.timeFrame}
          onChange={(timeFrame) => setEditedTask({ ...editedTask, timeFrame })}
        />
      </div>

      <TagInput 
        tags={editedTask.tags || []} 
        onChange={(tags) => setEditedTask({ ...editedTask, tags })} 
      />

      <TabView
        tabs={[
          { id: 'details', label: 'Details', icon: <FileText size={16} /> },
          { id: 'subtasks', label: 'Subtasks', icon: <ListChecks size={16} /> },
          { id: 'comments', label: 'Comments', icon: <MessageSquare size={16} /> },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'details' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Description (Markdown)</label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-[#ff6600] hover:text-[#ff7711] flex items-center gap-1"
              >
                <Edit2 size={14} />
                {isEditing ? 'Preview' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#ff6600]/20 focus:border-[#ff6600] min-h-[200px] text-sm font-mono"
                placeholder="Task description (markdown supported)"
              />
            ) : (
              <div className="min-h-[200px] p-4 border rounded-lg bg-gray-50">
                <MarkdownPreview content={editedTask.description} />
              </div>
            )}
          </div>
        )}
        {activeTab === 'subtasks' && (
          <SubtaskList
            subtasks={editedTask.subtasks || []}
            onAdd={(title) => setEditedTask({
              ...editedTask,
              subtasks: [...(editedTask.subtasks || []), { id: crypto.randomUUID(), title, completed: false }]
            })}
            onToggle={(id) => setEditedTask({
              ...editedTask,
              subtasks: (editedTask.subtasks || []).map(st =>
                st.id === id ? { ...st, completed: !st.completed } : st
              )
            })}
            onDelete={(id) => setEditedTask({
              ...editedTask,
              subtasks: (editedTask.subtasks || []).filter(st => st.id !== id)
            })}
            onUpdate={(id, title) => setEditedTask({
              ...editedTask,
              subtasks: (editedTask.subtasks || []).map(st =>
                st.id === id ? { ...st, title } : st
              )
            })}
          />
        )}
        {activeTab === 'comments' && (
          <Comments
            comments={editedTask.comments || []}
            onAddComment={(content) => setEditedTask({
              ...editedTask,
              comments: [...(editedTask.comments || []), { id: crypto.randomUUID(), content, createdAt: new Date() }]
            })}
          />
        )}
      </TabView>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSave(editedTask)}
          className="btn btn-primary"
        >
          <Save size={16} /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          <X size={16} /> Cancel
        </button>
      </div>
    </form>
  );
}