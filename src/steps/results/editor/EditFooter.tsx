import { Box, Button, DialogActions, Typography } from "@mui/material"

interface EditFooterProps {
    isModified: boolean
    onCancel: () => void
    onSave: () => void
}

export function EditFooter({ isModified, onCancel, onSave }: EditFooterProps) {
    return (
        <DialogActions
            sx={{
                borderTop: 1,
                borderColor: "divider",
                px: 3,
                py: 2,
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: isModified ? "warning.main" : "transparent",
                    }}
                />

                <Typography variant="body2">{isModified ? "Unsaved changes" : ""}</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
                <Button color="inherit" onClick={onCancel}>
                    Cancel
                </Button>

                <Button color="primary" variant="contained" disabled={!isModified} onClick={onSave}>
                    Save changes
                </Button>
            </Box>
        </DialogActions>
    )
}
