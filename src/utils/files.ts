const HEIC_EXTENSIONS = [".heic", ".heif"]

export function isHeicFile(file: File): boolean {
    const fileName = file.name.toLowerCase()
    return (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        HEIC_EXTENSIONS.some((extension) => fileName.endsWith(extension))
    )
}
