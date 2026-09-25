export function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function stripExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".")
    return lastDot > 0 ? fileName.slice(0, lastDot) : fileName
}

export function formatConfidence(confidence: number): string {
    return `${Math.trunc(confidence * 100)}%`
}
