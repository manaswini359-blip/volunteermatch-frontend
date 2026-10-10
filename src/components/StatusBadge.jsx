import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const s = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  if (s === 'PENDING') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Pending Review';
  } else if (s === 'SELECTED') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Selected';
  } else if (s === 'REJECTED') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    label = 'Not Selected';
  } else if (s === 'WITHDRAWN') {
    styles = 'bg-slate-100 text-slate-600 border-slate-300';
    label = 'Withdrawn';
  } else if (s === 'PRESENT') {
    styles = 'bg-green-50 text-green-700 border-green-200 font-semibold';
    label = 'Present';
  } else if (s === 'ABSENT') {
    styles = 'bg-red-50 text-red-700 border-red-200';
    label = 'Absent';
  } else if (s === 'ASSIGNED') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    label = 'Assigned';
  } else if (s === 'IN_PROGRESS') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    label = 'In Progress';
  } else if (s === 'COMPLETED') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
    label = 'Completed';
  } else if (s === 'ACTIVE') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Active';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {label}
    </span>
  );
}
