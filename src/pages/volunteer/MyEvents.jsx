import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CalendarCheck, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';

export default function MyEvents() {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelectedEvents = async () => {
      try {
        const profile = await volunteerService.getMyProfile();
        const apps = await applicationService.getApplicationsByVolunteer(profile.id);
        const filtered = apps.filter((a) => a.status === 'SELECTED');
        setSelectedEvents(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading selected events..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-primary" />
          <span>My Selected Events</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Events where the organization has officially selected you as a volunteer.
        </p>
      </div>

      {selectedEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Selected Events Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Once organizations review your applications and approve your participation, they will appear here.
          </p>
          <Link
            to="/opportunities"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors inline-block"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedEvents.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Official Participant
                  </span>
                  <StatusBadge status="SELECTED" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{app.eventTitle}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Organized by {app.organizationName}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.eventDate} ({app.eventTime})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{app.eventLocation}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/volunteer/tasks"
                  className="text-xs font-semibold text-primary hover:text-primary-hover"
                >
                  View Tasks →
                </Link>
                <Link
                  to={`/events/${app.eventId}`}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
