import { Box, Button, DialogActions, Stack, Typography } from "@mui/material"

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
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                    sx={{
                        width: "0.5rem",
                        height: "0.5rem",
                        borderRadius: "50%",
                        bgcolor: isModified ? "warning.main" : "transparent",
                    }}
                />

                <Typography variant="body2">{isModified ? "Unsaved changes" : ""}</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
                <Button color="inherit" onClick={onCancel}>
                    Cancel
                </Button>

                <Button color="primary" variant="contained" disabled={!isModified} onClick={onSave}>
                    Save changes
                </Button>
            </Stack>
        </DialogActions>
    )
}
