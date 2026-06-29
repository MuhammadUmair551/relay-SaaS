import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen, Users, Clock, TrendingUp,
  ArrowRight, ExternalLink, Plus, MoreHorizontal,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { getDashboardStats } from '../../data/mockData';
import { useProjectStore } from '../../store/useProjectStore';

function StatusBadge({ status }) {
  const MAP = {
    active: { label: 'Active', cls: 'bg-olive-100 text-olive-700' },
    review: { label: 'In Review', cls: 'bg-warning/10 text-warning' },
    completed: { label: 'Completed', cls: 'bg-success/10 text-success' },
    paused: { label: 'Paused', cls: 'bg-subtle/15 text-subtle' },
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

function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-olive-500 rounded-full"
        />
      </div>
      <span className="text-[10px] font-semibold text-muted w-8 text-right">
        {value}%
      </span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-surface border border-border rounded-2xl p-5
        hover:border-olive-300 hover:shadow-card transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-olive-100 flex items-center justify-center">
          <Icon size={16} className="text-olive-700" />
        </div>
      </div>
      <p className="font-display font-extrabold text-olive-900 text-2xl leading-none mb-1">
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
      {sub && (
        <p className="text-[10px] text-subtle mt-1">{sub}</p>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const user = useAuthStore(s => s.user);
  const projects = useProjectStore(s => s.projects);
  const stats = getDashboardStats(projects);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning'
    : hour < 17 ? 'Good afternoon' : 'Good evening';

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-6xl mx-auto"
    >

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-olive-900
            text-2xl mb-1 leading-tight">
            {greeting}, {firstName}.
          </h1>
          <p className="text-sm text-muted">
            {stats.active} active project{stats.active !== 1 && 's'} · {' '}
            <span className="text-warning font-medium">
              ${stats.pending.toLocaleString()} pending
            </span>
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-olive-900 text-cream text-xs font-bold uppercase tracking-nav
            hover:bg-olive-700 transition-colors"
        >
          <Plus size={12} />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={FolderOpen}
          label="Total projects"
          value={stats.total}
          sub="All time"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Active projects"
          value={stats.active}
          sub="In progress"
          delay={0.08}
        />
        <StatCard
          icon={Clock}
          label="Pending amount"
          value={`$${stats.pending.toLocaleString()}`}
          sub="Awaiting payment"
          delay={0.16}
        />
        <StatCard
          icon={TrendingUp}
          label="Total earned"
          value={`$${stats.earned.toLocaleString()}`}
          sub="All projects"
          delay={0.24}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-panel rounded-3xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-7 py-5
          border-b border-white/8">
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-nav mb-0.5">
              Overview
            </p>
            <h2 className="font-display font-bold text-white text-base">
              Recent Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="flex items-center gap-1.5 text-[10px] font-bold
              text-white/40 uppercase tracking-nav
              hover:text-white transition-colors"
          >
            View all
            <ArrowRight size={11} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                {['Project', 'Client', 'Status', 'Progress', 'Due Date', 'Budget', ''].map(h => (
                  <th key={h}
                    className="px-7 py-3 text-left text-[10px] font-bold
                      text-white/30 uppercase tracking-nav whitespace-nowrap
                      first:pl-7 last:pr-7">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, i) => (
                <motion.tr
                  key={proj.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="border-b border-white/5 last:border-0
                    hover:bg-white/4 transition-colors duration-100 group"
                >
                  <td className="px-7 py-4">
                    <span className="font-display font-semibold text-white text-sm">
                      {proj.name}
                    </span>
                  </td>

                  <td className="px-7 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0
                          flex items-center justify-center
                          text-[9px] font-bold text-white"
                        style={{ background: proj.client.color }}
                      >
                        {proj.client.initials}
                      </div>
                      <span className="text-xs text-white/60 whitespace-nowrap">
                        {proj.client.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-7 py-4">
                    <StatusBadge status={proj.status} />
                  </td>

                  <td className="px-7 py-4 min-w-[120px]">
                    <ProgressBar value={proj.progress} />
                  </td>

                  <td className="px-7 py-4">
                    <span className="text-xs text-white/50 whitespace-nowrap">
                      {new Date(proj.dueDate).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </td>

                  <td className="px-7 py-4">
                    <div>
                      <p className="text-xs font-bold text-white">
                        ${proj.budget.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-white/30">
                        ${proj.paid.toLocaleString()} paid
                      </p>
                    </div>
                  </td>

                  <td className="px-7 py-4">
                    <div className="flex items-center gap-1.5 opacity-0
                      group-hover:opacity-100 transition-opacity">
                      <button
                        title="Copy client link"
                        className="w-7 h-7 rounded-lg bg-white/8 flex items-center
                          justify-center text-white/50 hover:text-white
                          hover:bg-white/15 transition-all"
                      >
                        <ExternalLink size={11} />
                      </button>
                      <button
                        className="w-7 h-7 rounded-lg bg-white/8 flex items-center
                          justify-center text-white/50 hover:text-white
                          hover:bg-white/15 transition-all"
                      >
                        <MoreHorizontal size={11} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-7 py-4 border-t border-white/6
          flex items-center justify-between flex-wrap gap-3">
          <p className="text-[10px] text-white/25">
            Showing {projects.length} projects
          </p>
          <Link
            to="/projects"
            className="text-[10px] font-bold text-white/40 uppercase tracking-nav
              hover:text-white transition-colors flex items-center gap-1"
          >
            Manage all projects
            <ArrowRight size={10} />
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}