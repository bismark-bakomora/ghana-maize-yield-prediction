import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './utils/constants';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PredictionPage from './pages/PredictionPage';

// Temporary placeholder components until we create the real ones

const Dashboard = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    <p className="text-gray-600">Dashboard placeholder</p>
  </div>
);

const FarmingInsightsPage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold mb-6">Farming Insights</h1>
    <p className="text-gray-600">Insights page placeholder</p>
  </div>
);

const ProfilePage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold mb-6">Profile</h1>
    <p className="text-gray-600">Profile page placeholder</p>
  </div>
);

const App: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.AUTH} element={<AuthPage />} />
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.PREDICTION} element={<PredictionPage />} />
      <Route path={ROUTES.INSIGHTS} element={<FarmingInsightsPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default App;