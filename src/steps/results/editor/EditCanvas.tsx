import type { BoundingBox, Detection, EditMode } from "../../../types.ts"
import { getBoxArea, getDetectionIndexes } from "../../../utils/detections.ts"
import { ImageViewer } from "../../../components/ImageViewer.tsx"
import { EditableBox } from "./EditableBox.tsx"
import { type Point } from "../../../hooks/useZoom.ts"
import { useState } from "react"
import { Rect } from "react-konva"
import { DraftSizeLabel } from "./DraftSizeLabel.tsx"
import { NewBoxDialog } from "./NewBoxDialog.tsx"

const MIN_BOX_SIZE = 4

interface EditCanvasProps {
    imageUrl: string
    detections: Detection[]
    selectedId: string | null
    setSelectedId: (id: string | null) => void
    colorForLabel: (label: string) => string
    onBoxUpdate: (detectionId: string, updatedBox: Detection["box"]) => void
    mode: EditMode
    onBoxCreate: (box: BoundingBox, label: string) => void
}

export function EditCanvas({
    imageUrl,
    detections,
    selectedId,
    colorForLabel,
    setSelectedId,
    onBoxUpdate,
    mode,
    onBoxCreate,
}: EditCanvasProps) {
    const shownDetections = detections.filter((detection) => detection.visible)

    const selectionDiff = (a: Detection, b: Detection): number =>
        Number(a.id === selectedId) - Number(b.id === selectedId)

    const areaDiff = (a: Detection, b: Detection): number => getBoxArea(b.box) - getBoxArea(a.box)

    const orderedDetections = [...shownDetections].sort((a, b) => areaDiff(a, b) || selectionDiff(a, b))
    const detectionIndexes = getDetectionIndexes(detections)

    const [draft, setDraft] = useState<{ start: Point; end: Point } | null>(null)

    const draftBox = draft && {
        x: Math.min(draft.start.x, draft.end.x),
        y: Math.min(draft.start.y, draft.end.y),
        width: Math.abs(draft.end.x - draft.start.x),
        height: Math.abs(draft.end.y - draft.start.y),
    }

    const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null)
    const showBox = draftBox ?? pendingBox
    return (
        <>
            <ImageViewer
                imageUrl={imageUrl}
                onBackGroundClick={() => setSelectedId(null)}
                panEnabled={mode === "Select"}
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
                renderOverlay={(scale) =>
                    orderedDetections.map((detection) => (
                        <EditableBox
                            key={detection.id}
                            detection={detection}
                            detectionIndex={detectionIndexes.get(detection.id) ?? 0}
                            color={colorForLabel(detection.label)}
                            isSelected={detection.id === selectedId}
                            viewScale={scale}
                            onSelect={setSelectedId}
                            onBoxUpdate={onBoxUpdate}
                            interactive={mode === "Select"}
                        />
                    ))
                }
                renderTopOverlay={(scale) =>
                    showBox && (
                        <>
                            <Rect
                                {...showBox}
                                stroke="white"
                                strokeWidth={2}
                                strokeScaleEnabled={false}
                                dash={[6, 4]}
                                fill="rgba(255, 255, 255, 0.2)"
                                listening={false}
                            />
                            <DraftSizeLabel draftBox={showBox} scale={scale} />
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
                />
            )}
        </>
    )
}
