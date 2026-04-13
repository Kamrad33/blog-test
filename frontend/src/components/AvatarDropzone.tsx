import { useCallback, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface AvatarDropzoneProps {
    onFileSelect: (file: File | null) => void;
    initialPreview?: string | null;
}

const AvatarDropzone = ({
    onFileSelect,
    initialPreview
}: AvatarDropzoneProps) => {
    const [preview, setPreview] = useState<string | null>(initialPreview || null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
    });

    const handleClear = () => {
        setPreview(null);
        onFileSelect(null);
    };

    return (
        <Paper
            {...getRootProps()}
            sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                transition: '0.2s',
            }}
        >
            <input {...getInputProps()} />

            {preview ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        src={preview}
                        sx={{
                            width: 100,
                            height: 100,
                            mb: 1
                        }}
                    />
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleClear(); }}
                    >
                        <ClearIcon /> Удалить
                    </IconButton>
                </Box>
            ) : (
                <>
                    <CloudUploadIcon fontSize="large" color="action" />

                    <Typography variant="body2" color="textSecondary">
                        {isDragActive ? 'Отпустите файл' : 'Перетащите или нажмите для выбора аватара'}
                    </Typography>
                </>
            )}
        </Paper>
    );
};

export default AvatarDropzone;