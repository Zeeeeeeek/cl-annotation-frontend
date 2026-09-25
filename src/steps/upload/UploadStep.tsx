import { Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { useRef, useState, type ChangeEvent, type DragEvent } from "react"

interface ImageLoaderProps {
    onFilesSelected: (files: File[]) => void
}

export function UploadStep({ onFilesSelected }: ImageLoaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const dragCounter = useRef(0)

    function handleDragEnter(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        dragCounter.current++
        setIsDragging(true)
    }

    function handleDragLeave(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        dragCounter.current--
        if (dragCounter.current === 0) {
            setIsDragging(false)
        }
    }

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        dragCounter.current = 0
        setIsDragging(false)
        const imageFiles = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith("image/"))
        onFilesSelected(imageFiles)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        onFilesSelected(Array.from(event.target.files ?? []))
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
            <Paper
                elevation={4}
                sx={{ width: "100%", maxWidth: "clamp(320px, 40vw, 600px)", maxHeight: "75%", borderRadius: 2 }}
            >
                <Box sx={{ px: 3, py: 2.5 }}>
                    <Typography variant="h6">Upload Images</Typography>
                </Box>
                <Divider />

                <Box sx={{ p: 3, height: "100%", my: 1 }}>
                    <Paper
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        sx={{
                            backgroundColor: isDragging ? blue[50] : "background.paper",
                            color: "text.primary",
                            height: "25%",
                            boxShadow: "none",
                            border: "0.2rem dashed",
                            borderColor: isDragging ? "primary.main" : "grey.400",
                            transition: "all 0.2s ease",
                            py: 2,
                            "& *": { pointerEvents: "none" },
                        }}
                    >
                        <Stack spacing={1} sx={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <FileUploadIcon sx={{ fontSize: 60 }} color="primary" />
                            <Typography variant="h6">Drag and Drop here</Typography>
                            <Typography variant="body1">or</Typography>
                            <Typography
                                component="label"
                                variant="h6"
                                gutterBottom
                                sx={{
                                    color: "primary.main",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Browse files
                                <input type="file" hidden accept="image/*" multiple onChange={handleInputChange} />
                            </Typography>
                        </Stack>
                    </Paper>
                </Box>
            </Paper>
        </Box>
    )
}