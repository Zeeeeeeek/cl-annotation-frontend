import type { ClassInfo, DetectedBox, Detection } from "../types"
import { API_BASE_URL } from "../config"

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
    const body = await response.json().catch(() => null)
    if (typeof body?.detail === "string") {
        return body.detail
    }
    if (Array.isArray(body?.detail)) {
        return body.detail
            .map((error: { loc: (string | number)[]; msg: string }) => `${error.loc.join(".")}: ${error.msg}`)
            .join("; ")
    }
    return `${fallback} with status ${response.status}`
}

export async function detect(file: File, signal?: AbortSignal): Promise<DetectedBox[]> {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(`${API_BASE_URL}/detect`, {
        method: "POST",
        body: formData,
        signal,
    })
    if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Detection failed"))
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
        throw new Error(await readErrorMessage(response, "Saving annotations failed"))
    }
}

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`)
        return response.ok
    } catch {
        return false
    }
}

export async function getClasses(): Promise<ClassInfo[]> {
    const response = await fetch(`${API_BASE_URL}/classes`)
    if (!response.ok) {
        throw new Error(`Loading classes failed with status ${response.status}`)
    }
    return response.json()
}
