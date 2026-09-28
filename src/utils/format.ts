import type { Detection } from "../types"

export function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function stripExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".")
    return lastDot > 0 ? fileName.slice(0, lastDot) : fileName
}

export function formatDetectionLabel(detection: Detection): string {
    return `${capitalizeFirstLetter(detection.label)} ${detection.index} · ${Math.trunc(detection.confidence * 100)}%`
}
