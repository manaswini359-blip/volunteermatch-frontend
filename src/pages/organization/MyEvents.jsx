import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  CalendarDays,
  Sparkles,
  ClipboardList,
  ListTodo,
  UserCheck,
  Award,
  Calendar,
  MapPin,
  Users,
  PlusCircle,
  Trash2
} from 'lucide-react';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const org = await organizationService.getMyProfile();
      const list = await eventService.getOrgEvents(org.id);
      setEvents(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await eventService.deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert('Could not delete event.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading created events..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            <span>My Created Events</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your social initiatives, review candidate applications, and trigger AI matching.
          </p>
        </div>
        <Link
          to="/organization/create-event"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Event</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Events Created</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Publish your first volunteer initiative to find passionate candidates using our AI matching system.
          </p>
          <Link
            to="/organization/create-event"
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl inline-block"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                  <StatusBadge status={evt.status} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.eventDate} ({evt.startTime} - {evt.endTime})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{evt.selectedCount || 0} selected / {evt.totalApplications || 0} applied (Target: {evt.requiredVolunteers})</span>
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <Link
                  to={`/organization/ai-recommendations?eventId=${evt.id}`}
                  className="px-3 py-1.5 text-xs font-bold text-primary bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1"
                  title="View AI Recommended Volunteers"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Recommendations</span>
                </Link>

                <Link
                  to={`/organization/applications?eventId=${evt.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Applications ({evt.totalApplications || 0})</span>
                </Link>

                <Link
                  to={`/organization/tasks?eventId=${evt.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>Tasks</span>
                </Link>

                <Link
                  to={`/organization/attendance?eventId=${evt.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Attendance</span>
                </Link>

                <Link
                  to={`/organization/certificates?eventId=${evt.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificates</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(evt.id, evt.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
