import { TextField, Button, Container, Box, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { RegisterData } from '../types';
import { useState } from 'react';
import AvatarDropzone from '../components/AvatarDropzone';

const RegisterPage = () => {
    const { register: registerUser } = useAuth();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>();

    const onSubmit = (data: RegisterData) => {
        const formData = new FormData();

        formData.append('login', data.login);
        formData.append('password', data.password);
        formData.append('email', data.email);

        if (data.firstName) formData.append('firstName', data.firstName);
        if (data.lastName) formData.append('lastName', data.lastName);
        if (data.birthDate) formData.append('birthDate', data.birthDate);
        if (data.about) formData.append('about', data.about);
        if (avatarFile) formData.append('avatar', avatarFile);

        registerUser.mutate(formData);
  };
 
    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5">
                    Регистрация
                </Typography>

                {registerUser.isError && (
                    <Alert severity="error">Ошибка регистрации: {registerUser.error?.response.status === 400 && registerUser.error?.response.data.message}</Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 2 }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Логин*"
                        {...register('login', { required: true })}
                        error={!!errors.login}
                        helperText={errors.login?.message}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Пароль*"
                        type="password"
                        {...register('password', { required: true })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email*"
                        type="email"
                        {...register('email', { required: true })}
                    />

                    <Typography
                        variant="h5"
                        sx={{ mt: 2}}
                    >
                        Доп. информация
                    </Typography>

                    <TextField
                        margin="normal"
                        fullWidth label="Имя"
                        {...register('firstName')}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Фамилия"
                        {...register('lastName')}
                    />

                    <TextField
                        margin="dense"
                        label="Дата рождения"
                        type="date"
                        fullWidth
                        {...register('birthDate')}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Обо мне"
                        {...register('about')}
                    />

                    <AvatarDropzone onFileSelect={setAvatarFile} />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={registerUser.isPending}
                    >
                        {registerUser.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;