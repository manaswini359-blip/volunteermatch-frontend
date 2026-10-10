import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { applicationService } from '../../services/applicationService';
import { volunteerService } from '../../services/volunteerService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Sparkles,
  ArrowLeft,
  Send,
  HelpCircle
} from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isVolunteer } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Application form states
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [motivationMessage, setMotivationMessage] = useState('');
  const [preferredRole, setPreferredRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [availabilityChoice, setAvailabilityChoice] = useState('FULL'); // 'FULL', 'PARTIAL', 'NO'
  const [partialTimeRange, setPartialTimeRange] = useState('');
  const [willingOtherTasks, setWillingOtherTasks] = useState(true);

  const fetchEvent = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
      if (data.tasks && data.tasks.length > 0) {
        setPreferredRole(data.tasks[0]);
      } else {
        setPreferredRole('General Event Volunteer');
      }
    } catch (err) {
      console.error(err);
      setError('Could not load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();

    if (isVolunteer) {
      volunteerService.getMyProfile()
        .then((p) => {
          setVolunteerProfile(p);
          if (p?.skills) {
            const list = p.skills.split(',').map((s) => s.trim()).filter(Boolean);
            setSelectedSkills(list);
          }
        })
        .catch((err) => console.error('Could not load profile skills:', err));
    }
  }, [id, isVolunteer]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = customSkillInput.trim();
      if (val && !selectedSkills.includes(val)) {
        setSelectedSkills([...selectedSkills, val]);
        setCustomSkillInput('');
      }
    }
  };

  const handleApply = async () => {
    if (availabilityChoice === 'NO') {
      setError('You cannot apply if you are not available for this event.');
      return;
    }

    if (availabilityChoice === 'PARTIAL' && !partialTimeRange.trim()) {
      setError('Please specify your available time range for partial attendance (e.g. 10:00 AM - 1:00 PM).');
      return;
    }

    setApplying(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        availabilityConfirmed: true,
        availabilityType: availabilityChoice,
        partialTimeRange: availabilityChoice === 'PARTIAL' ? partialTimeRange.trim() : null,
        preferredTask: preferredRole || 'General Event Volunteer',
        relevantSkills: selectedSkills.length > 0 ? selectedSkills.join(', ') : null,
        willingOtherTasks,
        motivationMessage: motivationMessage.trim() || null
      };

      await applicationService.applyForEvent(event.id, payload);
      setMessage('Your application has been submitted successfully! The organization will review your profile.');
      await fetchEvent();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-800">Event Not Found</h3>
        <Link to="/opportunities" className="mt-4 inline-block text-xs font-bold text-primary">
          Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Event Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-linear-to-b from-indigo-50/40 to-white">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              {event.category || 'Community Service'}
            </span>
            {event.userHasApplied && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Your Status:</span>
                <StatusBadge status={event.userApplicationStatus} />
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {event.title}
          </h1>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 font-medium">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <span>Organized by <strong className="text-slate-800">{event.organizationName}</strong></span>
            {event.organizationLocation && (
              <span className="text-slate-400">({event.organizationLocation})</span>
            )}
          </div>
        </div>

        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Event Date
            </p>
            <p className="font-semibold text-slate-800">{event.eventDate}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Time
            </p>
            <p className="font-semibold text-slate-800">{event.startTime} - {event.endTime}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location
            </p>
            <p className="font-semibold text-slate-800 truncate" title={event.location}>{event.location}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" /> Volunteers
            </p>
            <p className="font-semibold text-slate-800">{event.selectedCount || 0} / {event.requiredVolunteers} selected</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">About This Initiative</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Required Skills & Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Required Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {event.requiredSkills && event.requiredSkills.length > 0 ? (
                  event.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-xs">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Open to all enthusiastic volunteers</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Operational Tasks & Roles
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {event.tasks && event.tasks.length > 0 ? (
                  event.tasks.map((task, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-lg text-xs">
                      {task}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">General logistics & on-site assistance</span>
                )}
              </div>
            </div>
          </div>

          {/* APPLICATION SECTION WITH AVAILABILITY LOGIC */}
          <div className="pt-6 border-t border-slate-100">
            {event.userHasApplied ? (
              <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Application Submitted</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Your availability was confirmed. The organization will review your profile. You can track this in "My Applications".
                  </p>
                </div>
                <Link
                  to="/volunteer/applications"
                  className="px-4 py-2 bg-white text-primary hover:bg-slate-50 border border-indigo-200 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  View My Applications
                </Link>
              </div>
            ) : !user ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <p className="text-xs text-slate-600 mb-3">
                  Please log in as a volunteer to confirm your availability and apply for this event.
                </p>
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-block"
                >
                  Log In to Apply
                </Link>
              </div>
            ) : !isVolunteer ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                You are logged in as an Organization account. Only volunteers can apply for events.
              </div>
            ) : (
              <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/90 space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" /> Apply for this Event
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your preferred role, confirm availability, and submit your application for organization review.
                  </p>
                </div>

                {/* 1. Role or Activity Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Which role or activity would you like to participate in?
                  </label>
                  {event.tasks && event.tasks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.tasks.map((task) => (
                        <button
                          key={task}
                          type="button"
                          onClick={() => setPreferredRole(task)}
                          className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            preferredRole === task
                              ? 'bg-indigo-50/80 border-primary text-primary ring-1 ring-primary'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{task}</span>
                            {preferredRole === task && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPreferredRole('Open to Any Role / General Assistance')}
                        className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          preferredRole === 'Open to Any Role / General Assistance'
                            ? 'bg-indigo-50/80 border-primary text-primary ring-1 ring-primary'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Open to Any Role / General Assistance</span>
                          {preferredRole === 'Open to Any Role / General Assistance' && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                      General Event Volunteer Support
                    </div>
                  )}
                </div>

                {/* 2. Relevant Skills */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                    <span>Relevant Skills for this Event</span>
                    <span className="text-[11px] text-slate-400 font-normal">Click to toggle skills from your profile</span>
                  </label>
                  {volunteerProfile?.skills && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {volunteerProfile.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={handleAddCustomSkill}
                      placeholder="Add another relevant skill..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[11px] text-slate-500 font-medium py-1">Will be submitted:</span>
                      {selectedSkills.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-primary font-bold text-xs rounded-lg">
                          {s}
                          <button type="button" onClick={() => toggleSkill(s)} className="text-indigo-400 hover:text-rose-600">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Motivation / Why interested */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                    <span>Why are you interested in this event?</span>
                    <span className="text-[11px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <textarea
                    rows={2}
                    value={motivationMessage}
                    onChange={(e) => setMotivationMessage(e.target.value)}
                    placeholder="Briefly share why you want to volunteer for this cause or any relevant background..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
                  />
                </div>

                {/* 4. Availability for this Event */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Confirm Availability for Event Date & Time
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Event Date: <strong className="text-slate-700">{event.eventDate}</strong> | Time: <strong className="text-slate-700">{event.startTime} - {event.endTime}</strong>
                  </p>

                  <div className="space-y-2">
                    <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      availabilityChoice === 'FULL'
                        ? 'bg-emerald-50/60 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="avail"
                        checked={availabilityChoice === 'FULL'}
                        onChange={() => setAvailabilityChoice('FULL')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold">
                        Yes, I am fully available for the entire event duration ({event.startTime} - {event.endTime})
                      </span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      availabilityChoice === 'PARTIAL'
                        ? 'bg-amber-50/60 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="avail"
                        checked={availabilityChoice === 'PARTIAL'}
                        onChange={() => setAvailabilityChoice('PARTIAL')}
                        className="text-amber-600 focus:ring-amber-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-semibold block">
                          I am available for part of the event
                        </span>
                        {availabilityChoice === 'PARTIAL' && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={partialTimeRange}
                              onChange={(e) => setPartialTimeRange(e.target.value)}
                              placeholder="e.g. 10:00 AM - 1:00 PM"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      availabilityChoice === 'NO'
                        ? 'bg-rose-50/60 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="avail"
                        checked={availabilityChoice === 'NO'}
                        onChange={() => setAvailabilityChoice('NO')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-xs font-semibold">
                        No, I am not available
                      </span>
                    </label>
                  </div>

                  {availabilityChoice === 'NO' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>You cannot apply if you are not available for this event.</span>
                    </div>
                  )}
                </div>

                {/* Willing to assist other tasks */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="willingOther"
                    checked={willingOtherTasks}
                    onChange={(e) => setWillingOtherTasks(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <label htmlFor="willingOther" className="text-xs text-slate-700 font-medium">
                    Willing to assist with other tasks if needed
                  </label>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {message && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={applying || availabilityChoice === 'NO'}
                    onClick={handleApply}
                    className="w-full py-3 px-6 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{applying ? 'Submitting Application...' : 'Submit Application (Pending Review)'}</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Your preferred role, relevant skills, and availability will be reviewed by the event organizers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
