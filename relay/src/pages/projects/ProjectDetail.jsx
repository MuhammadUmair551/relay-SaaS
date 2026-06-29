import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Copy, ExternalLink, Check,
  ChevronDown, Calendar, DollarSign, Clock, GitBranch,
  FileText, Upload, Trash2, X,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useToastStore } from '../../store/useToastStore';
import { cn, formatDate, daysUntil } from '../../lib/utils';

const STATUS_OPTIONS = [
  { key: 'active', label: 'Active', cls: 'text-olive-700' },
  { key: 'review', label: 'In Review', cls: 'text-warning' },
  { key: 'completed', label: 'Completed', cls: 'text-success' },
  { key: 'paused', label: 'Paused', cls: 'text-subtle' },
];

function MilestoneItem({ milestone, onToggle }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-2.5 px-1 group
        hover:bg-cream rounded-xl transition-colors duration-100"
    >
      <button
        onClick={onToggle}
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
          'flex-shrink-0 transition-all duration-200',
          milestone.done
            ? 'bg-olive-700 border-olive-700'
            : 'border-border group-hover:border-olive-500'
        )}
      >
        <AnimatePresence>
          {milestone.done && (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              width="9" height="9" viewBox="0 0 10 8" fill="none"
            >
              <path d="M1 4L3.5 6.5L9 1"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
      <span className={cn(
        'text-sm flex-1 transition-all duration-200',
        milestone.done ? 'text-subtle line-through' : 'text-olive-900'
      )}>
        {milestone.title}
      </span>
    </motion.div>
  );
}

