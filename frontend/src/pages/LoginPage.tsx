import { TextField, Button, Container, Box, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LoginCredentials } from '../types';

const LoginPage = () => {
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginCredentials>();

    const onSubmit = (data: LoginCredentials) => {
        login.mutate(data);
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h4">
                    Вход
                </Typography>

                {login.isError && (
                    <Alert severity="error">
                        Неверный логин или пароль
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 2 }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Логин"
                        {...register('login', { required: 'Логин обязателен' })}
                        error={!!errors.login}
                        helperText={errors.login?.message}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Пароль"
                        type="password"
                        {...register('password', { required: 'Пароль обязателен' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={login.isPending}
                    >
                        {login.isPending ? 'Вход...' : 'Войти'}
                    </Button>

                    <Button
                        component={Link}
                        to="/register"
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        Нет аккаунта? Зарегистрироваться
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;