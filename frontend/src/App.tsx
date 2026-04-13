import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function App() {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuth(!!localStorage.getItem('access_token'));
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/profile" />} />
                <Route path="/register" element={!isAuth ? <RegisterPage /> : <Navigate to="/profile" />} />
                <Route path="/profile" element={isAuth ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={isAuth ? "/profile" : "/login"} />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;