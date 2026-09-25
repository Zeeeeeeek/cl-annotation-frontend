import type { DetectedBox, Detection, ImageItem } from "../types"

export function createImageItem(file: File): ImageItem {
    return {
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "queued",
        detections: [],
    }
}

export function toDetections(detectedBoxes: DetectedBox[]): Detection[] {
    const countByLabel = new Map<string, number>()

    return [...detectedBoxes]
        .sort((a, b) => b.confidence - a.confidence)
        .map(detectedBox => {
            const index = (countByLabel.get(detectedBox.label) ?? 0) + 1
            countByLabel.set(detectedBox.label, index)
            return { ...detectedBox, id: crypto.randomUUID(), index, visible: true }
        })
}

export function filterByThreshold(detections: Detection[], threshold: number): Detection[] {
    return detections.filter((detection) => detection.confidence >= threshold)
}
