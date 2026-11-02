import { useState } from "react"
import type { ImageItem, SendState, SendStatus } from "../types.ts"
import { sendAnnotations } from "../api/sendAnnotations.ts"
import { isWaitingToBeSent } from "../utils/detections.ts"

function queuedStates(toSend: ImageItem[]): Record<string, SendState> {
    const states: Record<string, SendState> = {}
    toSend.forEach((image) => {
        states[image.id] = { status: "queued" }
    })
    return states
}

export function useSendAnnotations(
    images: ImageItem[],
    onImageUpdate: (id: string, changes: Partial<ImageItem>) => void,
) {
    const [sendStates, setSendStates] = useState<Record<string, SendState> | null>(null)

    const sendingImages = sendStates ? images.filter((image) => image.id in sendStates) : []

    function updateSendState(id: string, status: SendStatus, errorMessage?: string) {
        setSendStates((prev) => ({ ...prev, [id]: { status, errorMessage } }))
        if (status === "sent") {
            onImageUpdate(id, { sent: true })
        }
    }

    function send() {
        const toSend = images.filter((image) => isWaitingToBeSent(image))
        setSendStates(queuedStates(toSend))
        void sendAnnotations(toSend, updateSendState)
    }

    function retry() {
        const failed = sendingImages.filter((image) => sendStates?.[image.id].status === "error")
        setSendStates((prev) => ({ ...prev, ...queuedStates(failed) }))
        void sendAnnotations(failed, updateSendState)
    }

    function clearSendStates() {
        setSendStates(null)
    }

    return { sendStates, sendingImages, send, retry, clearSendStates }
}
