import { detect } from "./client"
import { toDetections } from "../utils/detections"
import type { ImageItem } from "../types"
import { isHeicFile } from "../utils/files.ts"

type ImageUpdater = (id: string, changes: Partial<ImageItem>) => void

export async function runDetection(images: ImageItem[], onUpdate: ImageUpdater): Promise<void> {
    for (const image of images) {
        if (isHeicFile(image.file)) {
            onUpdate(image.id, {
                status: "error",
                errorMessage:
                    "HEIC/HEIF files are not supported. Please convert the image to a supported format (e.g., JPEG or PNG) and try again.",
            })
            continue
        }
        onUpdate(image.id, { status: "processing" })
        try {
            const detectedBoxes = await detect(image.file)
            onUpdate(image.id, { status: "completed", detections: toDetections(detectedBoxes) })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            onUpdate(image.id, { status: "error", errorMessage })
        }
    }
}
