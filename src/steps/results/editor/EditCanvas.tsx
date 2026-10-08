import type { Detection } from "../../../types.ts"
import { getDetectionIndexes } from "../../../utils/detections.ts"
import { ImageViewer } from "../../../components/ImageViewer.tsx"
import { EditableBox } from "./EditableBox.tsx"

interface EditCanvasProps {
    imageUrl: string
    detections: Detection[]
    selectedId: string | null
    setSelectedId: (id: string | null) => void
    colorForLabel: (label: string) => string
}

export function EditCanvas({ imageUrl, detections, selectedId, colorForLabel, setSelectedId }: EditCanvasProps) {
    const shownDetections = detections.filter((detection) => detection.visible)

    const orderedDetections = [...shownDetections].sort(
        (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
    )
    const detectionIndexes = getDetectionIndexes(detections)

    return (
        <ImageViewer
            imageUrl={imageUrl}
            onBackGroundClick={() => setSelectedId(null)}
            renderOverlay={(scale) =>
                orderedDetections.map((detection) => (
                    <EditableBox
                        key={detection.id}
                        detection={detection}
                        detectionIndex={detectionIndexes.get(detection.id) ?? 0}
                        color={colorForLabel(detection.label)}
                        isSelected={detection.id === selectedId}
                        viewScale={scale}
                        onSelect={() => setSelectedId(detection.id)}
                    />
                ))
            }
        />
    )
}
