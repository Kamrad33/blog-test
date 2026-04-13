import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Editor from './Editor';
import type { Post } from '../types';

interface PostFormProps {
    isOpen: boolean;
    initialData?: Post;
    isSaving: boolean;
    onSave: (content: any) => void;
    onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
    isSaving,
}) => {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        if (initialData?.content) {
            try {
                setContent(JSON.parse(initialData.content));
            } catch {
                setContent(null);
            }
        } else {
            setContent(null);
        }
    }, [initialData]);

    const handleSave = () => {
        if (content) onSave(content);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {initialData ? 'Редактировать пост' : 'Новый пост'}
            </DialogTitle>

            <DialogContent>
                <Editor
                    key={initialData?.id || 'new'}  // заставляет React пересоздавать компонент при изменении поста
                    isOpen={isOpen}
                    data={initialData ? JSON.parse(initialData.content) : undefined}
                    onChange={setContent}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>

                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isSaving}
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PostForm;