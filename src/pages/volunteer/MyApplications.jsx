import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { volunteerService } from '../../services/volunteerService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FileCheck2, Calendar, MapPin, Building2, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [confirmWithdrawModal, setConfirmWithdrawModal] = useState(null);

  const fetchApplications = async () => {
    try {
      const profile = await volunteerService.getMyProfile();
      const apps = await applicationService.getApplicationsByVolunteer(profile.id);
      setApplications(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    setWithdrawingId(applicationId);
    try {
      await applicationService.withdraw(applicationId);
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'WITHDRAWN' } : a))
      );
      setConfirmWithdrawModal(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Could not withdraw from event.');
    } finally {
      setWithdrawingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your applications..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-primary" />
          <span>My Applications</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track the status of all your submitted volunteer applications and manage your commitments.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Applications Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            You haven't applied to any community events yet. Discover available causes to get started!
          </p>
          <Link
            to="/opportunities"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors inline-block"
          >
            Find Opportunities
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {applications.map((app) => (
            <div key={app.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {app.eventTitle}
                  </h3>
                  <StatusBadge status={app.status} />
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-primary" /> {app.organizationName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.eventDate} ({app.eventTime})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.eventLocation}
                  </span>
                </div>

                {app.status === 'SELECTED' && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block font-semibold">
                    🎉 You have been selected! Check "My Tasks" to see your assigned operational responsibilities.
                  </p>
                )}
                {app.status === 'WITHDRAWN' && (
                  <p className="text-[11px] text-slate-500 italic">
                    You withdrew from this event. The organization has been notified.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <Link
                  to={`/events/${app.eventId}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-primary bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  View Event
                </Link>

                {/* Withdraw button for PENDING or SELECTED */}
                {(app.status === 'PENDING' || app.status === 'SELECTED') && (
                  <button
                    onClick={() => setConfirmWithdrawModal(app)}
                    disabled={withdrawingId === app.id}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Withdraw from "{confirmWithdrawModal.eventTitle}"?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              If your plans have changed and you are no longer available, withdrawing will notify the organization immediately so they can review alternative candidates.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmWithdrawModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Application
              </button>
              <button
                type="button"
                onClick={() => handleWithdraw(confirmWithdrawModal.id)}
                disabled={withdrawingId !== null}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                {withdrawingId ? 'Withdrawing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
