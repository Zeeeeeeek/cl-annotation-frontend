import { Button, Dialog, DialogContent, DialogTitle, List } from "@mui/material"
import type { ImageItem } from "../../types"
import ReplayIcon from "@mui/icons-material/Replay"
import { ImageStatusItem } from "../../components/ImageStatusItem.tsx"

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
                        <ImageStatusItem
                            key={image.id}
                            fileName={image.file.name}
                            status={image.status}
                            errorMessage={image.errorMessage}
                            hasDivider={index < images.length - 1}
                        />
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
