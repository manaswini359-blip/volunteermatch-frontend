import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { attendanceService } from '../../services/attendanceService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { UserCheck, Calendar, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const profile = await volunteerService.getMyProfile();
        const list = await attendanceService.getVolunteerAttendance(profile.id);
        setRecords(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading attendance records..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-primary" />
          <span>My Attendance Records</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official attendance recorded on-site by event organizers.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Attendance Records Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you attend an event and the organization records your check-in, your official attendance will be displayed here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {records.map((att) => (
            <div key={att.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{att.eventTitle}</h3>
                  <StatusBadge status={att.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recorded: {att.checkInTime ? new Date(att.checkInTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'On event day'}</span>
                  </span>
                </div>
              </div>

              <div>
                {att.status === 'PRESENT' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Eligible for Certificate
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
                    <ShieldAlert className="w-4 h-4" /> Not Attended
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
