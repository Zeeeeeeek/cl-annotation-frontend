import type { Detection, Emphasis, ImageItem } from "../../types"
import { DetectionBox } from "./DetectionBox"
import { filterByThreshold, getDetectionIndexes } from "../../utils/detections"
import { ImageViewer } from "../../components/ImageViewer.tsx"

interface AnnotatedImageProps {
    image: ImageItem
    confidenceThreshold: number
    colorForLabel: (label: string) => string
    hoveredDetectionId: string | null
}

export function AnnotatedImage({ image, confidenceThreshold, colorForLabel, hoveredDetectionId }: AnnotatedImageProps) {
    const shownDetections = filterByThreshold(image.detections, confidenceThreshold).filter(
        (detection) => detection.visible,
    )

    const isEmphasized = (detection: Detection) => detection.highlighted || detection.id === hoveredDetectionId
    const hasEmphasis = shownDetections.some(isEmphasized)

    function getEmphasis(detection: Detection): Emphasis {
        if (isEmphasized(detection)) return "highlighted"
        return hasEmphasis ? "dimmed" : "normal"
    }

    // Konva draws in render order: emphasized boxes go last so they stay on top
    const orderedDetections = [...shownDetections].sort((a, b) => Number(isEmphasized(a)) - Number(isEmphasized(b)))
    const detectionIndexes = getDetectionIndexes(image.detections)
    return (
        <ImageViewer
            imageUrl={image.previewUrl}
            renderOverlay={(scale) =>
                orderedDetections.map((detection) => (
                    <DetectionBox
                        key={detection.id}
                        detection={detection}
                        color={colorForLabel(detection.label)}
                        emphasis={getEmphasis(detection)}
                        viewScale={scale}
                        detectionIndex={detectionIndexes.get(detection.id) ?? 0}
                    />
                ))
            }
        />
    )
}
