import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const usePosts = (sort: 'ASC' | 'DESC' = 'DESC') => {
    const queryClient = useQueryClient();

    // Бесконечный запрос для пагинации (load more)
    const infiniteQuery = useInfiniteQuery({
        queryKey: ['posts', sort],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await api.get(`/posts?limit=5&offset=${pageParam}&sort=${sort}`);

            return res.data; // ожидаем массив постов
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 5 ? allPages.length * 5 : undefined;
        },
        initialPageParam: 0,
    });

    const createPostMutation = useMutation({
        mutationFn: async (content: any) => {
            const res = await api.post('/posts', { content: JSON.stringify(content) });

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const updatePostMutation = useMutation({
        mutationFn: async ({ id, content }: { id: number; content: any }) => {
            const res = await api.patch(`/posts/${id}`, { content: JSON.stringify(content) });

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/posts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    return {
        posts: infiniteQuery.data?.pages.flat() ?? [],
        isLoading: infiniteQuery.isLoading,
        isFetchingNextPage: infiniteQuery.isFetchingNextPage,
        hasNextPage: infiniteQuery.hasNextPage,
        loadMore: infiniteQuery.fetchNextPage,
        createPost: createPostMutation,
        updatePost: updatePostMutation,
        deletePost: deletePostMutation,
    };
};