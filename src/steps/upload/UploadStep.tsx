import { Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import type { ChangeEvent } from "react"
import { isAcceptedImageFile } from "../../utils/files.ts"
import { useFileDrop } from "../../hooks/useFileDrop.ts"

interface UploadStepProps {
    onFilesSelected: (files: File[]) => void
}

export function UploadStep({ onFilesSelected }: UploadStepProps) {
    const { isDragging, dropHandlers } = useFileDrop(handleFilesDrop)

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        onFilesSelected(Array.from(event.target.files ?? []).filter(isAcceptedImageFile))
    }

    function handleFilesDrop(files: File[]) {
        onFilesSelected(files.filter(isAcceptedImageFile))
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
            <Paper
                elevation={4}
                sx={{ width: "100%", maxWidth: "clamp(20rem, 40vw, 37.5rem)", maxHeight: "75%", borderRadius: 2 }}
            >
                <Box sx={{ px: 3, py: 2.5 }}>
                    <Typography variant="h6">Upload Images</Typography>
                </Box>
                <Divider />

                <Box sx={{ p: 3, height: "100%", my: 1 }}>
                    <Paper
                        {...dropHandlers}
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
                            <FileUploadIcon sx={{ fontSize: "3.75rem" }} color="primary" />
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
