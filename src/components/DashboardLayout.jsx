import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { HandHeart, Menu, User, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isVolunteer } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
              title="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <HandHeart className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Volunteer<span className="text-primary">Match</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <div className="flex items-center pl-3 border-l border-slate-200 gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
