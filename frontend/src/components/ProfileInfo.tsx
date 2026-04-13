import React, { useState } from 'react';
import { Card, CardContent, Avatar, Typography, Button, Box, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useProfile } from '../hooks/useProfile';
import type { User } from '../types';
import { useAuth } from '../hooks/useAuth';

const ProfileInfo = () => {
    const {
        profile,
        isLoading,
        updateProfile,
        uploadAvatar
    } = useProfile();

    const { logout } = useAuth();

    const [editOpen, setEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});

    if (isLoading) return <Typography>Загрузка...</Typography>;

    if (!profile) return <Typography>Ошибка загрузки профиля</Typography>;

    const handleEditClick = () => {
        setEditForm({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            birthDate: profile.birthDate || '',
            about: profile.about || '',
            email: profile.email,
            phoneNumber: profile.phoneNumber || '',
        });

        setEditOpen(true);
    };

    const handleLogoutClick = () => {
        logout();
    };

    const handleEditSave = () => {
        updateProfile.mutate(editForm, {
            onSuccess: () => setEditOpen(false),
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadAvatar.mutate(e.target.files[0]);
        }
    };

    const avatarUrl = profile?.avatarUrl || undefined;

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box
                    sx={{
                        display:'flex',
                        alignItems:'center',
                        position:'relative',
                    }}
                >
                    <Box sx={{ position: 'relative'}}>
                        <Avatar
                            src={'http://localhost:3000/' + avatarUrl}
                            sx={{
                                width: 100,
                                height: 100,
                                mr: 2,
                            }}
                        >
                            {!profile.avatarPicId && profile.firstName?.charAt(0)}
                        </Avatar>
                        <Button sx={{ position: 'relative', alignSelf: 'center', display: 'flex'}} onClick={handleLogoutClick}>Выйти</Button>

                        <IconButton
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 8,
                                bgcolor: 'background.paper',
                            }}
                            size="small"
                        >
                            <PhotoCameraIcon fontSize="small" />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1}}>
                        <Typography variant="h5">
                            {profile.firstName} {profile.lastName}
                        </Typography>

                        <Typography
                            variant="body2" 
                            color="textSecondary"
                        >
                            @{profile.login}
                        </Typography>

                        <Typography variant="body2">
                            {profile.about}
                        </Typography>

                        <Typography variant="body2">
                            Email: {profile.email}
                        </Typography>

                        {profile.phoneNumber && (
                            <Typography variant="body2">
                                Телефон: {profile.phoneNumber}
                            </Typography>
                        )}

                        {profile.birthDate && (
                            <Typography variant="body2">
                                Дата рождения: {new Date(profile.birthDate).toLocaleDateString()}
                            </Typography>
                        )}
                    </Box>

                    <Button startIcon={<EditIcon />} onClick={handleEditClick}>Редактировать</Button>
                </Box>
            </CardContent>

            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
            >
                <DialogTitle>Редактировать профиль</DialogTitle>

                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Имя"
                        fullWidth
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    />

                    <TextField
                        margin="dense"
                        label="Фамилия"
                        fullWidth
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    />

                    <TextField
                        margin="dense"
                        label="Дата рождения"
                        type="date"
                        fullWidth
                        value={editForm.birthDate?.toString().slice(0,10) || ''}
                        onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                    />

                    <TextField
                        margin="dense"
                        label="О себе"
                        fullWidth
                        multiline
                        rows={3}
                        value={editForm.about}
                        onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                    />

                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />

                    <TextField
                        margin="dense"
                        label="Телефон"
                        fullWidth
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        disabled={updateProfile.isPending}
                    >
                        {updateProfile.isPending ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ProfileInfo;