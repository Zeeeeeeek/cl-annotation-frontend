import {Box} from "@mui/material"
import {useState} from "react"
import type {Detection, ImageItem} from "../../types"
import {AnnotatedImage} from "./AnnotatedImage"
import {ControlPanel} from "./panel/ControlPanel"
import {useLabelColors} from "../../hooks/useLabelColors"
import {EditDialog} from "./editor/EditDialog.tsx"

interface ResultsStepProps {
    images: ImageItem[]
    onImageUpdate: (id: string, changes: Partial<ImageItem>) => void
    onReset: () => void
}

export function ResultsStep({images, onImageUpdate, onReset}: ResultsStepProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.9)
    const {colorForLabel, setColorForLabel} = useLabelColors()

    const selectedImage = images[selectedIndex]

    const [hoveredDetectionId, setHoveredDetectionId] = useState<string | null>(null)

    function updateDetection(detectionId: string, changes: Partial<Detection>) {
        onImageUpdate(selectedImage.id, {
            detections: selectedImage.detections.map((detection) =>
                detection.id === detectionId ? {...detection, ...changes} : detection,
            ),
        })
    }

    function handleToggleVisibility(detection: Detection) {
        updateDetection(detection.id, {visible: !detection.visible})
    }

    function handleToggleHighlight(detection: Detection) {
        updateDetection(detection.id, {highlighted: !detection.highlighted})
    }

    const [openEditDialog, setOpenEditDialog] = useState(false)

    function onImageEdit() {
        setOpenEditDialog((prevState) => !prevState)
    }

    return (
        <Box sx={{display: "grid", gridTemplateRows: "minmax(0, 1fr) auto", height: "100vh"}}>
            <AnnotatedImage
                key={selectedImage.id}
                image={selectedImage}
                confidenceThreshold={confidenceThreshold}
                colorForLabel={colorForLabel}
                hoveredDetectionId={hoveredDetectionId}
            />
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
            />
            {openEditDialog && selectedImage && <EditDialog
                image={selectedImage}
                imageIndex={selectedIndex + 1}
                totalImages={images.length}
                onClose={() => setOpenEditDialog(false)}
                onSave={(updatedDetections) => {
                    onImageUpdate(selectedImage.id, {
                        detections: updatedDetections.map((detection) => ({...detection, visible: true})),
                        edited: true,
                    })
                    setOpenEditDialog(false)
                }}
                colorForLabel={colorForLabel}
            />}
        </Box>
    )
}
