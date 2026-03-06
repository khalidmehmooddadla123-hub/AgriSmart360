import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Prices from './pages/Prices';
import Weather from './pages/Weather';
import ChatAssistant from './pages/ChatAssistant';
import Marketplace from './pages/Marketplace';
import DiseaseDetection from './pages/DiseaseDetection';
import News from './pages/News';
import LandAds from './pages/LandAds';
import Complaint from './pages/Complaint';
import Profile from './pages/Profile';
import History from './pages/History';
import EcoFarming from './pages/EcoFarming';
import Notifications from './pages/Notifications';
import Advisory from './pages/Advisory';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import './lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } }
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-agri-bg dark:bg-agri-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="font-urdu text-gray-600 dark:text-gray-300">لوڈ ہو رہا ہے...</p>
        </div>
      </div>
    );
  }

  // Check demo user with expiration
  const demoUserData = localStorage.getItem('demo_user');
  let demoUser = null;
  if (demoUserData) {
    try {
      const parsed = JSON.parse(demoUserData);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem('demo_user');
      } else {
        demoUser = parsed;
      }
    } catch {
      localStorage.removeItem('demo_user');
    }
  }
  if (!user && !demoUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected app routes under /app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="prices" element={<Prices />} />
        <Route path="weather" element={<Weather />} />
        <Route path="chat" element={<ChatAssistant />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="disease" element={<DiseaseDetection />} />
        <Route path="news" element={<News />} />
        <Route path="land" element={<LandAds />} />
        <Route path="complaint" element={<Complaint />} />
        <Route path="profile" element={<Profile />} />
        <Route path="history" element={<History />} />
        <Route path="eco" element={<EcoFarming />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="advisory" element={<Advisory />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
