import { Route, Routes, Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore.js';
import DashboardPage from './pages/DashboardPage.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';

//protecting rouetes that require authentication
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (!user.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const App = () => {
    const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    console.log('IsAuthenticated: ', isAuthenticated);
    console.log('User: ', user);

    return (
        <div className="app-shell">
            <header className="site-header">
                <Link className="brand" to="/login" aria-label="Securely home">
                    <span className="brand-mark" aria-hidden="true">S</span>
                    <span>Securely</span>
                </Link>
            </header>
            <main className="page-main">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignUpPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RedirectAuthenticatedUser>
                            <LoginPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route
                    path="/forgot-password"
                    element={
                        <RedirectAuthenticatedUser>
                            <ForgotPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={
                        <RedirectAuthenticatedUser>
                            <ResetPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                { /* Catch-all route to redirect unknown paths */ }
                <Route
                    path="*"
                    element={
                        <Navigate to={isAuthenticated ? '/' : '/login'} replace />
                    }
                />
            </Routes>
            </main>
            <Toaster />
        </div>
    );
};

export default App;
