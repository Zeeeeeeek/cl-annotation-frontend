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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function processImage(image: ImageResult) {
    image.status = "processing"

    const formData = new FormData()
    formData.append("image", image.file)

    try {
        const response = await fetch(`${API_BASE_URL}/detect`, {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            throw new Error(`Detection failed with status ${response.status}`)
        }
        image.detections = await response.json()
        image.status = "completed"
    } catch (error) {
        image.status = "error"
        image.errorMessage = error instanceof Error ? error.message : "Unknown error"
    }

}

