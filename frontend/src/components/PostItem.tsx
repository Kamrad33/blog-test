import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Post } from '../types';
import editorJsHTML from 'editorjs-html';

interface PostItemProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (id: number) => void;
}

const PostItem = ({
    post,
    onEdit,
    onDelete
}: PostItemProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [postHtml, setPostHtml] = useState<string>('');

    useEffect(() => {
        let contentJson: any = null;

        try {
            contentJson = JSON.parse(post.content);
        } catch {
            contentJson = null;
        }

        if (!!contentJson) {
            const edjsParser = editorJsHTML();
            const html = edjsParser.parse(contentJson);

            setPostHtml(html)
        }
    }, []);

    const handleDeleteConfirm = () => {
        onDelete(post.id);
        setConfirmDelete(false);
    };
    
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {postHtml && (
                    <Box
                        sx={{ '& img': { maxWidth: '100%', height: 'auto' } }}>
                        <div dangerouslySetInnerHTML={{ __html: postHtml}}></div>
                    </Box>
                )}

                <Typography variant="caption" color="textSecondary">
                    {new Date(post.createdAt).toLocaleString()}
                </Typography>

                <Box sx={{ mt: 1 }}>
                    <IconButton onClick={() => onEdit(post)}><EditIcon /></IconButton>
                    <IconButton onClick={() => setConfirmDelete(true)}><DeleteIcon /></IconButton>
                </Box>
            </CardContent>
            

            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
            >
                <DialogTitle>Удалить пост?</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Отмена</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Удалить</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default PostItem;