import { Box, Fab } from "@mui/material"
import { useState } from "react"
import type { Detection, ImageItem } from "../../types"
import { AnnotatedImage } from "./AnnotatedImage"
import { ControlPanel } from "./panel/ControlPanel"
import { useLabelColors } from "../../hooks/useLabelColors"
import { EditDialog } from "./editor/EditDialog.tsx"
import SendIcon from "@mui/icons-material/Send"
import { ImageStatusChip } from "./ImageStatusChip.tsx"

interface ResultsStepProps {
    images: ImageItem[]
    onImageUpdate: (id: string, changes: Partial<ImageItem>) => void
    onReset: () => void
    labels: string[]
    onAddLabel: (newLabel: string) => void
}

export function ResultsStep({ images, onImageUpdate, onReset, labels, onAddLabel }: ResultsStepProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.9)
    const { colorForLabel, setColorForLabel } = useLabelColors()

    const selectedImage = images[selectedIndex]

    const [hoveredDetectionId, setHoveredDetectionId] = useState<string | null>(null)

    function updateDetection(detectionId: string, changes: Partial<Detection>) {
        onImageUpdate(selectedImage.id, {
            detections: selectedImage.detections.map((detection) =>
                detection.id === detectionId ? { ...detection, ...changes } : detection,
            ),
        })
    }

    function handleToggleVisibility(detection: Detection) {
        updateDetection(detection.id, { visible: !detection.visible })
    }

    function handleToggleHighlight(detection: Detection) {
        updateDetection(detection.id, { highlighted: !detection.highlighted })
    }

    const [openEditDialog, setOpenEditDialog] = useState(false)

    function onImageEdit() {
        setOpenEditDialog((prevState) => !prevState)
    }

    const modifiedCount = images.filter((image) => image.edited && !image.sent).length

    return (
        <Box sx={{ display: "grid", gridTemplateRows: "minmax(0, 1fr) auto", height: "100vh" }}>
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
                onImageEdit={onImageEdit}
                editedImages={images.map((image) => image.edited)}
                sentImages={images.map((image) => image.sent)}
            />
            {openEditDialog && selectedImage && (
                <EditDialog
                    image={selectedImage}
                    imageIndex={selectedIndex + 1}
                    totalImages={images.length}
                    onClose={() => setOpenEditDialog(false)}
                    onSave={(updatedDetections) => {
                        onImageUpdate(selectedImage.id, {
                            detections: updatedDetections.map((detection) => ({
                                ...detection,
                                visible: true,
                                confidence: 1,
                            })),
                            edited: true,
                            sent: false,
                        })
                        setOpenEditDialog(false)
                    }}
                    colorForLabel={colorForLabel}
                    labels={labels}
                    onAddLabel={onAddLabel}
                />
            )}
        </Box>
    )
}
