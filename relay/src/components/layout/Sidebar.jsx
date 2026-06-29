import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Settings, LogOut, ChevronLeft, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import { useProjectStore } from '../../store/useProjectStore';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
];

const BOTTOM = [
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const activeCount = useProjectStore(
    s => s.projects.filter(p => p.status === 'active').length
  );
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-panel flex-shrink-0',
      'border-r border-white/8 transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-[220px]'
    )}>

      <div className={cn(
        'flex items-center h-16 px-3 border-b border-white/8 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <div className={cn(
          'flex items-center gap-2.5 overflow-hidden transition-all duration-200',
          collapsed ? 'w-0 opacity-0' : 'opacity-100'
        )}>
          <div className="w-7 h-7 rounded-lg bg-olive-500 flex items-center justify-center flex-shrink-0">
            <GitBranch size={13} className="text-cream" fill="#F0EDE4" />
          </div>
          <span className="font-display font-bold text-white text-sm tracking-tight whitespace-nowrap">
            Relay
          </span>
        </div>

        <button
          onClick={() => setCollapsed(p => !p)}
          className="w-7 h-7 rounded-lg flex items-center justify-center
            text-white/30 hover:text-white hover:bg-white/8
            transition-all duration-150 flex-shrink-0"
        >
          <ChevronLeft size={14} className={cn(
            'transition-transform duration-300',
            collapsed && 'rotate-180'
          )} />
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-hidden">
        {NAV.map(item => (
          <SidebarLink
            key={item.to}
            {...item}
            collapsed={collapsed}
            badge={item.to === '/projects' ? activeCount || undefined : undefined}
          />
        ))}
      </nav>

      <div className="py-2 px-2 space-y-0.5 border-t border-white/8">
        {BOTTOM.map(item => (
          <SidebarLink key={item.to} {...item} collapsed={collapsed} />
        ))}

        <button
          onClick={() => { logout(); navigate('/login'); }}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
            'text-white/30 hover:text-white/70 hover:bg-white/5',
            'transition-all duration-150',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={15} className="flex-shrink-0" />
          <span className={cn(
            'text-xs font-medium transition-all duration-200',
            collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          )}>Logout</span>
        </button>
      </div>

      <div className={cn(
        'flex items-center gap-2.5 p-3 border-t border-white/8 flex-shrink-0',
        collapsed && 'justify-center'
      )}>
        <div className="w-8 h-8 rounded-full bg-olive-500 flex-shrink-0
          flex items-center justify-center text-white text-xs font-bold font-display">
          {initials}
        </div>
        <div className={cn(
          'flex-1 min-w-0 overflow-hidden transition-all duration-200',
          collapsed ? 'w-0 opacity-0' : 'opacity-100'
        )}>
          <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'User'}</p>
          <p className="text-[10px] text-white/30 truncate">{user?.email ?? ''}</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon: Icon, label, collapsed, badge }) {
  return (
    <NavLink to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'transition-all duration-150 text-xs font-medium',
        isActive
          ? 'bg-white/12 text-white'
          : 'text-white/35 hover:text-white/70 hover:bg-white/6',
        collapsed && 'justify-center'
      )}>
      <Icon size={15} className="flex-shrink-0" />
      <span className={cn(
        'transition-all duration-200 whitespace-nowrap flex-1',
        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
      )}>
        {label}
      </span>
      {/* Badge — sirf expanded mode mein */}
      {badge && !collapsed && (
        <span className="px-1.5 py-0.5 rounded-full bg-white/15
          text-white/70 text-[9px] font-bold min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
}