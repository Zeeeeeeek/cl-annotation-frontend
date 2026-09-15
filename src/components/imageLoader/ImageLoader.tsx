import { Box, Paper, Typography, Divider, Stack } from "@mui/material";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { blue } from "@mui/material/colors";
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface ImageLoaderProps {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ImageLoader({ handleChange }: ImageLoaderProps) {

    const [isDragEnter, setIsDragEnter] = useState(false);
    const dragCounter = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleDragEnter(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        dragCounter.current++;
        setIsDragEnter(true);
    }

    function handleDragLeave(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragEnter(false);
        }
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        dragCounter.current = 0;
        setIsDragEnter(false);

        const droppedFiles = event.dataTransfer.files;
        if (!droppedFiles || droppedFiles.length === 0 || !inputRef.current) return;
        const dataTransfer = new DataTransfer();
        Array.from(droppedFiles).forEach(file => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    maxWidth: 'clamp(320px, 40vw, 600px)',
                    maxHeight: '75%',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ px: 3, py: 2.5 }}>
                    <Typography variant="h6">
                        Upload Images
                    </Typography>
                </Box>
                <Divider />

                <Box sx={{ p: 3, height: '100%', my: 1 }}>
                    <Stack spacing={1} sx={{ height: '100%' }}>

                        <Paper
                            sx={{
                                backgroundColor: isDragEnter ? blue[50] : 'background.paper',
                                color: 'text.primary',
                                height: '25%',
                                boxShadow: 'none',
                                border: '0.2rem dashed',
                                borderColor: isDragEnter ? 'primary.main' : 'grey.400',
                                transition: 'all 0.2s ease',
                                py: 2,
                                // Nessun figlio riceve eventi puntatore/drag:
                                // dragenter/dragleave arrivano SOLO da questo Paper
                                '& *': {
                                    pointerEvents: 'none',
                                },
                            }}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <FileUploadIcon sx={{ fontSize: 60 }} color={"primary"} />

                                <Typography variant="h6">
                                    Drag and Drop here
                                </Typography>

                                <Typography variant="body1">
                                    or
                                </Typography>

                                <Typography
                                    component="label"
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                        // riattiva SOLO qui gli eventi puntatore
                                        pointerEvents: 'auto',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Browse files
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        onChange={handleChange}
                                    />
                                </Typography>
                            </Stack>
                        </Paper>

                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}