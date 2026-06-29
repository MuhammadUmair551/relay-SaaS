import { useState, useEffect, useRef } from 'react';
import { useNavigate }                 from 'react-router-dom';
import { motion, AnimatePresence }     from 'framer-motion';
import { Search, X, FolderOpen, ArrowRight } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore }      from '../../store/useUIStore';
import { cn }              from '../../lib/utils';

const STATUS_CLS = {
  active:    'bg-olive-100 text-olive-700',
  review:    'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
  paused:    'bg-subtle/15 text-subtle',
};

const STATUS_LABEL = {
  active:    'Active',
  review:    'Review',
  completed: 'Done',
  paused:    'Paused',
};

export default function SearchModal() {
  const { searchOpen, closeSearch, openSearch } = useUIStore();
  const projects = useProjectStore(s => s.projects);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && searchOpen) {
        closeSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchOpen ? closeSearch() : openSearch();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen, closeSearch, openSearch]);

  const results = query.trim()
    ? projects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.client.name.toLowerCase().includes(query.toLowerCase()) ||
        p.client.email.toLowerCase().includes(query.toLowerCase())
      )
    : projects.slice(0, 6);

  function handleSelect(id) {
    navigate(`/projects/${id}`);
    closeSearch();
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            key="s-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
            className="fixed inset-0 z-50 bg-olive-900/40 backdrop-blur-sm"
          />

          <motion.div
            key="s-modal"
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{ opacity: 0,  scale: 0.97, y: -12  }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-[12%] left-1/2 -translate-x-1/2
              z-50 w-full max-w-lg px-4"
          >
            <div className="bg-surface rounded-2xl shadow-panel
              border border-border overflow-hidden">

              <div className="flex items-center gap-3 px-4 py-3.5
                border-b border-border">
                <Search size={15} className="text-subtle flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search projects or clients..."
                  className="flex-1 text-sm text-olive-900
                    placeholder:text-subtle bg-transparent outline-none"
                />
                {query ? (
                  <button
                    onClick={() => setQuery('')}
                    className="text-subtle hover:text-olive-900
                      transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <span className="text-[10px] text-subtle font-mono
                    px-1.5 py-0.5 rounded border border-border flex-shrink-0">
                    ESC
                  </span>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="flex flex-col items-center
                    justify-center py-12 text-center">
                    <FolderOpen size={20} className="text-subtle mb-2" />
                    <p className="text-sm font-medium text-muted">
                      No projects found
                    </p>
                    <p className="text-xs text-subtle mt-0.5">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold
                      text-subtle uppercase tracking-nav">
                      {query ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'All Projects'}
                    </p>

                    {results.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className="w-full flex items-center gap-3 px-4 py-3
                          hover:bg-cream transition-colors duration-100
                          text-left group"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center
                            justify-center text-[10px] font-bold text-white
                            flex-shrink-0"
                          style={{ background: p.client.color }}
                        >
                          {p.client.initials}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-olive-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {p.client.name}
                          </p>
                        </div>

                        <span className={cn(
                          'text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0',
                          STATUS_CLS[p.status]
                        )}>
                          {STATUS_LABEL[p.status]}
                        </span>

                        <ArrowRight size={13} className="text-subtle
                          flex-shrink-0 opacity-0 group-hover:opacity-100
                          transition-opacity" />
                      </button>
                    ))}
                  </>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-border
                flex items-center gap-4">
                <span className="text-[10px] text-subtle flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-border
                    font-mono text-[9px]">↵</kbd>
                  to open
                </span>
                <span className="text-[10px] text-subtle flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-border
                    font-mono text-[9px]">ESC</kbd>
                  to close
                </span>
                <span className="ml-auto text-[10px] text-subtle">
                  to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}