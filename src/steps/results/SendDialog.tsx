import type { ImageItem, SendState, SendStatus } from "../../types.ts"
import {
    Box,
    Button,
    Chip,
    type ChipProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
} from "@mui/material"
import type { ReactElement } from "react"
import CheckIcon from "@mui/icons-material/Check"
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined"
import { stripExtension } from "../../utils/format.ts"
import RefreshIcon from "@mui/icons-material/Refresh"

const SEND_CHIPS: Record<SendStatus, { label: string; color: ChipProps["color"]; icon?: ReactElement }> = {
    queued: { label: "Queued", color: "default" },
    sending: { label: "Sending", color: "primary" },
    sent: { label: "Sent", color: "success", icon: <CheckIcon /> },
    error: { label: "Error", color: "error", icon: <ErrorOutlinedIcon /> },
}

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
                        const chip = SEND_CHIPS[status]
                        return (
                            <ListItem key={image.id} divider={index < images.length - 1}>
                                <ListItemText
                                    primary={stripExtension(image.file.name)}
                                    secondary={errorMessage}
                                    slotProps={{ secondary: { color: "error" } }}
                                />
                                <Chip label={chip.label} color={chip.color} icon={chip.icon} />
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
