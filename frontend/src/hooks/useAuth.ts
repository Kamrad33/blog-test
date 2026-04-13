import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LoginCredentials } from '../types';

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (creds: LoginCredentials) => {
            const res = await api.post('/auth/login', creds);

            return res.data; // { access_token, refresh_token }
        },
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            queryClient.invalidateQueries({ queryKey: ['profile'] });
            window.dispatchEvent(new Event('auth-change'));

            navigate('/profile');
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.post(
                '/auth/register',
                formData, 
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            queryClient.invalidateQueries({ queryKey: ['profile'] });
            window.dispatchEvent(new Event('auth-change'));

            navigate('/profile');
        },
    });

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        queryClient.clear();
        window.dispatchEvent(new Event('auth-change'));

        navigate('/login');
    };

    return { login: loginMutation, register: registerMutation, logout };
};