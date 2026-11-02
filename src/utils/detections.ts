import type {BoundingBox, DetectedBox, Detection, ImageItem, Point, Size} from "../types"
import {clamp} from "./math.ts";

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

export function createDetection(detectedBox: DetectedBox): Detection {
    return { ...detectedBox, id: crypto.randomUUID(), visible: true, highlighted: false }
}

export function toDetections(detectedBoxes: DetectedBox[]): Detection[] {
    return [...detectedBoxes].sort((a, b) => b.confidence - a.confidence).map(createDetection)
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

export function boxFromPoints(start: Point, end: Point): BoundingBox {
    return {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    }
}

// Larger boxes first, so smaller ones are drawn on top and stay clickable
export function sortByDrawingOrder(detections: Detection[], selectedId: string | null): Detection[] {
    const areaDiff = (a: Detection, b: Detection) => getBoxArea(b.box) - getBoxArea(a.box)
    const selectionDiff = (a: Detection, b: Detection) => Number(a.id === selectedId) - Number(b.id === selectedId)

    return [...detections].sort((a, b) => areaDiff(a, b) || selectionDiff(a, b))
}

export function toSavedDetections(detections: Detection[]): Detection[] {
    return detections.map((detection) => ({ ...detection, visible: true, confidence: 1 }))
}

// Cuts off the parts of the box that fall outside the image
export function clampBoxToImage(box: BoundingBox, imageSize: Size): BoundingBox {
    const x = clamp(box.x, 0, imageSize.width)
    const y = clamp(box.y, 0, imageSize.height)
    return {
        x,
        y,
        width: Math.min(box.x + box.width, imageSize.width) - x,
        height: Math.min(box.y + box.height, imageSize.height) - y,
    }
}