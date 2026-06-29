import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, CheckCircle2, Circle,
  FileText, Download, MessageSquare,
  ArrowRight, Clock, DollarSign,
  AlertCircle, Check, Star,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { cn, formatDate, daysUntil } from '../../lib/utils';

const CLIENT_STATUS = {
  active: { label: 'In Progress', dot: 'bg-olive-400' },
  review: { label: 'Under Review', dot: 'bg-warning' },
  completed: { label: 'Completed', dot: 'bg-success' },
  paused: { label: 'On Hold', dot: 'bg-subtle' },
};

function InvalidToken() {
  return (
    <div className="min-h-screen bg-cream flex flex-col
      items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-olive-100 flex items-center
        justify-center mb-5">
        <AlertCircle size={22} className="text-olive-500" />
      </div>
      <h1 className="font-display font-extrabold text-olive-900 text-2xl mb-2">
        Link not found
      </h1>
      <p className="text-sm text-muted mb-6 max-w-xs leading-relaxed">
        This project link is invalid or may have expired.
        Please contact your project manager for a new link.
      </p>
      <Link to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
          bg-olive-900 text-cream text-xs font-bold uppercase tracking-nav
          hover:bg-olive-700 transition-colors">
        Go to Relay
      </Link>
    </div>
  );
}

function FileItem({ file }) {
  return (
    <div className="flex items-center justify-between py-3 px-1 group
      hover:bg-cream rounded-xl transition-colors duration-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-olive-100 flex items-center
          justify-center flex-shrink-0">
          <FileText size={14} className="text-olive-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-olive-900 leading-tight">
            {file.name}
          </p>
          <p className="text-[10px] text-subtle mt-0.5">
            {file.size} · {formatDate(file.uploadedAt)}
          </p>
        </div>
      </div>
      <a
        href={file.url}
        download
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
          border border-border bg-surface text-[10px] font-bold
          text-muted uppercase tracking-nav
          hover:border-olive-300 hover:text-olive-900
          opacity-0 group-hover:opacity-100
          transition-all duration-150"
      >
        <Download size={10} />
        Download
      </a>
    </div>
  );
}

function FeedbackItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 py-4 border-b border-border
        last:border-0"
    >
      <div className="w-8 h-8 rounded-full bg-olive-100 flex-shrink-0
        flex items-center justify-center">
        <span className="text-xs font-bold text-olive-700">
          {item.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-olive-900">{item.name}</span>
          <span className="text-[10px] text-subtle">
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed">{item.message}</p>
      </div>
    </motion.div>
  );
}

