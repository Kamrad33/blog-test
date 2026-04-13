import { useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { usePosts } from '../hooks/usePosts';
import type { Post } from '../types';

const PostList = () => {
    const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
    const [formOpen, setFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
    
    const {
        posts,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        loadMore,
        createPost,
        updatePost,
        deletePost,
    } = usePosts(sort);

    const handleCreate = () => {
        setEditingPost(undefined);
        setFormOpen(true);
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormOpen(true);
    };

    const handleSave = (content: any) => {
        if (editingPost) {
            updatePost.mutate({ id: editingPost.id, content });
        } else {
            createPost.mutate(content);
        }

        setFormOpen(false);
    };

    const handleDelete = (id: number) => {
        deletePost.mutate(id);
    };

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2
            }}>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                >
                    Новый пост
                </Button>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Сортировка</InputLabel>

                    <Select
                        value={sort}
                        label="Сортировка"
                        onChange={(e) => setSort(e.target.value as 'ASC' | 'DESC')}
                    >
                        <MenuItem value="DESC">Новые сначала</MenuItem>
                        <MenuItem value="ASC">Старые сначала</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading && <CircularProgress />}

            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}

            {hasNextPage && (
                <Button
                    onClick={() => loadMore()}
                    disabled={isFetchingNextPage}
                    sx={{ mt: 2 }}
                >
                    {isFetchingNextPage ? <CircularProgress size={24} /> : 'Загрузить еще'}
                </Button>
            )}

            <PostForm
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                initialData={editingPost}
                onSave={handleSave}
                isSaving={createPost.isPending || updatePost.isPending}
            />
        </Box>
    );
};

export default PostList;