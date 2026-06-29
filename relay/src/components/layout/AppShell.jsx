import { Outlet }        from 'react-router-dom';
import Sidebar           from './Sidebar';
import Navbar            from './Navbar';
import ToastContainer    from '../ui/Toast';
import SearchModal       from '../ui/SearchModal';

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <SearchModal />
    </div>
  );
}