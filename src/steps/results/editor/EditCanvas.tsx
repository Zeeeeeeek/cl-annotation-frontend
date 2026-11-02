import type { BoundingBox, Detection, EditMode, Point } from "../../../types.ts"
import { boxFromPoints, getDetectionIndexes, sortByDrawingOrder } from "../../../utils/detections.ts"
import { ImageViewer } from "../../../components/ImageViewer.tsx"
import { EditableBox } from "./EditableBox.tsx"
import { useState } from "react"
import { Rect } from "react-konva"
import { DraftSizeLabel } from "./DraftSizeLabel.tsx"
import { NewBoxDialog } from "./NewBoxDialog.tsx"

const MIN_BOX_SIZE = 4

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
    const [draft, setDraft] = useState<{ start: Point; end: Point } | null>(null)
    const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null)

    const shownDetections = detections.filter((detection) => detection.visible)
    const orderedDetections = sortByDrawingOrder(shownDetections, selectedId)
    const detectionIndexes = getDetectionIndexes(detections)
    const draftBox = draft ? boxFromPoints(draft.start, draft.end) : null
    const previewBox = draftBox ?? pendingBox
    return (
        <>
            <ImageViewer
                imageUrl={imageUrl}
                onBackgroundClick={() => onSelect(null)}
                panEnabled={mode === "Pan"}
                cursor={mode === "Draw" ? "crosshair" : undefined}
                onImageMouseDown={(point) => {
                    if (mode === "Draw") {
                        setPendingBox(null)
                        setDraft({ start: point, end: point })
                    }
                }}
                onImageMouseMove={(point) => {
                    if (draft && mode === "Draw") {
                        setDraft({ start: draft.start, end: point })
                    }
                }}
                onImageMouseUp={() => {
                    if (draft && mode === "Draw") {
                        if (draftBox && draftBox.width >= MIN_BOX_SIZE && draftBox.height >= MIN_BOX_SIZE) {
                            setPendingBox(draftBox)
                        }
                        setDraft(null)
                    }
                }}
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
            {pendingBox && (
                <NewBoxDialog
                    onCancel={() => {
                        setPendingBox(null)
                    }}
                    onAdd={(label) => {
                        onBoxCreate(pendingBox, label)
                        setPendingBox(null)
                    }}
                    labels={labels}
                />
            )}
        </>
    )
}
