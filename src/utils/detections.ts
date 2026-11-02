import type { BoundingBox, DetectedBox, Detection, ImageItem } from "../types"

export function createImageItem(file: File): ImageItem {
    return {
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "queued",
        detections: [],
        edited: false,
        sent: false,
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

export function getBoxArea(box: BoundingBox): number {
    return box.width * box.height
}

function isSameBox(box1: BoundingBox, box2: BoundingBox): boolean {
    const epsilon = 0.01

    return (
        Math.abs(box1.x - box2.x) < epsilon &&
        Math.abs(box1.y - box2.y) < epsilon &&
        Math.abs(box1.width - box2.width) < epsilon &&
        Math.abs(box1.height - box2.height) < epsilon
    )
}

export function haveDetectionsChanged(original: Detection[], current: Detection[]): boolean {
    if (original.length !== current.length) return true

    return original.some((originalDetection) => {
        const currentDetection = current.find((detection) => detection.id === originalDetection.id)
        if (!currentDetection) return true

        return (
            currentDetection.label !== originalDetection.label ||
            !isSameBox(originalDetection.box, currentDetection.box)
        )
    })
}

export function isWaitingToBeSent(image: ImageItem): boolean {
    return image.edited && !image.sent
}
