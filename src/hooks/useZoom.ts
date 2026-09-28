import { useState } from "react"

export const MIN_ZOOM = 1
export const MAX_ZOOM = 5

export interface Point {
    x: number
    y: number
}

export interface Size {
    width: number
    height: number
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

// Position on one axis: centered if the image is smaller than the area,
// otherwise limited so the image always covers the area (no empty gaps at the edges).
function clampAxis(position: number, areaLength: number, imageLength: number): number {
    if (imageLength <= areaLength) {
        return (areaLength - imageLength) / 2
    }
    return clamp(position, areaLength - imageLength, 0)
}

/**
 * Zoom and pan state for an image drawn in its original coordinates.
 * zoom = 1 means "whole image fitted and centered in the area".
 */
export function useZoom(imageSize: Size | null, areaSize: Size) {
    const [zoom, setZoom] = useState(MIN_ZOOM)
    const [position, setPosition] = useState<Point>({ x: 0, y: 0 })

    // Scale that fits the whole image in the area (small images are never enlarged)
    const fitScale = imageSize ? Math.min(1, areaSize.width / imageSize.width, areaSize.height / imageSize.height) : 1
    const scale = fitScale * zoom

    function clampPosition(point: Point, atScale: number = scale): Point {
        if (!imageSize) return point
        return {
            x: clampAxis(point.x, areaSize.width, imageSize.width * atScale),
            y: clampAxis(point.y, areaSize.height, imageSize.height * atScale),
        }
    }

    // The stored position is always shown clamped: this also keeps the image
    // centered at zoom 1 and in place when the window is resized.
    const currentPosition = clampPosition(position)

    // Zoom keeping the image point under `point` (screen coordinates) where it is
    function zoomAt(point: Point, newZoom: number) {
        const clampedZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM)
        const newScale = fitScale * clampedZoom

        const imagePoint = {
            x: (point.x - currentPosition.x) / scale,
            y: (point.y - currentPosition.y) / scale,
        }

        setZoom(clampedZoom)
        setPosition({
            x: point.x - imagePoint.x * newScale,
            y: point.y - imagePoint.y * newScale,
        })
    }

    // Used by the toolbar: there is no pointer, so zoom towards the center of the area
    function zoomToCenter(newZoom: number) {
        zoomAt({ x: areaSize.width / 2, y: areaSize.height / 2 }, newZoom)
    }

    function panTo(point: Point) {
        setPosition(clampPosition(point))
    }

    // Back to the whole image: at zoom 1 clampPosition centers it on its own
    function reset() {
        setZoom(MIN_ZOOM)
    }

    return { zoom, scale, position: currentPosition, zoomAt, zoomToCenter, panTo, reset, clampPosition }
}
