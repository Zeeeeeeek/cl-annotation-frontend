import { Box } from "@mui/material"
import { useState } from "react"
import type { ImageItem } from "../../types"
import { AnnotatedImage } from "./AnnotatedImage"
import { ControlPanel } from "./panel/ControlPanel"
import { useLabelColors } from "../../hooks/useLabelColors"

interface ResultsStepProps {
    images: ImageItem[]
    onImageUpdate: (id: string, changes: Partial<ImageItem>) => void
    onReset: () => void
}

export function ResultsStep({ images, onImageUpdate, onReset }: ResultsStepProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.9)
    const { colorForLabel, setColorForLabel } = useLabelColors()

    const selectedImage = images[selectedIndex]

    function handleToggleVisibility(detectionId: string) {
        onImageUpdate(selectedImage.id, {
            detections: selectedImage.detections.map(detection =>
                detection.id === detectionId ? { ...detection, visible: !detection.visible } : detection,
            ),
        })
    }

    return (
        <Box sx={{ display: "grid", gridTemplateRows: "1fr auto", height: "100vh" }}>
            <AnnotatedImage
                image={selectedImage}
                confidenceThreshold={confidenceThreshold}
                colorForLabel={colorForLabel}
                maxWidth={Math.min(800, window.innerWidth)}
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
            />
        </Box>
    )
}