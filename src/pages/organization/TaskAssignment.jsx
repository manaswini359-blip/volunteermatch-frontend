import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { eventService } from '../../services/eventService';
import { applicationService } from '../../services/applicationService';
import { taskService } from '../../services/taskService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ListTodo, CheckCircle2, User, Plus, Calendar, AlertCircle } from 'lucide-react';

export default function TaskAssignment() {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [eventTasks, setEventTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [targetVolunteerId, setTargetVolunteerId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const loadEventData = async (eventId) => {
    if (!eventId) return;
    try {
      const [evt, apps, tasks] = await Promise.all([
        eventService.getEventById(eventId),
        applicationService.getApplicationsByEvent(eventId),
        taskService.getEventTasks(eventId)
      ]);

      setCurrentEvent(evt);
      // RULE 8: Only SELECTED volunteers can receive task assignments
      const approved = apps.filter((a) => a.status === 'SELECTED');
      setSelectedVolunteers(approved);
      if (approved.length > 0) {
        setTargetVolunteerId(approved[0].volunteerId.toString());
      } else {
        setTargetVolunteerId('');
      }
      setEventTasks(tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      loadEventData(selectedEventId);
    }
  }, [selectedEventId]);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!targetVolunteerId || !taskName.trim()) {
      setError('Please select an approved volunteer and enter a task name.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await taskService.assignTask(
        parseInt(selectedEventId, 10),
        parseInt(targetVolunteerId, 10),
        taskName.trim()
      );

      setMessage(`Task "${taskName}" assigned successfully! Volunteer received a notification.`);
      setTaskName('');
      await loadEventData(selectedEventId);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to assign task.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading task management..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-primary" />
            <span>Task Assignment & Role Delegation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign specific roles and operational stations to your officially selected volunteers.
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

      {/* Task Assignment Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          <span>Assign New Task</span>
        </h3>

        {selectedVolunteers.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No volunteers have been selected for this event yet. Review applications or AI recommendations to select volunteers before assigning tasks.
          </div>
        ) : (
          <form onSubmit={handleAssignTask} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Approved Volunteer (RULE 8: Selected Only)
              </label>
              <select
                value={targetVolunteerId}
                onChange={(e) => setTargetVolunteerId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary text-slate-800"
              >
                {selectedVolunteers.map((vol) => (
                  <option key={vol.volunteerId} value={vol.volunteerId}>
                    {vol.volunteerName} ({vol.volunteerEmail})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Task Name / Responsibility
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Registration Desk, Donor Intake, Line Management"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <span>{submitting ? 'Assigning...' : 'Assign'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Quick Task Presets based on event tasks */}
        {currentEvent?.tasks && currentEvent.tasks.length > 0 && (
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 font-semibold">Suggested from event tasks:</span>
            {currentEvent.tasks.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTaskName(t)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-primary text-slate-700 rounded-md text-[11px] font-medium transition-colors"
              >
                + {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Currently Assigned Tasks Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Currently Assigned Tasks ({eventTasks.length})
        </h3>

        {eventTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No tasks assigned for this event yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Volunteer</th>
                    <th className="py-3 px-4">Task Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {eventTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {task.volunteerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {task.taskName}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {task.assignedAt ? new Date(task.assignedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
