import { Box, Fab } from "@mui/material"
import { useState } from "react"
import type { Detection, ImageItem } from "../../types"
import { AnnotatedImage } from "./AnnotatedImage"
import { ControlPanel } from "./panel/ControlPanel"
import { useLabelColors } from "../../hooks/useLabelColors"
import { EditDialog } from "./editor/EditDialog.tsx"
import SendIcon from "@mui/icons-material/Send"
import { ImageStatusChip } from "./ImageStatusChip.tsx"
import { SendDialog } from "./SendDialog.tsx"
import { filterByThreshold, isWaitingToBeSent, toSavedDetections } from "../../utils/detections.ts"
import { useSendAnnotations } from "../../hooks/useSendAnnotations.ts"
import { updateById } from "../../utils/arrays.ts"

interface ResultsStepProps {
    images: ImageItem[]
    onImageUpdate: (id: string, changes: Partial<ImageItem>) => void
    onReset: () => void
    labels: string[]
    onAddLabel: (newLabel: string) => void
}

export function ResultsStep({ images, onImageUpdate, onReset, labels, onAddLabel }: ResultsStepProps) {
    const { colorForLabel, setColorForLabel } = useLabelColors()
    const { sendStates, sendingImages, send, retry, clearSendStates } = useSendAnnotations(images, onImageUpdate)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.9)
    const [hoveredDetectionId, setHoveredDetectionId] = useState<string | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    const selectedImage = images[selectedIndex]
    const modifiedCount = images.filter((image) => isWaitingToBeSent(image)).length
    const editorImage = {
        ...selectedImage,
        detections: filterByThreshold(selectedImage.detections, confidenceThreshold),
    }

    function updateDetection(detectionId: string, changes: Partial<Detection>) {
        onImageUpdate(selectedImage.id, {
            detections: updateById(selectedImage.detections, detectionId, changes),
        })
    }

    function handleToggleVisibility(detection: Detection) {
        updateDetection(detection.id, { visible: !detection.visible })
    }

    function handleToggleHighlight(detection: Detection) {
        updateDetection(detection.id, { highlighted: !detection.highlighted })
    }

    function handleImageEdit() {
        setIsEditorOpen(true)
    }

    function handleEditorSave(updatedDetections: Detection[]) {
        onImageUpdate(selectedImage.id, {
            detections: toSavedDetections(updatedDetections),
            edited: true,
            sent: false,
        })
        setIsEditorOpen(false)
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateRows: "minmax(0, 1fr) auto",
                gridTemplateColumns: "minmax(0, 1fr)",
                height: "100vh",
            }}
        >
            <Box sx={{ position: "relative", minHeight: 0 }}>
                <AnnotatedImage
                    key={selectedImage.id}
                    image={selectedImage}
                    confidenceThreshold={confidenceThreshold}
                    colorForLabel={colorForLabel}
                    hoveredDetectionId={hoveredDetectionId}
                />
                {modifiedCount > 0 && (
                    <Fab
                        variant="extended"
                        color="primary"
                        sx={{ position: "absolute", bottom: "1rem", right: "1rem" }}
                        onClick={send}
                    >
                        <SendIcon sx={{ mr: 1 }} />
                        Send {modifiedCount} {modifiedCount === 1 ? "image" : "images"}
                    </Fab>
                )}
                <Box sx={{ position: "absolute", top: "1rem", left: "1rem" }}>
                    <ImageStatusChip edited={selectedImage.edited} sent={selectedImage.sent} />
                </Box>
            </Box>
            <ControlPanel
                confidenceThreshold={confidenceThreshold}
                onConfidenceThresholdChange={setConfidenceThreshold}
                currentIndex={selectedIndex}
                totalResults={images.length}
                onIndexChange={setSelectedIndex}
                detections={selectedImage.detections}
                onToggleVisibility={handleToggleVisibility}
                colorForLabel={colorForLabel}
                setColorForLabel={setColorForLabel}
                onReset={onReset}
                onToggleHighlight={handleToggleHighlight}
                onDetectionHover={setHoveredDetectionId}
                onImageEdit={handleImageEdit}
                editedImages={images.map((image) => image.edited)}
                sentImages={images.map((image) => image.sent)}
            />
            {isEditorOpen && selectedImage && (
                <EditDialog
                    image={editorImage}
                    imageIndex={selectedIndex + 1}
                    totalImages={images.length}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleEditorSave}
                    colorForLabel={colorForLabel}
                    labels={labels}
                    onAddLabel={onAddLabel}
                />
            )}
            {sendStates && (
                <SendDialog images={sendingImages} sendStates={sendStates} onClose={clearSendStates} onRetry={retry} />
            )}
        </Box>
    )
}
