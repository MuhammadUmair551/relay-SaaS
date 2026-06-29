import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, LayoutGrid, List,
  ExternalLink, Trash2, Eye,
  FolderOpen, Check,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import { cn, formatDate, daysUntil } from '../../lib/utils';
import { useToastStore } from '../../store/useToastStore';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

function StatusBadge({ status }) {
  const MAP = {
    active: { label: 'Active', cls: 'bg-olive-100   text-olive-700' },
    review: { label: 'In Review', cls: 'bg-warning/10  text-warning' },
    completed: { label: 'Completed', cls: 'bg-success/10  text-success' },
    paused: { label: 'Paused', cls: 'bg-subtle/15   text-subtle' },
  };
  const { label, cls } = MAP[status] ?? MAP.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
      rounded-full text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function ProjectCard({ project, onView, onCopyLink, onDelete }) {
  const daysLeft = daysUntil(project.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden
        hover:border-olive-300 hover:shadow-card
        transition-all duration-200 group flex flex-col"
    >
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center
              text-xs font-bold text-white flex-shrink-0"
            style={{ background: project.client.color }}
          >
            {project.client.initials}
          </div>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="font-display font-bold text-olive-900
          text-base leading-tight mb-0.5">
          {project.name}
        </h3>
        <p className="text-xs text-muted">{project.client.name}</p>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-semibold text-subtle uppercase tracking-wide">
              Progress
            </span>
            <span className="text-[10px] font-bold text-olive-700">
              {project.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-olive-500 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border mx-5" />

      <div className="px-5 py-3.5 flex items-center justify-between flex-1">
        <div>
          <p className="text-xs font-bold text-olive-900">
            ${project.budget.toLocaleString()}
          </p>
          <p className={`text-[10px] font-medium mt-0.5
            ${daysLeft < 7
              ? 'text-danger'
              : daysLeft < 14
                ? 'text-warning'
                : 'text-subtle'
            }`}
          >
            {daysLeft < 0
              ? 'Overdue'
              : daysLeft === 0
                ? 'Due today'
                : `${daysLeft}d left`
            }
          </p>
        </div>

        <div className="flex items-center gap-1.5 opacity-0
          group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onCopyLink(project.token)}
            title="Copy client link"
            className="w-7 h-7 rounded-lg border border-border bg-cream
              flex items-center justify-center text-muted
              hover:text-olive-900 hover:border-olive-300 transition-all"
          >
            <ExternalLink size={12} />
          </button>
          <button
            onClick={() => onView(project.id)}
            title="View project"
            className="w-7 h-7 rounded-lg border border-border bg-cream
              flex items-center justify-center text-muted
              hover:text-olive-900 hover:border-olive-300 transition-all"
          >
            <Eye size={12} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            title="Delete project"
            className="w-7 h-7 rounded-lg border border-border bg-cream
              flex items-center justify-center text-muted
              hover:text-danger hover:border-danger/30 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectRow({ project, onView, onCopyLink, onDelete }) {
  const daysLeft = daysUntil(project.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="flex items-center gap-4 px-5 py-3.5
        border-b border-border last:border-0 group
        hover:bg-cream/60 transition-colors duration-100"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center
          text-[10px] font-bold text-white flex-shrink-0"
        style={{ background: project.client.color }}
      >
        {project.client.initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-olive-900 text-sm truncate">
          {project.name}
        </p>
        <p className="text-xs text-muted truncate">{project.client.name}</p>
      </div>

      <div className="hidden sm:block flex-shrink-0">
        <StatusBadge status={project.status} />
      </div>

      <div className="hidden md:flex items-center gap-2 w-28 flex-shrink-0">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-olive-500 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-muted w-7 text-right">
          {project.progress}%
        </span>
      </div>

      <div className="hidden lg:block flex-shrink-0 text-right">
        <p className="text-xs text-muted">{formatDate(project.dueDate)}</p>
        <p className={`text-[10px] font-medium
          ${daysLeft < 7 ? 'text-danger' : 'text-subtle'}`}>
          {daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`}
        </p>
      </div>

      <div className="flex-shrink-0 text-right hidden lg:block">
        <p className="text-xs font-bold text-olive-900">
          ${project.budget.toLocaleString()}
        </p>
        <p className="text-[10px] text-subtle">
          ${project.paid.toLocaleString()} paid
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0
        opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onCopyLink(project.token)}
          className="w-7 h-7 rounded-lg border border-border bg-surface
            flex items-center justify-center text-muted
            hover:text-olive-900 hover:border-olive-300 transition-all">
          <ExternalLink size={11} />
        </button>
        <button onClick={() => onView(project.id)}
          className="w-7 h-7 rounded-lg border border-border bg-surface
            flex items-center justify-center text-muted
            hover:text-olive-900 hover:border-olive-300 transition-all">
          <Eye size={11} />
        </button>
        <button onClick={() => onDelete(project.id)}
          className="w-7 h-7 rounded-lg border border-border bg-surface
            flex items-center justify-center text-muted
            hover:text-danger hover:border-danger/30 transition-all">
          <Trash2 size={11} />
        </button>
      </div>
    </motion.div>
  );
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'review', label: 'In Review' },
  { key: 'completed', label: 'Completed' },
];

export default function Projects() {
  const navigate = useNavigate();
  const toast = useToastStore();
  const projects = useProjectStore(s => s.projects);
  const deleteProject = useProjectStore(s => s.deleteProject);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [copied, setCopied] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, []);
  
  const filtered = projects.filter(p => {
    const matchSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.name.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'all' || p.status === filter;

    return matchSearch && matchFilter;
  });

  async function handleCopyLink(token) {
    const link = `${window.location.origin}/c/${token}`;
    await navigator.clipboard.writeText(link);
    setCopied(token);
    toast.success('Client link copied!');
    setTimeout(() => setCopied(null), 2000);
  }

  function handleDelete(id) {
    if (window.confirm('Delete this project? This cannot be undone.')) {
      deleteProject(id);
      toast.success('Project deleted');
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-6xl mx-auto"
    >

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-olive-900 text-2xl mb-1">
            Projects
          </h1>
          <p className="text-sm text-muted">
            {projects.length} total ·{' '}
            {projects.filter(p => p.status === 'active').length} active
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5
            rounded-full bg-olive-900 text-cream
            text-xs font-bold uppercase tracking-nav
            hover:bg-olive-700 transition-colors"
        >
          <Plus size={12} />
          New Project
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">

        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-4 top-1/2
            -translate-y-1/2 text-subtle pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border
              bg-surface text-sm text-olive-900 placeholder:text-subtle
              outline-none focus:border-olive-700 focus:ring-2 focus:ring-olive-100
              transition-all duration-150"
          />
        </div>

        <div className="flex items-center bg-surface border border-border
          rounded-full p-1 gap-0.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold',
                'transition-all duration-150',
                filter === f.key
                  ? 'bg-olive-900 text-cream'
                  : 'text-muted hover:text-olive-900'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-surface border border-border
          rounded-full p-1 gap-0.5">
          {[
            { mode: 'grid', icon: LayoutGrid },
            { mode: 'list', icon: List },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'transition-all duration-150',
                viewMode === mode
                  ? 'bg-olive-900 text-cream'
                  : 'text-muted hover:text-olive-900'
              )}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              flex items-center gap-2 px-5 py-3 rounded-full
              bg-panel text-cream text-xs font-semibold shadow-panel"
          >
            <Check size={13} className="text-olive-300" />
            Client link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-olive-100 flex items-center
            justify-center mb-4">
            <FolderOpen size={20} className="text-olive-500" />
          </div>
          <p className="font-display font-bold text-olive-900 text-base mb-1">
            {search ? 'No projects found' : 'No projects yet'}
          </p>
          <p className="text-sm text-muted mb-6">
            {search
              ? `No results for "${search}"`
              : 'Create your first project to get started.'
            }
          </p>
          {!search && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5
                rounded-full bg-olive-900 text-cream
                text-xs font-bold uppercase tracking-nav
                hover:bg-olive-700 transition-colors"
            >
              <Plus size={12} />
              Create First Project
            </button>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={id => navigate(`/projects/${id}`)}
                onCopyLink={handleCopyLink}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="bg-surface border border-border rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-4 px-5 py-3 border-b border-border
            bg-cream">
            <div className="w-8 flex-shrink-0" />
            <p className="flex-1 text-[10px] font-bold text-subtle uppercase tracking-nav">
              Project
            </p>
            <p className="hidden sm:block flex-shrink-0 text-[10px] font-bold
              text-subtle uppercase tracking-nav w-24">Status</p>
            <p className="hidden md:block flex-shrink-0 text-[10px] font-bold
              text-subtle uppercase tracking-nav w-32">Progress</p>
            <p className="hidden lg:block flex-shrink-0 text-[10px] font-bold
              text-subtle uppercase tracking-nav w-24">Due Date</p>
            <p className="hidden lg:block flex-shrink-0 text-[10px] font-bold
              text-subtle uppercase tracking-nav w-20 text-right">Budget</p>
            <div className="w-20 flex-shrink-0" />
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <ProjectRow
                key={project.id}
                project={project}
                onView={id => navigate(`/projects/${id}`)}
                onCopyLink={handleCopyLink}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-subtle mt-4 text-center">
          {filtered.length} project{filtered.length !== 1 && 's'} shown
        </p>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={id => {
          toast.success('Project created!');
          navigate(`/projects/${id}`);
        }}
      />
    </motion.div>
  );
}