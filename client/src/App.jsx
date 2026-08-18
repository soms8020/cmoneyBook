import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/common';
import DashboardPage from './pages/DashboardPage';
import EventListPage from './pages/EventListPage';
import EventFormPage from './pages/EventFormPage';
import PersonListPage from './pages/PersonListPage';
import PersonDetailPage from './pages/PersonDetailPage';
import StatsPage from './pages/StatsPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:id/edit" element={<EventFormPage />} />
          <Route path="/persons" element={<PersonListPage />} />
          <Route path="/persons/:id" element={<PersonDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
