import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage defaultAuthOpen={true} defaultAuthMode="login" />} />
      <Route path="/signup" element={<LandingPage defaultAuthOpen={true} defaultAuthMode="signup" />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat/:documentId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
