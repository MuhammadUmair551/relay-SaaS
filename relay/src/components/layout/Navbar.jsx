import { Search, Bell, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';

function getTitle(pathname) {
  if (pathname === '/dashboard')        return 'Dashboard';
  if (pathname === '/settings')         return 'Settings';
  if (pathname.startsWith('/projects')) return 'Projects';
  return 'Relay';
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const title        = getTitle(pathname);
  const openSearch   = useUIStore(s => s.openSearch);

  function handleNewProject() {
    navigate('/projects?new=true');
  }

  return (
    <header className="h-16 border-b border-border bg-surface
      flex items-center justify-between px-6 flex-shrink-0">

      <span className="text-sm font-semibold text-olive-900 tracking-wide">
        {title}
      </span>

      <div className="flex items-center gap-2">

        <button
          onClick={openSearch}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2
            rounded-full border border-border bg-cream text-xs text-muted
            tracking-wide hover:border-olive-300 transition-colors duration-150"
        >
          <Search size={12} />
          Search...
        </button>

        <button
          onClick={openSearch}
          className="sm:hidden w-9 h-9 rounded-full border border-border
            bg-cream flex items-center justify-center text-muted
            hover:text-olive-900 hover:border-olive-300 transition-colors"
        >
          <Search size={14} />
        </button>

        <button
          onClick={handleNewProject}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full
            bg-olive-900 text-cream text-xs font-bold uppercase tracking-nav
            hover:bg-olive-700 transition-colors duration-150"
        >
          <Plus size={12} />
          <span className="hidden sm:block">New Project</span>
        </button>

        <button className="relative w-9 h-9 rounded-full border border-border
          bg-cream flex items-center justify-center text-muted
          hover:text-olive-900 hover:border-olive-300 transition-colors">
          <Bell size={14} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5
            bg-danger rounded-full ring-1 ring-surface" />
        </button>
      </div>
    </header>
  );
}