import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';
import api from '../api/axios';

interface EditorProps {
    isOpen: boolean;
    data?: any;
    onChange: (data: any) => void;
}

const Editor = ({ data, isOpen, onChange }: EditorProps) => {
    const editorInstance = useRef<EditorJS | null>(null);
    const holderId = 'editorjs';

    useEffect(() => {
        if (isOpen && !editorInstance.current) {
            // Даём время DOM отрендерить элемент
            const timer = setTimeout(() => {
                const element = document.getElementById(holderId);
                if (!element) {
                    console.warn('Editor holder element not found');
                    return;
                }
                editorInstance.current = new EditorJS({
                    holder: holderId,
                    placeholder: 'Начните писать ваш пост...',
                    data: data || {},
                    tools: {
                        header: Header,
                        list: List,
                        paragraph: Paragraph,
                        image: {
                            class: ImageTool,
                            config: {
                                uploader: {
                                    uploadByFile: async (file: File) => {
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        try {
                                            const response = await api.post('/upload/temp', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            });
                                            return { success: 1, file: { url: response.data.url } };
                                        } catch (error) {
                                            console.error('Upload failed:', error);
                                            return { success: 0, file: { url: '' } };
                                        }
                                    },
                                    uploadByUrl: async (url: string) => ({ success: 1, file: { url } }),
                                },
                            },
                        },
                    },
                    onChange: async () => {
                        const content = await editorInstance.current?.save();
                        onChange(content);
                    },
                });
            }, 0);
            return () => clearTimeout(timer);
        }

        if (!isOpen && editorInstance.current) {
            editorInstance.current.destroy();
            editorInstance.current = null;
        }
    }, [isOpen, data, onChange]); // исправлена зависимость

    return <div id={holderId} style={{ border: '1px solid #ccc', padding: '10px' }} />;
};

export default Editor;