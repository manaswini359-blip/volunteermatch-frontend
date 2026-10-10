import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { taskService } from '../../services/taskService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ListTodo, CheckCircle2, Play, Calendar, Check, AlertCircle } from 'lucide-react';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const profile = await volunteerService.getMyProfile();
      const list = await taskService.getVolunteerTasks(profile.id);
      setTasks(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
      alert('Could not update task status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your tasks..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-primary" />
          <span>My Assigned Tasks</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tasks assigned to you by organizations for your selected events. Update your progress as you work.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Assigned Tasks</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When organizations assign roles or tasks for events you are selected for, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{task.taskName}</h3>
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Event: <strong className="text-slate-700">{task.eventTitle}</strong></span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Assigned on: {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {task.status === 'ASSIGNED' && (
                  <button
                    disabled={updatingId === task.id}
                    onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                    className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Task</span>
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <button
                    disabled={updatingId === task.id}
                    onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                )}

                {task.status === 'COMPLETED' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Finished
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
