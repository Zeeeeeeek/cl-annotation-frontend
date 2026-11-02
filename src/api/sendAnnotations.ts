import { saveAnnotations } from "./client"
import type { ImageItem, SendStatus } from "../types"
import { getErrorMessage } from "../utils/errors.ts"

type SendUpdater = (id: string, status: SendStatus, errorMessage?: string) => void

export async function sendAnnotations(images: ImageItem[], onUpdate: SendUpdater): Promise<void> {
    for (const image of images) {
        onUpdate(image.id, "sending")
        try {
            await saveAnnotations(image.file, image.detections)
            onUpdate(image.id, "sent")
        } catch (error) {
            onUpdate(image.id, "error", getErrorMessage(error))
        }
    }
}
