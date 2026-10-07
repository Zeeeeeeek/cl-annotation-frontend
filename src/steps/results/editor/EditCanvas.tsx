import type { Detection, Emphasis } from "../../../types.ts"
import { getDetectionIndexes } from "../../../utils/detections.ts"
import { DetectionBox } from "../DetectionBox.tsx"
import { ImageViewer } from "../../../components/ImageViewer.tsx"

interface EditCanvasProps {
    imageUrl: string
    detections: Detection[]
    selectedId: string | null
    colorForLabel: (label: string) => string
}

export function EditCanvas({ imageUrl, detections, selectedId, colorForLabel }: EditCanvasProps) {
    const shownDetections = detections.filter((detection) => detection.visible)

    function getEmphasis(emphasis: Detection): Emphasis {
        if (emphasis.id === selectedId) return "highlighted"
        return "normal"
    }

    const orderedDetections = [...shownDetections].sort(
        (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
    )
    const detectionIndexes = getDetectionIndexes(detections)

    return (
        <ImageViewer
            imageUrl={imageUrl}
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
