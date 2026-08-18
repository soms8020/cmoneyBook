import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/common';
import DashboardPage from './pages/DashboardPage';
import EventListPage from './pages/EventListPage';
import EventFormPage from './pages/EventFormPage';
import PersonListPage from './pages/PersonListPage';
import PersonDetailPage from './pages/PersonDetailPage';
import StatsPage from './pages/StatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

// 인증된 경우에만 Layout 적용
const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/events" element={<ProtectedLayout><EventListPage /></ProtectedLayout>} />
          <Route path="/events/new" element={<ProtectedLayout><EventFormPage /></ProtectedLayout>} />
          <Route path="/events/:id/edit" element={<ProtectedLayout><EventFormPage /></ProtectedLayout>} />
          <Route path="/persons" element={<ProtectedLayout><PersonListPage /></ProtectedLayout>} />
          <Route path="/persons/:id" element={<ProtectedLayout><PersonDetailPage /></ProtectedLayout>} />
          <Route path="/stats" element={<ProtectedLayout><StatsPage /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
