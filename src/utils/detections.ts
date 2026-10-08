import type { DetectedBox, Detection, ImageItem } from "../types"

export function createImageItem(file: File): ImageItem {
    return {
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "queued",
        detections: [],
        edited: false,
    }
}

export function toDetections(detectedBoxes: DetectedBox[]): Detection[] {
    return [...detectedBoxes]
        .sort((a, b) => b.confidence - a.confidence)
        .map((detectedBox): Detection => {
            return { ...detectedBox, id: crypto.randomUUID(), visible: true, highlighted: false }
        })
}

export function filterByThreshold(detections: Detection[], threshold: number): Detection[] {
    return detections.filter((detection) => detection.confidence >= threshold)
}

export function getDetectionIndexes(detections: Detection[]): Map<string, number> {
    const labelCountMap = new Map<string, number>()
    const detectionIndexMap = new Map<string, number>()

    detections.forEach((detection) => {
        const index = (labelCountMap.get(detection.label) ?? 0) + 1
        labelCountMap.set(detection.label, index)
        detectionIndexMap.set(detection.id, index)
    })
    return detectionIndexMap
}

export function getBoxArea(box: Detection["box"]): number {
    return box.width * box.height
}
