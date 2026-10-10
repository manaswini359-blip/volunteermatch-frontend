import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { applicationService } from '../../services/applicationService';
import { attendanceService } from '../../services/attendanceService';
import { certificateService } from '../../services/certificateService';
import { taskService } from '../../services/taskService';
import CertificateModal from '../../components/CertificateModal';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { History, Award, CheckCircle2, Calendar, Building2, UserCheck, Eye } from 'lucide-react';

export default function VolunteerHistory() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const profile = await volunteerService.getMyProfile();
        const [apps, atts, certs, tasks] = await Promise.all([
          applicationService.getApplicationsByVolunteer(profile.id),
          attendanceService.getVolunteerAttendance(profile.id),
          certificateService.getVolunteerCertificates(profile.id),
          taskService.getVolunteerTasks(profile.id)
        ]);

        // Merge history for all applied/completed events
        const items = apps.map((app) => {
          const attendance = atts.find((a) => a.eventId === app.eventId);
          const certificate = certs.find((c) => c.eventId === app.eventId);
          const task = tasks.find((t) => t.eventId === app.eventId);

          return {
            id: app.id,
            eventId: app.eventId,
            eventTitle: app.eventTitle,
            organizationName: app.organizationName,
            eventDate: app.eventDate,
            applicationStatus: app.status,
            attendanceStatus: attendance ? attendance.status : (app.status === 'SELECTED' ? 'Scheduled' : 'N/A'),
            role: task ? task.taskName : (app.status === 'SELECTED' ? 'Event Volunteer' : 'Applicant'),
            certificate: certificate || null,
          };
        });

        setHistoryItems(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling your volunteer history..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          <span>Volunteer History & Impact Portfolio</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive historical log of your participation, attendance status, assigned roles, and certificates.
        </p>
      </div>

      {historyItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No History Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you apply for and participate in social service events, your verified track record will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                      {item.eventTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.organizationName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {item.eventDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.role}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.attendanceStatus === 'PRESENT' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                        </span>
                      ) : item.attendanceStatus === 'ABSENT' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Absent
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">{item.attendanceStatus}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.certificate ? (
                        <button
                          type="button"
                          onClick={() => setActiveCert(item.certificate)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-primary bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>View Certificate</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">Not issued</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {activeCert && (
        <CertificateModal
          certificate={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
}
