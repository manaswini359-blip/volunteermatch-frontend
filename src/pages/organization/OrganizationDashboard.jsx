import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import { applicationService } from '../../services/applicationService';
import { aiService } from '../../services/aiService';
import StatusBadge from '../../components/StatusBadge';
import MatchScore from '../../components/MatchScore';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Building2,
  CalendarDays,
  Activity,
  ClipboardList,
  UserCheck,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const orgProfile = await organizationService.getMyProfile();
        const [statsData, orgEvents, orgApps] = await Promise.all([
          organizationService.getDashboardStats(),
          eventService.getOrgEvents(orgProfile.id),
          applicationService.getApplicationsByOrganization(orgProfile.id)
        ]);

        setStats(statsData);
        setEvents(orgEvents);
        setRecentApplications(orgApps.slice(0, 5));

        if (orgEvents.length > 0) {
          const recs = await aiService.getRecommendations(orgEvents[0].id);
          setTopRecommendations(recs.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading organization dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-3xl text-slate-900 shadow-md shadow-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Organization Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Create events, review AI matching recommendations, approve applicants, and manage tasks and certificates.
          </p>
        </div>
        <Link
          to="/organization/create-event"
          className="self-start sm:self-center px-4 py-2.5 bg-white text-primary hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Event</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Events</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.totalEvents ?? 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Events</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.activeEvents ?? 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Applications</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.totalApplications ?? 0}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Selected Volunteers</p>
            <h3 className="text-xl font-extrabold text-slate-900">{stats?.selectedVolunteers ?? 0}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Events & AI Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upcoming Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Active Events</h2>
                <p className="text-xs text-slate-500">Initiatives you are currently organizing</p>
              </div>
              <Link
                to="/organization/events"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {events.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-3">You haven't posted any events yet.</p>
                <Link
                  to="/organization/create-event"
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl inline-block"
                >
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.slice(0, 2).map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {evt.category}
                        </span>
                        <StatusBadge status={evt.status} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                      <div className="mt-2 text-xs text-slate-500 space-y-1">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {evt.eventDate} ({evt.startTime})
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3" /> {evt.location}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-600">
                        {evt.selectedCount || 0} / {evt.requiredVolunteers} Selected
                      </span>
                      <Link
                        to={`/organization/ai-recommendations?eventId=${evt.id}`}
                        className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Recommendations →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Recommended Volunteers Preview */}
          {topRecommendations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>AI Recommended Volunteers Preview</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Highest scoring candidates for "{events[0]?.title}"
                  </p>
                </div>
                <Link
                  to={`/organization/ai-recommendations?eventId=${events[0]?.id}`}
                  className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
                >
                  <span>Review all candidates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topRecommendations.map((rec) => (
                  <div key={rec.volunteerId} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {rec.volunteerName.charAt(0)}
                        </div>
                        <MatchScore score={rec.matchScore} size="sm" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{rec.volunteerName}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{rec.location}</p>
                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 italic">
                        "{rec.reason}"
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 text-center">
                      <Link
                        to={`/organization/ai-recommendations?eventId=${events[0]?.id}`}
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        Review Profile & Decide →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Applications (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
            <Link
              to="/organization/applications"
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 divide-y divide-slate-100 shadow-xs">
            {recentApplications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent applications received yet.
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{app.volunteerName}</h4>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
                    Event: {app.eventTitle}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{app.volunteerSkills ? app.volunteerSkills.split(',')[0] : 'General skills'}</span>
                    <Link
                      to={`/organization/applications?eventId=${app.eventId}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Human in the loop badge */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Human-In-The-Loop Principal</span>
            </div>
            AI recommendation aids discovery by scoring skills & interests. Final volunteer selection is always made by your organization.
          </div>
        </div>
      </div>
    </div>
  );
}
