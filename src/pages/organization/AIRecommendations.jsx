import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import { aiService } from '../../services/aiService';
import { applicationService } from '../../services/applicationService';
import VolunteerCard from '../../components/VolunteerCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Sparkles, ShieldCheck, AlertCircle, Calendar, CheckCircle2, SlidersHorizontal, MapPin } from 'lucide-react';

export default function AIRecommendations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    const fetchOrgEvents = async () => {
      try {
        const org = await organizationService.getMyProfile();
        const list = await eventService.getOrgEvents(org.id);
        setEvents(list);

        if (list.length > 0) {
          const defaultId = eventIdParam || list[0].id.toString();
          setSelectedEventId(defaultId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgEvents();
  }, []);

  const fetchRecommendations = async (eventId) => {
    if (!eventId) return;
    setLoading(true);
    setNotificationMsg('');
    try {
      const [eventDetails, recs] = await Promise.all([
        eventService.getEventById(eventId),
        aiService.getRecommendations(eventId)
      ]);

      setCurrentEvent(eventDetails);
      setRecommendations(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchRecommendations(selectedEventId);
    }
  }, [selectedEventId]);

  const handleSelect = async (rec) => {
    if (!rec.applicationId || rec.applicationStatus !== 'PENDING') {
      alert(`Cannot select ${rec.volunteerName}: Only volunteers who have applied for this event can be selected.`);
      return;
    }
    setActionLoading(true);
    try {
      await applicationService.updateStatus(rec.applicationId, 'SELECTED');

      setRecommendations((prev) =>
        prev.map((r) =>
          r.volunteerId === rec.volunteerId
            ? { ...r, applicationStatus: 'SELECTED' }
            : r
        )
      );

      setNotificationMsg(`Selected ${rec.volunteerName}! Volunteer application marked as Selected.`);
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Could not select volunteer: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (rec) => {
    if (!rec.applicationId || rec.applicationStatus !== 'PENDING') {
      alert(`Cannot reject ${rec.volunteerName}: Volunteer does not have a pending application.`);
      return;
    }
    setActionLoading(true);
    try {
      await applicationService.updateStatus(rec.applicationId, 'REJECTED');
      setRecommendations((prev) =>
        prev.map((r) =>
          r.volunteerId === rec.volunteerId
            ? { ...r, applicationStatus: 'REJECTED' }
            : r
        )
      );
      setNotificationMsg(`Marked ${rec.volunteerName} as Not Selected.`);
      setTimeout(() => setNotificationMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Could not update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && events.length === 0) {
    return <LoadingSpinner text="Loading AI recommendation engine..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Volunteer Matching Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            AI Recommended Volunteers
          </h1>
          <p className="text-xs text-slate-500">
            Compare event requirements against volunteer skills, interests, and availability.
          </p>
        </div>

        {/* Event Dropdown */}
        {events.length > 0 && (
          <div className="w-full sm:w-80">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Event to Match:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSearchParams({ eventId: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 shadow-xs"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.eventDate})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {notificationMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Mandatory Human In The Loop Principle Banner */}
      <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/80 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900">
            AI Recommendation – Final selection is made by the organization.
          </p>
          <p className="text-slate-600 mt-0.5">
            The AI match score is an advisory aid based on skill overlap, interest alignment, and location. It never automatically assigns candidates. Review the rationale below and click <strong>Select</strong> or <strong>Not Select</strong> to decide.
          </p>
        </div>
      </div>

      {/* Event AI Structured Requirements Analysis Box */}
      {currentEvent && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {currentEvent.category}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{currentEvent.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {currentEvent.eventDate} ({currentEvent.startTime} - {currentEvent.endTime})
                <span>•</span>
                <MapPin className="w-3 h-3" /> {currentEvent.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {currentEvent.selectedCount || 0} / {currentEvent.requiredVolunteers} Volunteers Selected
              </span>
            </div>
          </div>

          {/* AI Extracted Skills & Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2 text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Extracted Required Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentEvent.requiredSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 font-semibold rounded-lg text-xs shadow-2xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2 text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Operational Roles & Tasks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentEvent.tasks?.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 font-medium rounded-lg text-xs shadow-2xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Volunteer Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Ranked Candidates</span>
            <span className="text-xs font-normal text-slate-500">
              ({recommendations.length} potential matches evaluated)
            </span>
          </h3>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">No volunteer profiles found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((vol) => (
              <VolunteerCard
                key={vol.volunteerId}
                volunteer={vol}
                onSelect={handleSelect}
                onReject={handleReject}
                actionLoading={actionLoading}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
