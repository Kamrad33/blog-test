import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface Profile {
    id: number;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    about: string | null;
    avatarPicId: number | null;
    phoneNumber: string | null;
    avatarUrl?: string;
}

export const useProfile = () => {
    const queryClient = useQueryClient();
    
    const {
        data: profile,
        isLoading,
        error
    } = useQuery<Profile>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/profile');

            return res.data;
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (updates: Partial<Profile>) => {
            const res = await api.patch('/profile', updates);

            return res.data;
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['profile'], updatedUser);
        },
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();

            formData.append('avatar', file);

            const res = await api.post('/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return res.data; // { avatarUrl: string }
        },
        onSuccess: (data) => {
        queryClient.setQueryData(['profile'], (old: Profile | undefined) => {
            if (old) return { ...old, avatarUrl: data.avatarUrl };
    
            return old;
        });
        },
    });

    return {
        profile,
        isLoading,
        error,
        updateProfile: updateProfileMutation,
        uploadAvatar: uploadAvatarMutation,
    };
};