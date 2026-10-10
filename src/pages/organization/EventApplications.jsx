import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/StatusBadge';
import MatchScore from '../../components/MatchScore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ClipboardList, Check, X, User, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export default function EventApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedVolunteerModal, setSelectedVolunteerModal] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const org = await organizationService.getMyProfile();
        const orgEvents = await eventService.getOrgEvents(org.id);
        setEvents(orgEvents);

        if (!selectedEventId && orgEvents.length > 0) {
          setSelectedEventId(orgEvents[0].id.toString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fetchApplications = async (eventId) => {
    if (!eventId) return;
    try {
      const data = await applicationService.getApplicationsByEvent(eventId);
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchApplications(selectedEventId);
    }
  }, [selectedEventId]);

  const handleStatusUpdate = async (applicationId, status) => {
    setActionLoading(true);
    try {
      await applicationService.updateStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
      alert('Could not update application status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading applications..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <span>Volunteer Applications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review candidate profiles, verify confirmed availability, and make your final selection decisions.
          </p>
        </div>

        {/* Event Selector */}
        {events.length > 0 && (
          <div className="w-full sm:w-72">
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

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Applications Received</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No volunteers have submitted applications for this event yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Volunteer</th>
                  <th className="py-3.5 px-4">Role Preference</th>
                  <th className="py-3.5 px-4">Skills & Interests</th>
                  <th className="py-3.5 px-4">Event Availability</th>
                  <th className="py-3.5 px-4">AI Match</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Decide & Act</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Volunteer info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                          {app.volunteerImage ? (
                            <img src={app.volunteerImage} alt={app.volunteerName} className="w-full h-full object-cover" />
                          ) : (
                            app.volunteerName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.volunteerName}</p>
                          <p className="text-[11px] text-slate-500">{app.volunteerEmail}</p>
                          {app.volunteerExperienceLevel && (
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                              {app.volunteerExperienceLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role preference */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded-lg text-xs">
                        {app.preferredTask || 'General Volunteer'}
                      </span>
                      {app.motivationMessage && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic" title={app.motivationMessage}>
                          "{app.motivationMessage}"
                        </p>
                      )}
                    </td>

                    {/* Skills */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-800 font-medium truncate" title={app.relevantSkills || app.volunteerSkills}>
                        {app.relevantSkills ? (
                          <span className="text-primary font-bold">{app.relevantSkills}</span>
                        ) : (
                          app.volunteerSkills || 'None listed'
                        )}
                      </p>
                      {app.volunteerInterests && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5" title={app.volunteerInterests}>
                          Interests: {app.volunteerInterests}
                        </p>
                      )}
                    </td>

                    {/* Actual Availability Confirmation */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {app.availabilityType === 'PARTIAL' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Partial: {app.partialTimeRange || 'Part time'}
                          </span>
                        </div>
                      ) : app.availabilityConfirmed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Full Event Confirmed
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unconfirmed</span>
                      )}
                    </td>

                    {/* Match Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <MatchScore score={app.matchScore} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedVolunteerModal(app)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-primary bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Details
                        </button>

                        {app.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(app.id, 'SELECTED')}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                              title="Select volunteer"
                            >
                              <Check className="w-3 h-3" /> Select
                            </button>

                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                              title="Reject application"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Volunteer Profile Quick Modal */}
      {selectedVolunteerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-base text-slate-700">
                  {selectedVolunteerModal.volunteerImage ? (
                    <img src={selectedVolunteerModal.volunteerImage} alt={selectedVolunteerModal.volunteerName} className="w-full h-full object-cover" />
                  ) : (
                    selectedVolunteerModal.volunteerName.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedVolunteerModal.volunteerName}</h3>
                  <p className="text-xs text-slate-500">{selectedVolunteerModal.volunteerEmail}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> {selectedVolunteerModal.volunteerLocation || 'Location not specified'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVolunteerModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Application specific details */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs space-y-2">
              <div>
                <strong className="text-primary font-bold">Selected Role / Activity: </strong>
                <span className="font-semibold text-slate-800">{selectedVolunteerModal.preferredTask || 'General Volunteer'}</span>
              </div>
              {selectedVolunteerModal.motivationMessage && (
                <div>
                  <strong className="text-slate-700 font-bold">Interest / Motivation: </strong>
                  <span className="italic text-slate-700">"{selectedVolunteerModal.motivationMessage}"</span>
                </div>
              )}
              <div>
                <strong className="text-slate-700 font-bold">Event Availability: </strong>
                <span>
                  {selectedVolunteerModal.availabilityType === 'PARTIAL'
                    ? `Partial (${selectedVolunteerModal.partialTimeRange})`
                    : 'Full event duration confirmed'}
                </span>
              </div>
              {selectedVolunteerModal.relevantSkills && (
                <div>
                  <strong className="text-slate-700 font-bold">Relevant Skills for Event: </strong>
                  <span>{selectedVolunteerModal.relevantSkills}</span>
                </div>
              )}
            </div>

            {/* Profile details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p className="text-slate-700 italic">"{selectedVolunteerModal.volunteerBio || 'No short bio provided'}"</p>
              <div>
                <strong className="text-slate-800">Profile Skills: </strong> {selectedVolunteerModal.volunteerSkills || 'None listed'}
              </div>
              <div>
                <strong className="text-slate-800">Interests: </strong> {selectedVolunteerModal.volunteerInterests || 'None listed'}
              </div>
              {selectedVolunteerModal.volunteerExperience && (
                <div>
                  <strong className="text-slate-800">Previous Experience: </strong> {selectedVolunteerModal.volunteerExperience}
                </div>
              )}
              <div>
                <strong className="text-slate-800">Experience Level: </strong> {selectedVolunteerModal.volunteerExperienceLevel || 'Beginner'}
              </div>
            </div>

            {selectedVolunteerModal.matchReason && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-slate-700">
                <span className="font-bold text-primary block mb-1">AI Recommendation Analysis:</span>
                {selectedVolunteerModal.matchReason}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <div className="flex gap-2">
                {selectedVolunteerModal.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={async () => {
                        await handleStatusUpdate(selectedVolunteerModal.id, 'SELECTED');
                        setSelectedVolunteerModal(null);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      Select Volunteer
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={async () => {
                        await handleStatusUpdate(selectedVolunteerModal.id, 'REJECTED');
                        setSelectedVolunteerModal(null);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedVolunteerModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
