import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  CalendarDays,
  ListTodo,
  UserCheck,
  Award,
  History,
  UserCircle2,
  PlusCircle,
  Sparkles,
  ClipboardList,
  Building2,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isVolunteer, isOrganization } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const volunteerLinks = [
    { name: 'Dashboard', to: '/volunteer/dashboard', icon: LayoutDashboard },
    { name: 'Find Opportunities', to: '/opportunities', icon: Compass },
    { name: 'My Applications', to: '/volunteer/applications', icon: FileCheck2 },
    { name: 'My Events', to: '/volunteer/events', icon: CalendarDays },
    { name: 'My Tasks', to: '/volunteer/tasks', icon: ListTodo },
    { name: 'Attendance', to: '/volunteer/attendance', icon: UserCheck },
    { name: 'Certificates', to: '/volunteer/certificates', icon: Award },
    { name: 'Volunteer History', to: '/volunteer/history', icon: History },
    { name: 'Profile', to: '/volunteer/profile', icon: UserCircle2 },
  ];

  const organizationLinks = [
    { name: 'Dashboard', to: '/organization/dashboard', icon: LayoutDashboard },
    { name: 'Create Event', to: '/organization/create-event', icon: PlusCircle },
    { name: 'My Events', to: '/organization/events', icon: CalendarDays },
    { name: 'Applications', to: '/organization/applications', icon: ClipboardList },
    { name: 'AI Recommendations', to: '/organization/ai-recommendations', icon: Sparkles },
    { name: 'Task Assignment', to: '/organization/tasks', icon: ListTodo },
    { name: 'Attendance', to: '/organization/attendance', icon: UserCheck },
    { name: 'Certificates', to: '/organization/certificates', icon: Award },
    { name: 'Organization Profile', to: '/organization/profile', icon: Building2 },
  ];

  const links = isVolunteer ? volunteerLinks : organizationLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-10 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col flex-1 overflow-y-auto">
          {/* Header on mobile */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 lg:hidden">
            <span className="text-sm font-bold text-slate-800">Menu</span>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role badge */}
          <div className="mb-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
