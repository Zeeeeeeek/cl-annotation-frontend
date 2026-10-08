import type { Detection } from "../../../types.ts"
import { getBoxArea, getDetectionIndexes } from "../../../utils/detections.ts"
import { ImageViewer } from "../../../components/ImageViewer.tsx"
import { EditableBox } from "./EditableBox.tsx"

interface EditCanvasProps {
    imageUrl: string
    detections: Detection[]
    selectedId: string | null
    setSelectedId: (id: string | null) => void
    colorForLabel: (label: string) => string
    onBoxUpdate: (detectionId: string, updatedBox: Detection["box"]) => void
}

export function EditCanvas({
    imageUrl,
    detections,
    selectedId,
    colorForLabel,
    setSelectedId,
    onBoxUpdate,
}: EditCanvasProps) {
    const shownDetections = detections.filter((detection) => detection.visible)

    const selectionDiff = (a: Detection, b: Detection): number =>
        Number(a.id === selectedId) - Number(b.id === selectedId)

    const areaDiff = (a: Detection, b: Detection): number => getBoxArea(b.box) - getBoxArea(a.box)

    const orderedDetections = [...shownDetections].sort((a, b) => areaDiff(a, b) || selectionDiff(a, b))
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
                        onBoxUpdate={(updatedBox) => {
                            onBoxUpdate(detection.id, updatedBox)
                        }}
                    />
                ))
            }
        />
    )
}
