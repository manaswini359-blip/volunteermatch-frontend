import React from 'react';
import MatchScore from './MatchScore';
import StatusBadge from './StatusBadge';
import { Sparkles, MapPin, Clock, Check, X, User } from 'lucide-react';

export default function VolunteerCard({
  volunteer,
  onSelect,
  onReject,
  showActions = true,
  actionLoading = false
}) {
  if (!volunteer) return null;

  const skillsList = volunteer.skills
    ? volunteer.skills.split(',').map(s => s.trim())
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700 font-bold shrink-0">
              {volunteer.profileImage ? (
                <img src={volunteer.profileImage} alt={volunteer.volunteerName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{volunteer.volunteerName}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{volunteer.location || 'Location not specified'}</span>
              </p>
            </div>
          </div>
          <MatchScore score={volunteer.matchScore} size="sm" />
        </div>

        {/* Bio */}
        {volunteer.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 italic mb-3">
            "{volunteer.bio}"
          </p>
        )}

        {/* AI Recommendation Reason */}
        {volunteer.reason && (
          <div className="mb-3 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary mb-1">
              <Sparkles className="w-3 h-3" /> Why Recommended
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {volunteer.reason}
            </p>
          </div>
        )}

        {/* Availability */}
        {volunteer.availability && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>General: <strong className="text-slate-700">{volunteer.availability}</strong></span>
          </div>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Volunteer Skills</p>
            <div className="flex flex-wrap gap-1">
              {skillsList.slice(0, 4).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                  {skill}
                </span>
              ))}
              {skillsList.length > 4 && (
                <span className="text-[10px] text-slate-400 px-1 py-0.5">
                  +{skillsList.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-xs">
          {volunteer.applicationStatus && volunteer.applicationStatus !== 'NOT_APPLIED' ? (
            <StatusBadge status={volunteer.applicationStatus} />
          ) : (
            <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Not Applied
            </span>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            {volunteer.applicationId && volunteer.applicationStatus === 'PENDING' ? (
              <>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => onReject && onReject(volunteer)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Do not select this candidate"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => onSelect && onSelect(volunteer)}
                  className="px-3 py-1 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Select volunteer for this event"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Select</span>
                </button>
              </>
            ) : volunteer.applicationStatus === 'SELECTED' ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ✓ Selected
              </span>
            ) : volunteer.applicationStatus === 'REJECTED' ? (
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                Not Selected
              </span>
            ) : (
              <button
                type="button"
                disabled={true}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed"
                title="Cannot select: Volunteer has not applied for this event"
              >
                Cannot select: Not applied
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
