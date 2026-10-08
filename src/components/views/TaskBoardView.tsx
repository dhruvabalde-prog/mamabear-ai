import React, { useState, useMemo } from 'react';
import { 
  Search, CheckCircle2, Clock, ChevronRight, 
  Sparkles, MessageCircle, ArrowUpRight, Baby, Filter, UserCheck, Check, User
} from 'lucide-react';
import { TaskItem } from '../../types';

interface TaskBoardViewProps {
  tasks: TaskItem[];
  onOpenTaskModal: (task: TaskItem) => void;
  onUpdateTask: (task: TaskItem) => void;
}

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  onOpenTaskModal,
  onUpdateTask
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'Priya (Academics)' | 'Ananya (Business)' | 'Both Co-founders'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [kidFilter, setKidFilter] = useState<'all' | 'kid_friendly' | 'deep_work_no_kids'>('all');

  // All Categories from ALL 400 tasks
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return ['all', ...Array.from(set)];
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Assignee filter
      if (assigneeFilter !== 'all' && t.assignedTo !== assigneeFilter) return false;

      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      // Kid filter
      if (kidFilter !== 'all' && t.kidCompatibility !== kidFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(query);
        const matchId = t.id.toLowerCase().includes(query);
        const matchCat = t.category.toLowerCase().includes(query);
        const matchDept = t.department.toLowerCase().includes(query);
        const matchAssignee = t.assignedTo.toLowerCase().includes(query);
        if (!matchTitle && !matchId && !matchCat && !matchDept && !matchAssignee) return false;
      }

      return true;
    });
  }, [tasks, assigneeFilter, selectedCategory, statusFilter, kidFilter, searchQuery]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;

  const handleReassign = (e: React.SyntheticEvent, task: TaskItem, newAssignee: TaskItem['assignedTo']) => {
    e.stopPropagation();
    const updated: TaskItem = {
      ...task,
      assignedTo: newAssignee,
      founderRole: newAssignee.includes('Priya') ? 'academics' : newAssignee.includes('Ananya') ? 'business' : 'common'
    };
    onUpdateTask(updated);
  };

  const handleToggleStatus = (e: React.MouseEvent, task: TaskItem) => {
    e.stopPropagation();
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    onUpdateTask({
      ...task,
      status: nextStatus
    });
  };

  const handleWhatsAppShare = (e: React.MouseEvent, task: TaskItem) => {
    e.stopPropagation();
    const message = `Hi! Here is an update on our Maple Bear Subhash Nagar launch milestone:
📌 *${task.title}*
• Assigned To: ${task.assignedTo}
• Status: ${task.status.replace('_', ' ').toUpperCase()}
• Category: ${task.category}
${task.executionPlan?.summary ? `• Plan: ${task.executionPlan.summary}` : ''}`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-28">
      
      {/* Header Stat & Search Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tasks
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Launch roadmap & co-founder deliverables ({totalCount})
            </p>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 text-[11px]">
              {completedCount} Done
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 font-extrabold border border-indigo-200 text-[11px]">
              {inProgressCount} Active
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 400 tasks by keyword, category, or assignee..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
          />
        </div>

        {/* Assignee Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setAssigneeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              assigneeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setAssigneeFilter('Priya (Academics)')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              assigneeFilter === 'Priya (Academics)'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Priya ({tasks.filter(t => t.assignedTo === 'Priya (Academics)').length})
          </button>
          <button
            type="button"
            onClick={() => setAssigneeFilter('Ananya (Business)')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              assigneeFilter === 'Ananya (Business)'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            Ananya ({tasks.filter(t => t.assignedTo === 'Ananya (Business)').length})
          </button>
          <button
            type="button"
            onClick={() => setAssigneeFilter('Both Co-founders')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              assigneeFilter === 'Both Co-founders'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Both ({tasks.filter(t => t.assignedTo === 'Both Co-founders').length})
          </button>
        </div>
      </div>

      {/* Category & Status Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="all">Category ({categories.length - 1})</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="all">Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">Active</option>
            <option value="completed">Done</option>
          </select>

          <select
            value={kidFilter}
            onChange={(e) => setKidFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="all">Toddler</option>
            <option value="kid_friendly">In-Tow</option>
            <option value="deep_work_no_kids">Deep Work</option>
          </select>
        </div>

        <span className="text-[11px] font-bold text-slate-500">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* Tasks Grid List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No tasks match your filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setAssigneeFilter('all');
                setSelectedCategory('all');
                setStatusFilter('all');
                setKidFilter('all');
              }}
              className="text-xs font-bold text-indigo-600 underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onOpenTaskModal(task)}
              className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer bg-white hover:border-indigo-300 hover:shadow-xs space-y-3 ${
                task.status === 'completed' ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Title & Status Checkbox */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStatus(e, task)}
                    className="mt-0.5 shrink-0 cursor-pointer"
                    title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-emerald-500'
                    }`}>
                      {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>

                  <div className="space-y-1 min-w-0">
                    <h3 className={`font-extrabold text-sm sm:text-base text-slate-900 leading-snug ${
                      task.status === 'completed' ? 'line-through text-slate-400' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                  </div>
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => handleWhatsAppShare(e, task)}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenTaskModal(task)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Open Plan"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Metadata & 1-Tap Reassignment Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                    {task.category}
                  </span>
                  <span className="text-slate-400 font-mono">Day {task.phaseDay}</span>
                  {task.kidCompatibility === 'kid_friendly' && (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                      <Baby className="w-3 h-3" />
                      Toddler Friendly
                    </span>
                  )}
                </div>

                {/* 1-Tap Reassignment Dropdown */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-bold text-slate-400">Assigned:</span>
                  <select
                    value={task.assignedTo}
                    onChange={(e) => handleReassign(e, task, e.target.value as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold focus:outline-hidden cursor-pointer ${
                      task.assignedTo.includes('Priya')
                        ? 'bg-rose-100 text-rose-800'
                        : task.assignedTo.includes('Ananya')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <option value="Priya (Academics)">Priya (Academics)</option>
                    <option value="Ananya (Business)">Ananya (Business)</option>
                    <option value="Both Co-founders">Both Co-founders</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
