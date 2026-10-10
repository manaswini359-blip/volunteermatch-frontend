import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { HandHeart, LogOut, User as UserIcon, LayoutDashboard, PlusCircle, Compass } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isVolunteer, isOrganization } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = isVolunteer ? '/volunteer/dashboard' : isOrganization ? '/organization/dashboard' : '/login';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <HandHeart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                Volunteer<span className="text-primary">Match</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-primary/10 text-primary rounded-md">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/opportunities" className="hover:text-primary transition-colors flex items-center gap-1">
              <Compass className="w-4 h-4" /> Opportunities
            </Link>
            <a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="/#for-organizations" className="hover:text-primary transition-colors">For Organizations</a>
            <a href="/#about" className="hover:text-primary transition-colors">About</a>
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <NotificationBell />

                <Link
                  to={dashboardPath}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>

                {isOrganization && (
                  <Link
                    to="/organization/create-event"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Post Event
                  </Link>
                )}

                <div className="flex items-center pl-2 border-l border-slate-200 gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-xs">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm shadow-primary/20 transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
