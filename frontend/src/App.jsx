import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Event from './pages/Event';
import Tracks from './pages/Tracks';
import ImportantDates from './pages/ImportantDates';
import Guidelines from './pages/Guidelines';
import Speakers from './pages/Speakers';
import OrganizingTeam from './pages/OrganizingTeam';
import Sponsors from './pages/Sponsors';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Protected Participant Pages
import Registration from './pages/Registration';
import Payment from './pages/Payment';
import Submission from './pages/Submission';
import ParticipantDashboard from './pages/ParticipantDashboard';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminParticipants from './pages/AdminParticipants';
import AdminPayments from './pages/AdminPayments';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminSettings from './pages/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <ToastContainer />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/event" element={<Event />} />
              <Route path="/tracks" element={<Tracks />} />
              <Route path="/important-dates" element={<ImportantDates />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/organizing-team" element={<OrganizingTeam />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Participant Routes */}
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <Registration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submission"
                element={
                  <ProtectedRoute>
                    <Submission />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ParticipantDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/participants"
                element={
                  <AdminRoute>
                    <AdminParticipants />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminRoute>
                    <AdminPayments />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <AdminRoute>
                    <AdminSubmissions />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </EventProvider>
    </AuthProvider>
  );
}
