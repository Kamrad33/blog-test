import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

// Перехватчик для добавления JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Не обрабатываем 401 на эндпоинтах аутентификации
        const isAuthEndpoint =
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh');

        if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
            const refreshToken = localStorage.getItem('refresh_token');

            try {
                const res = await axios.post(
                    'http://localhost:3000/auth/refresh',
                    { refresh_token: refreshToken }
                );
                
                const { access_token, refresh_token } = res.data;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;