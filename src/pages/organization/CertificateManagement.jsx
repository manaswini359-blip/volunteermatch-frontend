import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import { attendanceService } from '../../services/attendanceService';
import { certificateService } from '../../services/certificateService';
import CertificateModal from '../../components/CertificateModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Award, CheckCircle2, ShieldCheck, Eye, PlusCircle, AlertCircle } from 'lucide-react';

export default function CertificateManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [attendees, setAttendees] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuingId, setIssuingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewCert, setPreviewCert] = useState(null);

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
      const [atts, certs] = await Promise.all([
        attendanceService.getEventAttendance(eventId),
        certificateService.getEventCertificates(eventId)
      ]);

      // Only PRESENT volunteers are eligible
      const presentAttendees = atts.filter((a) => a.status === 'PRESENT');
      setAttendees(presentAttendees);
      setCertificates(certs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      loadData(selectedEventId);
    }
  }, [selectedEventId]);

  const handleIssueCertificate = async (volunteerId) => {
    setIssuingId(volunteerId);
    setMessage('');
    setError('');

    try {
      const cert = await certificateService.issueCertificate(
        parseInt(selectedEventId, 10),
        volunteerId
      );

      setMessage(`Certificate ${cert.certificateId} issued successfully! Volunteer received an in-app notice.`);
      await loadData(selectedEventId);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to issue certificate.');
    } finally {
      setIssuingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading certificate console..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Certificate Issuance & Verification</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue official digital certificates of appreciation to verified attendees.
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

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
        <p className="font-bold text-amber-800 mb-0.5">Rule 9 Compliance Notice:</p>
        Per project governance standards, certificates can strictly be issued only to participants whose attendance has been officially marked as <strong>PRESENT</strong>.
      </div>

      {attendees.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Verified Attendees Available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Mark participant attendance as PRESENT in the Attendance tab first to make them eligible for certificates.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4">Certificate Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {attendees.map((att) => {
                  const cert = certificates.find((c) => c.volunteerId === att.volunteerId);
                  const isIssued = Boolean(cert);

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {att.volunteerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {att.volunteerEmail}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isIssued ? (
                          <span className="font-mono text-[11px] font-semibold text-primary bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {cert.certificateId}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Ready to issue</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isIssued ? (
                          <button
                            type="button"
                            onClick={() => setPreviewCert(cert)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={issuingId === att.volunteerId}
                            onClick={() => handleIssueCertificate(att.volunteerId)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-2xs transition-colors disabled:opacity-60"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{issuingId === att.volunteerId ? 'Issuing...' : 'Issue Certificate'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Certificate Modal */}
      {previewCert && (
        <CertificateModal
          certificate={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </div>
  );
}
