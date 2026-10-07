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

export type Emphasis = "highlighted" | "dimmed" | "normal"

export type EditMode = "Select" | "Draw"

export interface Detection extends DetectedBox {
    id: string
    visible: boolean
    highlighted: boolean
}

export interface ImageItem {
    id: string
    file: File
    previewUrl: string
    status: ImageStatus
    detections: Detection[]
    edited: boolean
    errorMessage?: string
}
