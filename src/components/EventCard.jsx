import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function EventCard({ event, showApply = true }) {
  if (!event) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Banner & Category */}
      <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <span className="inline-block text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-2">
            {event.category || 'Community Service'}
          </span>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            By <span className="text-slate-700 font-semibold">{event.organizationName}</span>
          </p>
        </div>
        {event.userHasApplied && (
          <StatusBadge status={event.userApplicationStatus || 'APPLIED'} />
        )}
      </div>

      {/* Description */}
      <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Meta details */}
        <div className="space-y-2 mb-4 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.eventDate}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {event.selectedCount || 0} / {event.requiredVolunteers || 10} volunteers selected
            </span>
          </div>
        </div>

        {/* Skills Required */}
        {event.requiredSkills && event.requiredSkills.length > 0 && (
          <div className="pt-3 border-t border-slate-100 mb-4">
            <p className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {event.requiredSkills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
              {event.requiredSkills.length > 3 && (
                <span className="px-1.5 py-0.5 text-slate-400 text-[10px] font-medium">
                  +{event.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        <Link
          to={`/events/${event.id}`}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-primary text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-200 hover:border-primary shadow-xs"
        >
          <span>View Details & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
