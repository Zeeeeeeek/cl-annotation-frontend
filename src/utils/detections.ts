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

export function toDetection(detectedBox: DetectedBox): Detection {
    return {
        ...detectedBox,
        id: crypto.randomUUID(),
        visible: true,
    }
}

export function filterByThreshold(detections: Detection[], threshold: number): Detection[] {
    return detections.filter(detection => detection.confidence >= threshold)
}