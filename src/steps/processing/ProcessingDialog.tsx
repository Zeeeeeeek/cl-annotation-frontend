import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material"
import type { ImageItem } from "../../types"
import { StatusChip } from "../../components/StatusChip"
import { stripExtension } from "../../utils/format"

interface ProcessingDialogProps {
    images: ImageItem[]
    onViewResults: () => void
}

export function ProcessingDialog({ images, onViewResults }: ProcessingDialogProps) {
    const isProcessingDone = images.every((image) => image.status === "completed" || image.status === "error")

    return (
        <Dialog open maxWidth="sm" fullWidth>
            <DialogTitle>Processing images</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <List sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                    {images.map((image, index) => (
                        <ListItem key={image.id} divider={index < images.length - 1}>
                            <ListItemText primary={stripExtension(image.file.name)} />
                            <StatusChip status={image.status} />
                        </ListItem>
                    ))}
                </List>
                <Button
                    fullWidth
                    loading={!isProcessingDone}
                    loadingPosition="end"
                    variant="contained"
                    onClick={onViewResults}
                    sx={{ mt: 2, flexShrink: 0 }}
                >
                    View Results
                </Button>
            </DialogContent>
        </Dialog>
    )
}
