import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Volunteer pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import CompleteProfile from './pages/volunteer/CompleteProfile';
import FindOpportunities from './pages/volunteer/FindOpportunities';
import EventDetails from './pages/volunteer/EventDetails';
import MyApplications from './pages/volunteer/MyApplications';
import MyEvents from './pages/volunteer/MyEvents';
import MyTasks from './pages/volunteer/MyTasks';
import Attendance from './pages/volunteer/Attendance';
import Certificates from './pages/volunteer/Certificates';
import VolunteerHistory from './pages/volunteer/VolunteerHistory';

// Organization pages
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import OrganizationProfile from './pages/organization/OrganizationProfile';
import CreateEvent from './pages/organization/CreateEvent';
import OrgEvents from './pages/organization/MyEvents';
import EventApplications from './pages/organization/EventApplications';
import AIRecommendations from './pages/organization/AIRecommendations';
import TaskAssignment from './pages/organization/TaskAssignment';
import AttendanceManagement from './pages/organization/AttendanceManagement';
import CertificateManagement from './pages/organization/CertificateManagement';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Opportunities & Event details (accessible openly with public navbar) */}
      <Route
        path="/opportunities"
        element={
          <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              <FindOpportunities />
            </main>
          </div>
        }
      />
      <Route
        path="/events/:id"
        element={
          <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              <EventDetails />
            </main>
          </div>
        }
      />

      {/* Dedicated onboarding profile completion route */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute allowedRoles={['VOLUNTEER']}>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      {/* Volunteer Dashboard Routes (Protected) */}
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={['VOLUNTEER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/volunteer/dashboard" replace />} />
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="profile" element={<VolunteerProfile />} />
        <Route path="complete-profile" element={<CompleteProfile />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="history" element={<VolunteerHistory />} />
      </Route>

      {/* Organization Dashboard Routes (Protected) */}
      <Route
        path="/organization"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZATION', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/organization/dashboard" replace />} />
        <Route path="dashboard" element={<OrganizationDashboard />} />
        <Route path="profile" element={<OrganizationProfile />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="events" element={<OrgEvents />} />
        <Route path="applications" element={<EventApplications />} />
        <Route path="ai-recommendations" element={<AIRecommendations />} />
        <Route path="tasks" element={<TaskAssignment />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="certificates" element={<CertificateManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
