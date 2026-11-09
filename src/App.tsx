import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import DashboardPage from './pages/dashboard';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import VerifyMagicLinkPage from './pages/auth/verify-magic-link';
import OnboardingPage from './pages/auth/onboarding';
import TwoFactorChallengePage from './pages/auth/two-factor-challenge';
import CarCreatePage from './pages/car/create';
import RideCreatePage from './pages/rides/create';
import VerifyBeforePublishPage from './pages/rides/verify-before-publish';
import ProfilePage from './pages/settings/profile';
import AppearancePage from './pages/settings/appearance';
import SecurityPage from './pages/settings/security';
import UploadProfilePage from './pages/upload/uploadProfile';
import DocumentCreatePage from './pages/documents/create';
import ProtectedRoute from './components/auth/ProtectedRoute';

function RideSearchPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold">Recherche de trajet</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Cette page de recherche est prête à être alimentée par votre moteur de recherche de trajets.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage status="" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/verify" element={<VerifyMagicLinkPage />} />
        <Route path="/verify-magic-link" element={<VerifyMagicLinkPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/rides/search" element={<RideSearchPage />} />

        {/* Routes protégées : exigent connexion ET profil complet (table users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/two-factor-challenge"
          element={
            <ProtectedRoute>
              <TwoFactorChallengePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars/create"
          element={
            <ProtectedRoute>
              <CarCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/create"
          element={
            <ProtectedRoute>
              <RideCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/verify-before-publish"
          element={
            <ProtectedRoute>
              <VerifyBeforePublishPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/appearance"
          element={
            <ProtectedRoute>
              <AppearancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/security"
          element={
            <ProtectedRoute>
              <SecurityPage
                passwordRules=""
                canManagePasskeys={false}
                passkeys={[]}
                canManageTwoFactor={false}
                requiresConfirmation={false}
                twoFactorEnabled={false}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload/profile"
          element={
            <ProtectedRoute>
              <UploadProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-profile"
          element={
            <ProtectedRoute>
              <UploadProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/create"
          element={
            <ProtectedRoute>
              <DocumentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/documents"
          element={
            <ProtectedRoute>
              <DocumentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App