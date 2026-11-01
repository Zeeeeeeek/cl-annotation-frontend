import { saveAnnotations } from "./client"
import type { ImageItem, SendStatus } from "../types"

type SendUpdater = (id: string, status: SendStatus, errorMessage?: string) => void

export async function sendAnnotations(images: ImageItem[], onUpdate: SendUpdater): Promise<void> {
    for (const image of images) {
        onUpdate(image.id, "sending")
        try {
            await saveAnnotations(image.file, image.detections)
            onUpdate(image.id, "sent")
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            onUpdate(image.id, "error", errorMessage)
        }
    }
}
