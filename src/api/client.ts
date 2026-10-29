import type { DetectedBox, Detection } from "../types"
import { API_BASE_URL } from "../config"

export async function detect(file: File, signal?: AbortSignal): Promise<DetectedBox[]> {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(`${API_BASE_URL}/detect`, {
        method: "POST",
        body: formData,
        signal,
    })
    if (!response.ok) {
        throw new Error(`Detection failed with status ${response.status}`)
    }
    return response.json()
}

export async function saveAnnotations(file: File, detections: Detection[]): Promise<void> {
    const formData = new FormData()
    formData.append("image", file)
    formData.append(
        "annotations",
        JSON.stringify({
            detections: detections.map(({ box, label }) => ({ box, label })),
        }),
    )

    const response = await fetch(`${API_BASE_URL}/annotations`, {
        method: "POST",
        body: formData,
    })
    if (!response.ok) {
        throw new Error(`Saving annotations failed with status ${response.status}`)
    }
}

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`)
        return response.ok
    } catch (error) {
        console.error("Health check failed:", error)
        return false
    }
}
