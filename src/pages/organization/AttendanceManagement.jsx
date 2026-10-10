import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import { applicationService } from '../../services/applicationService';
import { attendanceService } from '../../services/attendanceService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { UserCheck, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function AttendanceManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const loadData = async (eventId) => {
    if (!eventId) return;
    try {
      const [apps, atts] = await Promise.all([
        applicationService.getApplicationsByEvent(eventId),
        attendanceService.getEventAttendance(eventId)
      ]);

      // Only volunteers with application status SELECTED can be marked for attendance
      const selected = apps.filter((a) => a.status === 'SELECTED');
      setSelectedVolunteers(selected);
      setAttendanceRecords(atts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      loadData(selectedEventId);
    }
  }, [selectedEventId]);

  const handleMarkAttendance = async (volunteerId, status) => {
    setActionLoading(true);
    setMessage('');
    try {
      await attendanceService.markAttendance(parseInt(selectedEventId, 10), volunteerId, status);
      setMessage(`Marked volunteer as ${status}. Notification sent.`);
      await loadData(selectedEventId);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Could not update attendance.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading attendance console..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            <span>Attendance Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark on-site presence. Note: Application status (SELECTED) and attendance (PRESENT/ABSENT) remain independent.
          </p>
        </div>

        {events.length > 0 && (
          <div className="w-full sm:w-80">
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSearchParams({ eventId: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary shadow-xs text-slate-800"
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

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Principle Reminder Box */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
        <p className="font-bold text-primary mb-0.5">Rule 4 & 9 Architectural Notice:</p>
        Marking a volunteer as Absent will not cancel their selected application status. Volunteers marked as <strong>PRESENT</strong> will automatically qualify for Certificate of Appreciation issuance in the Certificates tab.
      </div>

      {selectedVolunteers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Selected Volunteers to Check-in</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Select volunteers for this event first via Applications or AI Recommendations before marking attendance.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Contact Email</th>
                  <th className="py-3 px-4">Application Status</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4 text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {selectedVolunteers.map((vol) => {
                  const att = attendanceRecords.find((a) => a.volunteerId === vol.volunteerId);
                  const isPresent = att?.status === 'PRESENT';
                  const isAbsent = att?.status === 'ABSENT';

                  return (
                    <tr key={vol.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {vol.volunteerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {vol.volunteerEmail}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status="SELECTED" />
                      </td>
                      <td className="py-3.5 px-4">
                        {att ? (
                          <StatusBadge status={att.status} />
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Not recorded yet</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleMarkAttendance(vol.volunteerId, 'PRESENT')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleMarkAttendance(vol.volunteerId, 'ABSENT')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                              isAbsent
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
