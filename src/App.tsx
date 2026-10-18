import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import DashboardPage from './pages/dashboard';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import ForgotPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-password';
import ConfirmPasswordPage from './pages/auth/confirm-password';
import VerifyEmailPage from './pages/auth/verify-email';
import TwoFactorChallengePage from './pages/auth/two-factor-challenge';
import CarCreatePage from './pages/car/create';
import RideCreatePage from './pages/rides/create';
import VerifyBeforePublishPage from './pages/rides/verify-before-publish';
import ProfilePage from './pages/settings/profile';
import AppearancePage from './pages/settings/appearance';
import SecurityPage from './pages/settings/security';
import UploadProfilePage from './pages/upload/uploadProfile';
import DocumentCreatePage from './pages/documents/create';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage status="" canResetPassword />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage status="" />} />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage token="demo-token" email="demo@example.com" />}
        />
        <Route path="/confirm-password" element={<ConfirmPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage status="" />} />
        <Route path="/two-factor-challenge" element={<TwoFactorChallengePage />} />
        <Route path="/cars/create" element={<CarCreatePage />} />
        <Route path="/rides/create" element={<RideCreatePage />} />
        <Route path="/rides/search" element={<RideSearchPage />} />
        <Route
          path="/rides/verify-before-publish"
          element={<VerifyBeforePublishPage documentComplete={false} document={null} carComplete={false} car={null} />}
        />
        <Route
          path="/settings/profile"
          element={<ProfilePage />}
        />
        <Route path="/settings/appearance" element={<AppearancePage />} />
        <Route
          path="/settings/security"
          element={
            <SecurityPage
              passwordRules=""
              canManagePasskeys={false}
              passkeys={[]}
              canManageTwoFactor={false}
              requiresConfirmation={false}
              twoFactorEnabled={false}
            />
          }
        />
        <Route path="/upload/profile" element={<UploadProfilePage />} />
        <Route path="/documents/create" element={<DocumentCreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App