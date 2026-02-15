import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.tsx';
import { AdminElectivesPage } from './pages/AdminElectivesPage/AdminElectivesPage.tsx';
import { StudentElectivesPage } from './pages/StudentElectivesPage/StudentElectivePage.tsx';

import { getStoredUser } from './api/auth';
import type { User } from './types/user';

function getDefaultPath(user: User) {
    if (user.role === 'admin') return '/admin';
    return '/student';
}

export default function App() {
    const [user, setUser] = useState<User | null>(() => getStoredUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Никаких setUser тут не надо — мы уже инициализировали из localStorage выше
        setLoading(false);
    }, []);

    const handleLoginSuccess = (userData: User) => setUser(userData);

    if (loading) return null;

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate to={getDefaultPath(user)} replace />
                    ) : (
                        <LoginPage onLoginSuccess={handleLoginSuccess} />
                    )
                }
            />

            <Route
                path="/student"
                element={user ? <StudentElectivesPage /> : <Navigate to="/login" replace />}
            />

            <Route
                path="/admin"
                element={user ? <AdminElectivesPage /> : <Navigate to="/login" replace />}
            />

            <Route
                path="/"
                element={user ? <Navigate to={getDefaultPath(user)} replace /> : <Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
