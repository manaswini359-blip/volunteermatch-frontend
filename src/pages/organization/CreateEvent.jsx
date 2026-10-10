import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { aiService } from '../../services/aiService';
import { Sparkles, Calendar, Clock, MapPin, Users, Tag, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CreateEvent() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Healthcare');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-20');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('01:00 PM');
  const [requiredVolunteers, setRequiredVolunteers] = useState(10);

  // AI Extracted tags
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [taskInput, setTaskInput] = useState('');

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Healthcare',
    'Environment',
    'Community Service',
    'Education',
    'Disaster Relief',
    'Animal Welfare',
    'Arts & Culture'
  ];

  const handleAiAnalyze = async () => {
    if (!description.trim()) {
      setError('Please enter an event description first so AI can extract required skills.');
      return;
    }

    setAiAnalyzing(true);
    setError('');
    setAiSummary('');

    try {
      const result = await aiService.analyzeEvent(title, description, category);
      if (result) {
        const extractedSkills = result.requiredSkills || [];
        const extractedTasks = result.tasks || [];

        if (extractedSkills.length === 0) {
          setError('AI could not identify specific skills from this description. Please mention clear volunteer activities or roles.');
          return;
        }

        setRequiredSkills(extractedSkills);
        setTasks(extractedTasks);
        setAiSummary(result.summary || `AI successfully extracted ${extractedSkills.length} required skills and ${extractedTasks.length} operational tasks.`);
      }
    } catch (err) {
      console.error('AI requirement analysis error:', err);
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || 'AI requirement analysis could not complete. You can still enter skills manually.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
        setRequiredSkills([...requiredSkills, skillInput.trim()]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
  };

  const handleAddTask = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (taskInput.trim() && !tasks.includes(taskInput.trim())) {
        setTasks([...tasks, taskInput.trim()]);
        setTaskInput('');
      }
    }
  };

  const handleRemoveTask = (taskToRemove) => {
    setTasks(tasks.filter(t => t !== taskToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let currentSkills = [...requiredSkills];
    let currentTasks = [...tasks];

    // Auto-extract with AI before submission if skills have not been extracted yet
    if (currentSkills.length === 0) {
      if (description.trim().length >= 5) {
        setAiAnalyzing(true);
        try {
          const result = await aiService.analyzeEvent(title, description, category);
          if (result && result.requiredSkills && result.requiredSkills.length > 0) {
            currentSkills = result.requiredSkills;
            currentTasks = currentTasks.length > 0 ? currentTasks : (result.tasks || []);
            setRequiredSkills(currentSkills);
            setTasks(currentTasks);
            if (result.summary) setAiSummary(result.summary);
          }
        } catch (err) {
          console.error('Auto AI analysis error during submit:', err);
          const serverMsg = err.response?.data?.message;
          setError(serverMsg || 'AI requirement extraction failed. Please check description or enter skills manually.');
          setAiAnalyzing(false);
          return;
        } finally {
          setAiAnalyzing(false);
        }
      }
    }

    if (currentSkills.length === 0) {
      setError('Please add or use AI to extract at least one required skill.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        category,
        location,
        eventDate,
        startTime,
        endTime,
        requiredVolunteers: parseInt(requiredVolunteers, 10),
        requiredSkills: currentSkills,
        tasks: currentTasks
      };

      const newEvent = await eventService.createEvent(payload);
      navigate(`/organization/ai-recommendations?eventId=${newEvent.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Volunteer Event</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your initiative details. Our AI will analyze the requirements to recommend matching volunteers.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Donation Camp / Tree Plantation Drive"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Natural Language Description & AI Trigger */}
        <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Event Description (Natural Language)
            </label>
            <button
              type="button"
              disabled={aiAnalyzing}
              onClick={handleAiAnalyze}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{aiAnalyzing ? 'Extracting with AI...' : 'Use AI to Extract'}</span>
            </button>
          </div>

          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              if (description.trim().length >= 10 && requiredSkills.length === 0 && !aiAnalyzing) {
                handleAiAnalyze();
              }
            }}
            placeholder="e.g. We are organizing a blood donation camp and need volunteers for registration, donor guidance and crowd management."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
          />

          {aiSummary && (
            <div className="p-3 bg-white rounded-xl border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary font-bold">AI Structured Requirements Extracted: </strong>
                {aiSummary}
              </div>
            </div>
          )}
        </div>

        {/* AI Extracted Skills */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Required Skills (AI Generated / Custom)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Press enter to add</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="e.g. Communication, Registration, Crowd Management"
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {requiredSkills.map((s, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-primary font-bold text-xs rounded-lg">
                {s}
                <button type="button" onClick={() => handleRemoveSkill(s)} className="text-indigo-400 hover:text-rose-600">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Operational Tasks */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Operational Tasks & Roles</span>
            <span className="text-[11px] text-slate-400 font-normal">Roles to assign to selected volunteers</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={handleAddTask}
              placeholder="e.g. Registration Desk, Donor Guidance, Line Management"
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tasks.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg">
                {t}
                <button type="button" onClick={() => handleRemoveTask(t)} className="text-slate-400 hover:text-rose-600">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Date, Time, Location & Volunteer headcount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
            <input
              type="text"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="09:00 AM"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
            <input
              type="text"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="01:00 PM"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Volunteers Needed</label>
            <input
              type="number"
              min="1"
              max="200"
              required
              value={requiredVolunteers}
              onChange={(e) => setRequiredVolunteers(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Location / Address</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Civic Community Hall, Dadar, Mumbai"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Publishing will automatically run AI volunteer matching for candidate review.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            <span>{submitting ? 'Creating Event...' : 'Publish Event & View AI Matches'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
