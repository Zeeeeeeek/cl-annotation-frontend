import type { Detection } from "../types.ts"
import { useState } from "react"

export function useDetectionHistory(initialDetections: Detection[]) {
    const [detections, setDetections] = useState<Detection[]>(initialDetections)
    const [past, setPast] = useState<Detection[][]>([])
    const [future, setFuture] = useState<Detection[][]>([])

    const canUndo = past.length > 0
    const canRedo = future.length > 0

    function changeDetections(update: (prev: Detection[]) => Detection[]) {
        setPast([...past, detections])
        setDetections(update)
        setFuture([])
    }

    function undo() {
        const previous = past.at(-1)
        if (!previous) return
        setPast(past.slice(0, -1))
        setFuture([detections, ...future])
        setDetections(previous)
    }

    function redo() {
        const next = future[0]
        if (!next) return
        setFuture(future.slice(1))
        setPast([...past, detections])
        setDetections(next)
    }

    return { detections, changeDetections, undo, redo, canUndo, canRedo }
}
