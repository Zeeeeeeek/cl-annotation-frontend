import type { ImageItem, SendState } from "../../types.ts"
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
} from "@mui/material"
import { stripExtension } from "../../utils/format.ts"
import RefreshIcon from "@mui/icons-material/Refresh"
import { StatusChip } from "../../components/StatusChip.tsx"

interface SendDialogProps {
    images: ImageItem[]
    sendStates: Record<string, SendState>
    onClose: () => void
    onRetry: () => void
}

export function SendDialog({ images, sendStates, onClose, onRetry }: SendDialogProps) {
    const statuses = images.map((image) => sendStates[image.id].status)
    const failedCount = statuses.filter((status) => status === "error").length
    const isSending = statuses.some((status) => status === "queued" || status === "sending")

    return (
        <Dialog open maxWidth={"sm"} fullWidth>
            <DialogTitle>Sending Annotations</DialogTitle>
            <DialogContent>
                <List>
                    {images.map((image, index) => {
                        const { status, errorMessage } = sendStates[image.id]
                        return (
                            <ListItem key={image.id} divider={index < images.length - 1}>
                                <ListItemText
                                    primary={stripExtension(image.file.name)}
                                    secondary={errorMessage}
                                    slotProps={{ secondary: { color: "error" } }}
                                />
                                <StatusChip status={status} />
                            </ListItem>
                        )
                    })}
                </List>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button onClick={onClose} disabled={isSending}>
                        Close
                    </Button>
                    {failedCount > 0 && (
                        <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry} disabled={isSending}>
                            Retry failed ({failedCount})
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    )
}
