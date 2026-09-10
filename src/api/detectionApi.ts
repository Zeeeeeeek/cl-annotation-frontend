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

const delay = ms => new Promise(res => setTimeout(res, ms))

export async function processImage(image: ImageResult, test: boolean) {
    image.status = "processing"

    await delay(3000)
    if (test) {
        image.status = "error"
    } else {
        image.status = "completed"
    }
}

