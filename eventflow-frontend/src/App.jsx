// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import ThemeToggle from "./components/ThemeToggle";

import LandingPage         from "./pages/LandingPage";
import Login               from "./pages/auth/Login";
import Register            from "./pages/auth/Register";
import ForgotPassword      from "./pages/auth/ForgotPassword";
import ResetPassword       from "./pages/auth/ResetPassword";
import VerifyEmail         from "./pages/auth/VerifyEmail";
import EventList           from "./pages/user/EventList";
import EventDetail         from "./pages/user/EventDetail";
import UserDashboard       from "./pages/user/UserDashboard";
import BookingHistory      from "./pages/user/BookingHistory";
import OrganizerDashboard  from "./pages/organizer/OrganizerDashboard";
import CreateEvent         from "./pages/organizer/CreateEvent";
import ManageRegistrations from "./pages/organizer/ManageRegistrations";
import OrganizerAnalytics  from "./pages/organizer/OrganizerAnalytics";
import OrganizerSettings   from "./pages/organizer/OrganizerSettings";
import AdminPanel          from "./pages/admin/AdminPanel";
import ManageUsers         from "./pages/admin/ManageUsers";
import ManageEvents        from "./pages/admin/ManageEvents";
import ManageBookings      from "./pages/admin/ManageBookings";
import AdminReports        from "./pages/admin/AdminReports";
import UserProfile         from "./pages/user/UserProfile";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ThemeToggle fixed className="mobile-theme-toggle" />
          {/* PageTransition must be inside BrowserRouter to access useLocation */}
          <PageTransition>
            <Routes>
              {/* Public */}
              <Route path="/"           element={<LandingPage />} />
              <Route path="/login"            element={<Login />} />
              <Route path="/register"         element={<Register />} />
              <Route path="/forgot-password"  element={<ForgotPassword />} />
              <Route path="/reset-password"   element={<ResetPassword />} />
              <Route path="/verify-email"    element={<VerifyEmail />} />
              <Route path="/events"     element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />

              {/* User (role: user) */}
              <Route element={<ProtectedRoute roles={["user"]} />}>
                <Route path="/dashboard"   element={<UserDashboard />} />
                <Route path="/my-bookings" element={<BookingHistory />} />
                <Route path="/profile"     element={<UserProfile />} />
              </Route>

              {/* Organizer */}
              <Route element={<ProtectedRoute roles={["organizer"]} />}>
                <Route path="/organizer"               element={<OrganizerDashboard />} />
                <Route path="/organizer/create"        element={<CreateEvent />} />
                <Route path="/organizer/registrations" element={<ManageRegistrations />} />
                <Route path="/organizer/analytics"     element={<OrganizerAnalytics />} />
                <Route path="/organizer/settings"      element={<OrganizerSettings />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route path="/admin"          element={<AdminPanel />} />
                <Route path="/admin/users"    element={<ManageUsers />} />
                <Route path="/admin/events"   element={<ManageEvents />} />
                <Route path="/admin/bookings" element={<ManageBookings />} />
                <Route path="/admin/reports"  element={<AdminReports />} />
              </Route>
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
