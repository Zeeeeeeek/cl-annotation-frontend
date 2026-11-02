import type { BoundingBox, Point } from "../types.ts"
import { useState } from "react"
import { boxFromPoints } from "../utils/detections.ts"

const MIN_BOX_SIZE = 4

export function useBoxDrawing(isDrawMode: boolean, onBoxCreate: (box: BoundingBox, label: string) => void) {
    const [draft, setDraft] = useState<{ start: Point; end: Point } | null>(null)
    const [pendingBox, setPendingBox] = useState<BoundingBox | null>(null)

    const draftBox = draft ? boxFromPoints(draft.start, draft.end) : null
    const previewBox = draftBox ?? pendingBox

    function startDrawing(point: Point) {
        if (!isDrawMode) return
        setPendingBox(null)
        setDraft({ start: point, end: point })
    }

    function updateDrawing(point: Point) {
        if (!isDrawMode || !draft) return
        setDraft({ start: draft.start, end: point })
    }

    function finishDrawing() {
        if (!isDrawMode || !draftBox) return
        if (draftBox.width >= MIN_BOX_SIZE && draftBox.height >= MIN_BOX_SIZE) {
            setPendingBox(draftBox)
        }
        setDraft(null)
    }

    function confirmPendingBox(label: string) {
        if (!pendingBox) return
        onBoxCreate(pendingBox, label)
        setPendingBox(null)
    }

    function cancelPendingBox() {
        setPendingBox(null)
    }

    return { previewBox, pendingBox, startDrawing, updateDrawing, finishDrawing, confirmPendingBox, cancelPendingBox }
}
