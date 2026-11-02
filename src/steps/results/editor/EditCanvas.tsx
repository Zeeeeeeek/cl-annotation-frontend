import type { BoundingBox, Detection, EditMode } from "../../../types.ts"
import { getDetectionIndexes, sortByDrawingOrder } from "../../../utils/detections.ts"
import { ImageViewer } from "../../../components/ImageViewer.tsx"
import { EditableBox } from "./EditableBox.tsx"
import { Rect } from "react-konva"
import { DraftSizeLabel } from "./DraftSizeLabel.tsx"
import { NewBoxDialog } from "./NewBoxDialog.tsx"
import { useBoxDrawing } from "../../../hooks/useBoxDrawing.ts"

interface EditCanvasProps {
    imageUrl: string
    detections: Detection[]
    selectedId: string | null
    onSelect: (id: string | null) => void
    colorForLabel: (label: string) => string
    onBoxUpdate: (detectionId: string, updatedBox: BoundingBox) => void
    mode: EditMode
    onBoxCreate: (box: BoundingBox, label: string) => void
    labels: string[]
}

export function EditCanvas({
    imageUrl,
    detections,
    selectedId,
    colorForLabel,
    onSelect,
    onBoxUpdate,
    mode,
    onBoxCreate,
    labels,
}: EditCanvasProps) {
    const { previewBox, pendingBox, startDrawing, updateDrawing, finishDrawing, confirmPendingBox, cancelPendingBox } =
        useBoxDrawing(mode === "Draw", onBoxCreate)

    const shownDetections = detections.filter((detection) => detection.visible)
    const orderedDetections = sortByDrawingOrder(shownDetections, selectedId)
    const detectionIndexes = getDetectionIndexes(detections)
    return (
        <>
            <ImageViewer
                imageUrl={imageUrl}
                onBackgroundClick={() => onSelect(null)}
                panEnabled={mode === "Pan"}
                cursor={mode === "Draw" ? "crosshair" : undefined}
                onImageMouseDown={startDrawing}
                onImageMouseMove={updateDrawing}
                onImageMouseUp={finishDrawing}
                renderOverlay={(scale, imageSize) =>
                    orderedDetections.map((detection) => (
                        <EditableBox
                            key={detection.id}
                            detection={detection}
                            detectionIndex={detectionIndexes.get(detection.id) ?? 0}
                            color={colorForLabel(detection.label)}
                            isSelected={detection.id === selectedId}
                            viewScale={scale}
                            onSelect={onSelect}
                            onBoxUpdate={onBoxUpdate}
                            isInteractive={mode === "Select"}
                            imageSize={imageSize}
                        />
                    ))
                }
                renderTopOverlay={(scale) =>
                    previewBox && (
                        <>
                            <Rect
                                {...previewBox}
                                stroke="white"
                                strokeWidth={2}
                                strokeScaleEnabled={false}
                                dash={[6, 4]}
                                fill="rgba(255, 255, 255, 0.2)"
                                listening={false}
                            />
                            <DraftSizeLabel draftBox={previewBox} scale={scale} />
                        </>
                    )
                }
            />
            {pendingBox && <NewBoxDialog onCancel={cancelPendingBox} onAdd={confirmPendingBox} labels={labels} />}
        </>
    )
}
