import { Box, Button, Dialog, DialogActions, Typography } from "@mui/material"

interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    message: string
    cancelLabel: string
    confirmLabel: string
    confirmColor?: "primary" | "error"
    onCancel: () => void
    onConfirm: () => void
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    cancelLabel,
    confirmLabel,
    confirmColor = "primary",
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h6">{title}</Typography>
                <Typography sx={{ mt: 1 }}>{message}</Typography>
                <DialogActions sx={{ mt: 2 }}>
                    <Button onClick={onCancel}>{cancelLabel}</Button>
                    <Button variant="contained" color={confirmColor} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
