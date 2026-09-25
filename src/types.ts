export interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
}

export interface DetectedBox {
    box: BoundingBox
    label: string
    confidence: number
}

export type ImageStatus = "queued" | "processing" | "completed" | "error"

export interface ImageResult {
    file: File
    status: ImageStatus
    detections: DetectedBox[]
    errorMessage?: string
}