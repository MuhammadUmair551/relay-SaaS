import { Link }   from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, GitBranch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col
      items-center justify-center p-6 text-center">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-display font-extrabold text-olive-100
          text-[8rem] leading-none mb-4 select-none">
          404
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-olive-900 flex items-center justify-center">
            <GitBranch size={13} className="text-cream" fill="#F0EDE4" />
          </div>
          <span className="font-display font-bold text-olive-900 text-sm">
            Relay
          </span>
        </div>

        <h1 className="font-display font-extrabold text-olive-900
          text-2xl mb-2">
          Page not found
        </h1>
        <p className="text-sm text-muted mb-10 max-w-xs mx-auto leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-full bg-olive-900 text-cream
              text-xs font-bold uppercase tracking-nav
              hover:bg-olive-700 transition-colors">
            <ArrowLeft size={12} />
            Go home
          </Link>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-full border border-border text-olive-900
              text-xs font-semibold hover:bg-surface transition-colors">
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}