export default function ClientView() {
  const { token } = useParams();
  const project = useProjectStore(s => s.getByToken(token));
  const addFeedback = useProjectStore(s => s.addFeedback);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nameErr, setNameErr] = useState('');
  const [msgErr, setMsgErr] = useState('');

  if (!project) return <InvalidToken />;

  const status = CLIENT_STATUS[project.status] ?? CLIENT_STATUS.active;
  const daysLeft = daysUntil(project.dueDate);
  const balance = project.budget - project.paid;
  const doneCount = project.milestones.filter(m => m.done).length;
  const files = project.files ?? [];
  const feedback = project.feedback ?? [];

  async function handleFeedback(e) {
    e.preventDefault();
    setNameErr('');
    setMsgErr('');

    let valid = true;
    if (!name.trim()) {
      setNameErr('Name is required');
      valid = false;
    }
    if (!message.trim()) {
      setMsgErr('Message is required');
      valid = false;
    }
    if (!valid) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    addFeedback(project.id, { name, message });
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-cream">

      <nav className="sticky top-0 z-10 bg-cream/80 backdrop-blur-md
        border-b border-border">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14
          flex items-center justify-between">

          <Link to="/" className="flex items-center gap-1.5 group">
            <div className="w-6 h-6 rounded-md bg-olive-900 flex items-center
              justify-center group-hover:bg-olive-700 transition-colors">
              <GitBranch size={11} className="text-cream" fill="#F0EDE4" />
            </div>
            <span className="font-display font-bold text-olive-900 text-xs">
              Relay
            </span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            border border-border bg-surface">
            <span className={cn('w-1.5 h-1.5 rounded-full', status.dot,
              project.status === 'active' && 'animate-pulse'
            )} />
            <span className="text-[10px] font-bold text-olive-900 uppercase tracking-nav">
              {status.label}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Project Update
          </p>

          <h1 className="font-display font-extrabold text-olive-900
            text-3xl sm:text-4xl leading-tight mb-1">
            {project.name}
          </h1>

          <p className="text-sm text-muted mb-8">
            {project.client.name}
            {project.description && (
              <span className="hidden sm:inline"> · {project.description}</span>
            )}
          </p>

          <div className="bg-surface border border-border rounded-3xl p-7">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-5">
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-display font-extrabold text-olive-900
                    text-[4.5rem] leading-none"
                >
                  {project.progress}%
                </motion.span>
                <p className="text-sm text-muted mt-1">
                  {doneCount} of {project.milestones.length} milestones complete
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 justify-end mb-1">
                  <Clock size={12} className={cn(
                    daysLeft < 7 ? 'text-danger' : 'text-subtle'
                  )} />
                  <span className={cn(
                    'text-sm font-semibold',
                    daysLeft < 0 ? 'text-danger'
                      : daysLeft < 7 ? 'text-warning'
                        : 'text-olive-900'
                  )}>
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)} days overdue`
                      : daysLeft === 0
                        ? 'Due today'
                        : `${daysLeft} days left`
                    }
                  </span>
                </div>
                <p className="text-xs text-subtle">
                  Due {formatDate(project.dueDate)}
                </p>
              </div>
            </div>

            <div className="h-3 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                className={cn(
                  'h-full rounded-full',
                  project.progress === 100
                    ? 'bg-success'
                    : project.progress > 70
                      ? 'bg-olive-500'
                      : 'bg-olive-400'
                )}
              />
            </div>

            {project.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-2 mt-4 px-4 py-2.5
                  rounded-2xl bg-success/8 border border-success/20"
              >
                <Star size={13} className="text-success" fill="currentColor" />
                <p className="text-xs font-semibold text-success">
                  Project completed successfully. Thank you for choosing us!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Milestones
          </h2>

          <div className="bg-surface border border-border rounded-2xl
            divide-y divide-border overflow-hidden">
            {project.milestones.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                  'border-2 transition-colors duration-200',
                  m.done
                    ? 'bg-olive-700 border-olive-700'
                    : 'bg-transparent border-border'
                )}>
                  {m.done && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="10" height="10" viewBox="0 0 10 8" fill="none"
                    >
                      <path d="M1 4L3.5 6.5L9 1"
                        stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>

                <span className="text-[10px] font-bold text-subtle w-4
                  flex-shrink-0">
                  {i + 1}
                </span>

                <span className={cn(
                  'text-sm flex-1 transition-colors',
                  m.done
                    ? 'text-subtle line-through'
                    : 'text-olive-900 font-medium'
                )}>
                  {m.title}
                </span>

                {m.done && (
                  <span className="text-[10px] font-bold text-olive-400
                    uppercase tracking-wide flex-shrink-0">
                    Done
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <h2 className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Invoice Summary
          </h2>

          <div className="bg-panel rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6
              border-b border-white/8">
              {[
                { label: 'Total', val: `$${project.budget.toLocaleString()}`, cls: 'text-white' },
                { label: 'Paid', val: `$${project.paid.toLocaleString()}`, cls: 'text-olive-300' },
                { label: 'Balance', val: `$${balance.toLocaleString()}`, cls: balance > 0 ? 'text-warning' : 'text-success' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] font-bold text-white/30
                    uppercase tracking-nav mb-1">
                    {item.label}
                  </p>
                  <p className={`font-display font-extrabold text-xl ${item.cls}`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <DollarSign size={13} className="text-white/30" />
                <span className="text-xs text-white/50">
                  {balance === 0
                    ? 'Fully paid — thank you!'
                    : balance === project.budget
                      ? 'Payment pending'
                      : 'Partial payment received'
                  }
                </span>
              </div>

              <span className={cn(
                'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-nav',
                balance === 0
                  ? 'bg-success/15 text-success'
                  : balance === project.budget
                    ? 'bg-warning/15 text-warning'
                    : 'bg-olive-500/15 text-olive-300'
              )}>
                {balance === 0
                  ? 'Paid in Full'
                  : balance === project.budget
                    ? 'Unpaid'
                    : 'Partially Paid'
                }
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mb-6"
        >
          <h2 className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Shared Files
          </h2>

          <div className="bg-surface border border-border rounded-2xl
            overflow-hidden">
            {files.length > 0 ? (
              <div className="px-5 py-2 divide-y divide-border">
                {files.map(f => (
                  <FileItem key={f.id} file={f} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center
                py-12 text-center">
                <div className="w-10 h-10 rounded-2xl bg-olive-100
                  flex items-center justify-center mb-3">
                  <FileText size={17} className="text-olive-400" />
                </div>
                <p className="text-sm font-medium text-olive-900 mb-1">
                  No files yet
                </p>
                <p className="text-xs text-subtle max-w-[200px] leading-relaxed">
                  Your project manager hasn't shared any files yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="mb-12"
        >
          <h2 className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Feedback
          </h2>

          <div className="bg-surface border border-border rounded-2xl
            overflow-hidden">

            {feedback.length > 0 && (
              <div className="px-6 py-2 border-b border-border">
                {feedback.map((item, i) => (
                  <FeedbackItem key={item.id} item={item} index={i} />
                ))}
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare size={15} className="text-olive-500" />
                <h3 className="font-display font-bold text-olive-900 text-sm">
                  {submitted ? 'Feedback received!' : 'Share your thoughts'}
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center
                      py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                      className="w-12 h-12 rounded-full bg-success/10
                        flex items-center justify-center mb-4"
                    >
                      <Check size={22} className="text-success" />
                    </motion.div>
                    <p className="font-display font-bold text-olive-900
                      text-base mb-1">
                      Thank you, {name}!
                    </p>
                    <p className="text-sm text-muted leading-relaxed max-w-xs">
                      Your feedback has been shared with the project team.
                      They'll get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleFeedback}
                    className="space-y-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-olive-900
                        uppercase tracking-nav">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        value={name}
                        onChange={e => {
                          setName(e.target.value);
                          if (nameErr) setNameErr('');
                        }}
                        placeholder="Ahmad Raza"
                        className={cn(
                          'w-full px-5 py-3 rounded-full border bg-cream',
                          'text-sm text-olive-900 placeholder:text-subtle',
                          'outline-none transition-all duration-150',
                          'focus:ring-2 focus:ring-olive-100',
                          nameErr
                            ? 'border-danger focus:border-danger'
                            : 'border-border focus:border-olive-700'
                        )}
                      />
                      {nameErr && (
                        <p className="text-xs text-danger flex items-center gap-1">
                          <AlertCircle size={10} />
                          {nameErr}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-olive-900
                        uppercase tracking-nav">
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={e => {
                          setMessage(e.target.value);
                          if (msgErr) setMsgErr('');
                        }}
                        placeholder="Share any questions, concerns, or thoughts about the project..."
                        rows={4}
                        className={cn(
                          'w-full px-5 py-3 rounded-2xl border bg-cream',
                          'text-sm text-olive-900 placeholder:text-subtle',
                          'outline-none resize-none leading-relaxed',
                          'transition-all duration-150 focus:ring-2 focus:ring-olive-100',
                          msgErr
                            ? 'border-danger focus:border-danger'
                            : 'border-border focus:border-olive-700'
                        )}
                      />
                      {msgErr && (
                        <p className="text-xs text-danger flex items-center gap-1">
                          <AlertCircle size={10} />
                          {msgErr}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-full bg-olive-900 text-cream
                        text-xs font-bold uppercase tracking-nav
                        hover:bg-olive-700 active:scale-[0.99]
                        transition-all duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2
                            border-cream/30 border-t-cream animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Feedback
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="text-center pb-4">
          <Link to="/"
            className="inline-flex items-center gap-1.5 text-xs text-subtle
              hover:text-olive-700 transition-colors">
            <GitBranch size={10} className="text-olive-400" />
            Powered by Relay
          </Link>
        </div>

      </div>
    </div>
  );
}