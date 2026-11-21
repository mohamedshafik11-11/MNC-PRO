import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeeklyTask } from '../types';

interface WeeklyTasksViewProps {
  tasks: WeeklyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: WeeklyTask) => void;
}

export function WeeklyTasksView({ tasks, onToggleTask, onAddTask }: WeeklyTasksViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WeeklyTask['category']>('System Design');

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    onToggleTask(id);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created: WeeklyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      dueDate: 'This Sunday',
      points: 40,
      completed: false,
      priority: 'High',
    };

    onAddTask(created);
    setNewTaskTitle('');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'All') return true;
    return t.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-blue-600" />
              Tier-1 MNC Weekly Sprint Tasks
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {completedCount}/{tasks.length} Completed ({progressPercent}%)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Structured daily curriculum designed by Google, Amazon & Microsoft hiring bar-raisers.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span>Weekly Progress</span>
            <span className="text-blue-600 dark:text-blue-400">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Task Bar */}
      <form
        onSubmit={handleCreateTask}
        className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-850"
      >
        <input
          id="input-new-task-title"
          type="text"
          placeholder="Add custom MNC preparation task (e.g. Solve LeetCode #146 LRU Cache in Go)..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
        />

        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="System Design">System Design</option>
          <option value="Coding">Coding & DSA</option>
          <option value="Aptitude">Aptitude & Quant</option>
          <option value="Mock Interview">Mock Interview</option>
          <option value="Resume & LinkedIn">Resume & LinkedIn</option>
        </select>

        <button
          id="btn-add-weekly-task"
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {['All', 'Coding', 'System Design', 'Aptitude', 'Mock', 'LinkedIn'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
              filterCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            id={`task-item-${task.id}`}
            onClick={() => handleToggle(task.id)}
            className={`group cursor-pointer flex items-center justify-between gap-4 rounded-2xl border p-4 transition ${
              task.completed
                ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                : 'border-slate-200 bg-white hover:border-blue-400 dark:border-slate-800 dark:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                  task.completed
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
              </button>

              <div className="space-y-0.5">
                <p
                  className={`text-xs sm:text-sm font-semibold transition ${
                    task.completed
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-900 dark:text-white group-hover:text-blue-600'
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {task.category}
                  </span>
                  <span>•</span>
                  <span>{task.dueDate}</span>
                  <span>•</span>
                  <span className="text-amber-600 font-bold">+{task.points} pts</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  task.priority === 'High'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {task.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