function FileItem({ file, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 py-3 group"
    >
      <div className="w-8 h-8 rounded-lg bg-olive-100 flex items-center
        justify-center flex-shrink-0">
        <FileText size={13} className="text-olive-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-olive-900 truncate">
          {file.name}
        </p>
        <p className="text-[10px] text-subtle mt-0.5">
          {file.size} · {formatDate(file.uploadedAt)}
        </p>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="w-7 h-7 flex items-center justify-center rounded-lg
          text-subtle hover:text-danger hover:bg-danger/8
          opacity-0 group-hover:opacity-100
          transition-all duration-150 flex-shrink-0"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastStore();

  const project = useProjectStore(s => s.getById(id));
  const toggleMilestone = useProjectStore(s => s.toggleMilestone);
  const updateStatus = useProjectStore(s => s.updateStatus);
  const deleteProject = useProjectStore(s => s.deleteProject);
  const addFile = useProjectStore(s => s.addFile);
  const removeFile = useProjectStore(s => s.removeFile);

  const [copied, setCopied] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const fileInputRef = useRef(null);

  if (!project) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted mb-4">Project not found.</p>
        <Link to="/projects"
          className="text-xs font-bold text-olive-700 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const daysLeft = daysUntil(project.dueDate);
  const balance = project.budget - project.paid;
  const clientUrl = `${window.location.origin}/c/${project.token}`;
  const doneCount = project.milestones.filter(m => m.done).length;
  const files = project.files ?? [];
  const feedback = project.feedback ?? [];

  async function handleCopy() {
    await navigator.clipboard.writeText(clientUrl);
    setCopied(true);
    toast.success('Client link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects');
    }
  }

  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;
    selectedFiles.forEach(f => addFile(id, f));
    toast.success(
      selectedFiles.length === 1
        ? `"${selectedFiles[0].name}" added`
        : `${selectedFiles.length} files added`
    );
    e.target.value = '';
  }

  function handleRemoveFile(fileId) {
    removeFile(id, fileId);
    toast.info('File removed');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-5xl mx-auto"
    >

      <div className="flex items-center gap-2 mb-8">
        <Link to="/projects"
          className="flex items-center gap-1.5 text-xs text-muted
            hover:text-olive-900 transition-colors">
          <ArrowLeft size={13} />
          Projects
        </Link>
        <span className="text-subtle text-xs">/</span>
        <span className="text-xs font-medium text-olive-900 truncate max-w-[200px]">
          {project.name}
        </span>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center
              text-sm font-bold text-white flex-shrink-0 mt-0.5"
            style={{ background: project.client.color }}
          >
            {project.client.initials}
          </div>
          <div>
            <h1 className="font-display font-extrabold text-olive-900
              text-2xl leading-tight mb-0.5">
              {project.name}
            </h1>
            <p className="text-sm text-muted">{project.client.name}</p>
            <p className="text-xs text-subtle">{project.client.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          <div className="relative">
            <button
              onClick={() => setStatusOpen(p => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-full
                border border-border bg-surface text-xs font-semibold
                text-olive-900 hover:border-olive-300 transition-all"
            >
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                {
                  active: 'bg-olive-500',
                  review: 'bg-warning',
                  completed: 'bg-success',
                  paused: 'bg-subtle',
                }[project.status]
              )} />
              {{
                active: 'Active',
                review: 'In Review',
                completed: 'Completed',
                paused: 'Paused',
              }[project.status]}
              <ChevronDown size={12} className={cn(
                'transition-transform duration-200',
                statusOpen && 'rotate-180'
              )} />
            </button>

            <AnimatePresence>
              {statusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1.5 z-20
                    bg-surface border border-border rounded-2xl
                    shadow-float py-1.5 min-w-[140px]"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        updateStatus(id, opt.key);
                        setStatusOpen(false);
                        toast.success(`Status updated to ${opt.label}`);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-4 py-2',
                        'text-xs font-semibold transition-colors',
                        'hover:bg-cream',
                        opt.cls
                      )}
                    >
                      {project.status === opt.key && <Check size={11} />}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full',
              'text-xs font-bold uppercase tracking-nav transition-all duration-200',
              copied
                ? 'bg-success text-white'
                : 'bg-olive-900 text-cream hover:bg-olive-700'
            )}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy Client Link'}
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <span className="font-display font-extrabold text-olive-900
              text-5xl leading-none">
              {project.progress}%
            </span>
            <p className="text-sm text-muted mt-1">
              {doneCount} of {project.milestones.length} milestones complete
            </p>
          </div>
          <div className="text-right">
            <p className={cn(
              'text-xs font-bold',
              daysLeft < 0 ? 'text-danger'
                : daysLeft < 7 ? 'text-warning'
                  : 'text-muted'
            )}>
              {daysLeft < 0
                ? `${Math.abs(daysLeft)} days overdue`
                : daysLeft === 0
                  ? 'Due today'
                  : `${daysLeft} days remaining`
              }
            </p>
            <p className="text-xs text-subtle mt-0.5">
              {formatDate(project.dueDate)}
            </p>
          </div>
        </div>
        <div className="h-2.5 bg-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              project.progress === 100 ? 'bg-success' : 'bg-olive-500'
            )}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          {/* Milestones */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between
              px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-olive-900 text-sm">
                Milestones
              </h2>
              <span className="text-[10px] font-bold text-subtle uppercase tracking-nav">
                {doneCount}/{project.milestones.length} done
              </span>
            </div>
            <div className="px-5 py-3 space-y-1">
              {project.milestones.map(m => (
                <MilestoneItem
                  key={m.id}
                  milestone={m}
                  onToggle={() => toggleMilestone(id, m.id)}
                />
              ))}
            </div>
            {project.progress === 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-5 mb-4 px-4 py-3 rounded-2xl
                  bg-success/8 border border-success/20
                  flex items-center gap-2"
              >
                <Check size={14} className="text-success flex-shrink-0" />
                <p className="text-xs font-semibold text-success">
                  All milestones complete! Ready for delivery.
                </p>
              </motion.div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between
              px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-display font-bold text-olive-900 text-sm">
                  Shared Files
                </h2>
                <p className="text-[10px] text-muted mt-0.5">
                  Files visible to client in their portal
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full
                  border border-border bg-cream text-[10px] font-bold
                  text-muted uppercase tracking-nav
                  hover:border-olive-300 hover:text-olive-900
                  transition-all duration-150"
              >
                <Upload size={11} />
                Upload
              </button>
            </div>

            <div className="px-5">
              {files.length > 0 ? (
                <div className="divide-y divide-border">
                  <AnimatePresence mode="popLayout">
                    {files.map(f => (
                      <FileItem
                        key={f.id}
                        file={f}
                        onRemove={handleRemoveFile}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center
                  py-10 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-olive-100
                    flex items-center justify-center mb-3">
                    <FileText size={16} className="text-olive-400" />
                  </div>
                  <p className="text-sm font-medium text-olive-900 mb-1">
                    No files yet
                  </p>
                  <p className="text-xs text-subtle mb-4 max-w-[180px] leading-relaxed">
                    Upload files to share with your client via their portal.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full
                      bg-olive-900 text-cream text-[10px] font-bold
                      uppercase tracking-nav hover:bg-olive-700 transition-colors"
                  >
                    <Upload size={10} />
                    Upload First File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">

          <div className="bg-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={13} className="text-olive-300" fill="#A8C070" />
              <p className="text-[10px] font-bold text-white/40
                uppercase tracking-nav">
                Client Portal
              </p>
            </div>
            <div className="bg-white/8 border border-white/10 rounded-xl
              px-3 py-2.5 mb-3">
              <p className="text-[10px] text-white/40 mb-0.5">Link</p>
              <p className="text-xs text-white/70 font-mono truncate">
                /c/{project.token}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2',
                  'rounded-full text-[10px] font-bold uppercase tracking-nav',
                  'transition-all duration-200',
                  copied
                    ? 'bg-success text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                )}
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <a
                href={`/c/${project.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2
                  rounded-full bg-white/10 text-white/70 text-[10px]
                  font-bold uppercase tracking-nav
                  hover:bg-white/20 transition-colors"
              >
                <ExternalLink size={10} />
                Open
              </a>
            </div>
            <p className="text-[10px] text-white/25 text-center mt-3 leading-relaxed">
              Share with client. No login needed.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <p className="px-5 py-3.5 border-b border-border
              text-[10px] font-bold text-subtle uppercase tracking-nav">
              Project Details
            </p>
            <div className="divide-y divide-border">
              {[
                {
                  icon: DollarSign,
                  label: 'Budget',
                  value: `$${project.budget.toLocaleString()}`,
                  cls: 'text-olive-900 font-bold',
                },
                {
                  icon: Check,
                  label: 'Paid',
                  value: `$${project.paid.toLocaleString()}`,
                  cls: project.paid === project.budget
                    ? 'text-success font-bold'
                    : 'text-olive-900 font-bold',
                },
                {
                  icon: Clock,
                  label: 'Balance',
                  value: `$${balance.toLocaleString()}`,
                  cls: balance > 0 ? 'text-warning font-bold' : 'text-success font-bold',
                },
                {
                  icon: Calendar,
                  label: 'Due Date',
                  value: formatDate(project.dueDate),
                  cls: 'text-olive-900',
                },
                {
                  icon: Calendar,
                  label: 'Created',
                  value: formatDate(project.createdAt),
                  cls: 'text-muted',
                },
              ].map(item => (
                <div key={item.label}
                  className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2 text-subtle">
                    <item.icon size={12} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <span className={`text-xs ${item.cls}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {feedback.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <p className="px-5 py-3.5 border-b border-border
                text-[10px] font-bold text-subtle uppercase tracking-nav
                flex items-center gap-2">
                Client Feedback
                <span className="px-2 py-0.5 bg-olive-100
                  text-olive-700 rounded-full text-[9px] font-bold">
                  {feedback.length}
                </span>
              </p>
              <div className="divide-y divide-border">
                {feedback.map(item => (
                  <div key={item.id} className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-olive-100
                        flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-olive-700">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-olive-900">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-subtle ml-auto">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed pl-8">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleDelete}
            className="w-full py-2.5 rounded-full border border-danger/20
              text-danger text-xs font-bold uppercase tracking-nav
              hover:bg-danger/5 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </motion.div>
  );
}