import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { volunteerService } from '../../services/volunteerService';
import { eventService } from '../../services/eventService';
import { applicationService } from '../../services/applicationService';
import EventCard from '../../components/EventCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Compass,
  FileCheck2,
  CalendarCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, events, prof] = await Promise.all([
          volunteerService.getDashboardStats(),
          eventService.getAllEvents(),
          volunteerService.getMyProfile()
        ]);

        setStats(statsData);
        setProfile(prof);
        setRecommendedEvents(events.slice(0, 3));

        if (prof?.id) {
          const apps = await applicationService.getApplicationsByVolunteer(prof.id);
          setRecentApplications(apps.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading volunteer dashboard..." />;
  }

  const isProfileIncomplete = (!profile?.skills || !profile.skills.trim()) && (!profile?.interests || !profile.interests.trim());

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-3xl text-slate-900 shadow-md shadow-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" /> Welcome back
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name} 👋
          </h1>
          
<p className="text-sm sm:text-base !text-slate-900 mt-2 max-w-xl leading-relaxed">
  Explore verified social-service events, verify your availability, and let AI highlight matches for your skills.
</p>

        </div>
        <Link
          to="/opportunities"
          className="self-start sm:self-center px-4 py-2.5 bg-white text-primary hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Find Opportunities</span>
        </Link>
      </div>

      {/* Friendly Profile Completion Prompt */}
      {isProfileIncomplete && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-900">
                Complete your volunteer profile to receive better event recommendations
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
                Add your skills, volunteering interests, and availability so organizations and our AI can find you.
              </p>
            </div>
          </div>
          <Link
            to="/complete-profile"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Application & Event Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Applications Submitted</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.myApplications ?? 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Review</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.pendingApplications ?? 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Selected Events</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.selectedEvents ?? 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Not Selected</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.notSelectedEvents ?? 0}</h3>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Opportunities & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Opportunities (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Recommended Opportunities</span>
              </h2>
              <p className="text-xs text-slate-500">Curated causes matching your skills and location</p>
            </div>
            <Link
              to="/opportunities"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>

        {/* Recent Applications (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
            <Link
              to="/volunteer/applications"
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 divide-y divide-slate-100 shadow-xs">
            {recentApplications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                You haven't applied to any events yet.
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{app.eventTitle}</h4>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {app.eventDate}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400" /> {app.eventLocation}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
            <p className="font-semibold text-primary mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Important Rule:
            </p>
            When selected for an event, make sure to attend on time to be eligible for your verified completion certificate!
          </div>
        </div>
      </div>
    </div>
  );
}
