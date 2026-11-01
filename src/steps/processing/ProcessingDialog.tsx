import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material"
import type { ImageItem } from "../../types"
import { StatusChip } from "../../components/StatusChip"
import { stripExtension } from "../../utils/format"
import ReplayIcon from "@mui/icons-material/Replay"

interface ProcessingDialogProps {
    images: ImageItem[]
    onViewResults: () => void
    onReset: () => void
}

export function ProcessingDialog({ images, onViewResults, onReset }: ProcessingDialogProps) {
    const isProcessingDone = images.every((image) => image.status === "completed" || image.status === "error")
    const hasResults = images.some((image) => image.status === "completed")
    return (
        <Dialog open maxWidth="sm" fullWidth>
            <DialogTitle>Processing images</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <List sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                    {images.map((image, index) => (
                        <ListItem key={image.id} divider={index < images.length - 1}>
                            <ListItemText
                                primary={stripExtension(image.file.name)}
                                secondary={image.errorMessage}
                                slotProps={{ secondary: { color: "error" } }}
                            />
                            <StatusChip status={image.status} />
                        </ListItem>
                    ))}
                </List>
                {isProcessingDone && !hasResults ? (
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<ReplayIcon />}
                        onClick={onReset}
                        sx={{ mt: 2, flexShrink: 0 }}
                    >
                        Start over
                    </Button>
                ) : (
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
                )}
            </DialogContent>
        </Dialog>
    )
}
