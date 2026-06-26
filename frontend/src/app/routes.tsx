import type { ReactNode } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import PageTitle from "../components/PageTitle";
import { useAuth } from "../features/auth/AuthProvider";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmailOtp from "../pages/VerifyEmailOtp";
import Help from "../pages/Help";


import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "../pages/Dashboard";
import Directory from "../pages/Directory";
import StudentProfile from "../pages/StudentProfile";
import Announcements from "../pages/Announcements";
import Jobs from "../pages/Jobs";
import Events from "../pages/Events";
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";

import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";

import AnnouncementDetails from "../pages/AnnouncementDetails";
import JobDetails from "../pages/JobDetails";
import EventDetails from "../pages/EventDetails";

function Protected({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { isAuthed, isAdmin } = useAuth();
  if (!isAuthed) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

function WithTitle({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageTitle title={title} />
      {children}
    </>
  );
}

export default function AppRoutes() {
  return useRoutes([
    // Public
    {
      path: "/",
      element: (
        <WithTitle title="SEBatch223 Network">
          <Landing />
        </WithTitle>
      ),
    },
    {
      path: "/login",
      element: (
        <WithTitle title="Login">
          <Login />
        </WithTitle>
      ),
    },
    {
      path: "/register",
      element: (
        <WithTitle title="Register">
          <Register />
        </WithTitle>
      ),
    },
    {
      path: "/verify-email",
      element: (
        <WithTitle title="Verify Email">
          <VerifyEmailOtp />
        </WithTitle>
      ),
    },

    
    {
      path: "/forgot-password",
      element: (
        <WithTitle title="Forgot Password">
          <ForgotPassword />
        </WithTitle>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <WithTitle title="Reset Password">
          <ResetPassword />
        </WithTitle>
      ),
    },

    {
      path: "/help",
      element: (
        <WithTitle title="Help">
          <Help />
        </WithTitle>
      ),
    },

    // Private
    {
      path: "/app",
      element: (
        <Protected>
          <WithTitle title="Dashboard">
            <Dashboard />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/directory",
      element: (
        <Protected>
          <WithTitle title="Directory">
            <Directory />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/students/:id",
      element: (
        <Protected>
          <WithTitle title="Student Profile">
            <StudentProfile />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/announcements",
      element: (
        <Protected>
          <WithTitle title="Announcements">
            <Announcements />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/announcements/:id",
      element: (
        <Protected>
          <WithTitle title="Announcement">
            <AnnouncementDetails />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/jobs",
      element: (
        <Protected>
          <WithTitle title="Jobs & Internships">
            <Jobs />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/jobs/:id",
      element: (
        <Protected>
          <WithTitle title="Job Details">
            <JobDetails />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/events",
      element: (
        <Protected>
          <WithTitle title="Events">
            <Events />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/events/:id",
      element: (
        <Protected>
          <WithTitle title="Event Details">
            <EventDetails />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/profile",
      element: (
        <Protected>
          <WithTitle title="My Profile">
            <Profile />
          </WithTitle>
        </Protected>
      ),
    },
    {
      path: "/profile/edit",
      element: (
        <Protected>
          <WithTitle title="Edit Profile">
            <ProfileEdit />
          </WithTitle>
        </Protected>
      ),
    },

    // Admin
    {
      path: "/admin",
      element: (
        <AdminOnly>
          <WithTitle title="Admin">
            <Admin />
          </WithTitle>
        </AdminOnly>
      ),
    },

    // 404
    {
      path: "*",
      element: (
        <WithTitle title="404">
          <NotFound />
        </WithTitle>
      ),
    },
  ]);
}