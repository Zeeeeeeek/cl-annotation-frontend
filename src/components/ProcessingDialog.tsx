import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { detect } from "../api/client"
import type { ImageResult } from "../types"
import { StatusChip } from "./StatusChip"
import { stripExtension } from "../utils/format"

interface ProcessingDialogProps {
    images: FileList
    onViewResults: (results: ImageResult[]) => void
}

export function ProcessingDialog({ images, onViewResults }: ProcessingDialogProps) {
    const isMounted = useRef(false)

    const [imageResults, setImageResults] = useState<ImageResult[]>(() =>
        Array.from(images).map(file => ({ file, status: "queued", detections: [] })),
    )

    useEffect(() => {
        if (isMounted.current) return
        isMounted.current = true

        function updateImage(index: number, changes: Partial<ImageResult>) {
            setImageResults(prev => prev.map((image, i) => (i === index ? { ...image, ...changes } : image)))
        }

        async function runProcessing() {
            for (let index = 0; index < imageResults.length; index++) {
                updateImage(index, { status: "processing" })
                try {
                    const detections = await detect(imageResults[index].file)
                    updateImage(index, { status: "completed", detections })
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Unknown error"
                    updateImage(index, { status: "error", errorMessage })
                }
            }
        }

        void runProcessing()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const isProcessingDone = imageResults.every(image => image.status === "completed" || image.status === "error")

    return (
        <Dialog open maxWidth="sm" fullWidth>
            <DialogTitle>Processing images</DialogTitle>
            <DialogContent>
                <List>
                    {imageResults.map((imageResult, index) => (
                        <ListItem key={index} divider={index < imageResults.length - 1}>
                            <ListItemText primary={stripExtension(imageResult.file.name)} />
                            <StatusChip status={imageResult.status} />
                        </ListItem>
                    ))}
                </List>
                <Button
                    fullWidth
                    loading={!isProcessingDone}
                    loadingPosition="end"
                    variant="contained"
                    onClick={() => onViewResults(imageResults)}
                >
                    View Results
                </Button>
            </DialogContent>
        </Dialog>
    )
}