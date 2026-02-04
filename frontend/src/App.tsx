import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './utils/constants';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import PredictionPage from './pages/PredictionPage';
import FarmingInsightsPage from './pages/FarmingInsightsPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public pages without Layout */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.AUTH} element={<AuthPage />} />

      {/* Pages with Layout */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
            <Dashboard />
        }
      />
      <Route
        path={ROUTES.PREDICTION}
        element={
            <PredictionPage />
        }
      />
      <Route
        path={ROUTES.INSIGHTS}
        element={
            <FarmingInsightsPage />
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
            <ProfilePage />
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default App;
