import { Box } from "@mui/material"
import { Image as KonvaImage, Layer, Stage } from "react-konva"
import useImage from "use-image"
import type { KonvaEventObject } from "konva/lib/Node"
import type { Detection, Emphasis, ImageItem } from "../../types"
import { DetectionBox } from "./DetectionBox"
import { ZoomToolbar } from "./ZoomToolbar"
import { filterByThreshold } from "../../utils/detections"
import { useElementSize } from "../../hooks/useElementSize"
import { MIN_ZOOM, useZoom } from "../../hooks/useZoom"

// How fast the wheel zooms: a mouse notch (deltaY ≈ 100) zooms by about 20%
const WHEEL_ZOOM_SENSITIVITY = 0.002

interface AnnotatedImageProps {
    image: ImageItem
    confidenceThreshold: number
    colorForLabel: (label: string) => string
    hoveredDetectionId: string | null
}

export function AnnotatedImage({ image, confidenceThreshold, colorForLabel, hoveredDetectionId }: AnnotatedImageProps) {
    const { ref, width: areaWidth, height: areaHeight } = useElementSize<HTMLDivElement>()
    const [htmlImage] = useImage(image.previewUrl)

    // Image and boxes are drawn in the original image coordinates:
    // useZoom decides how the whole stage is scaled and moved.
    const imageSize = htmlImage ? { width: htmlImage.width, height: htmlImage.height } : null
    const { zoom, scale, position, zoomAt, zoomToCenter, panTo, reset, clampPosition } = useZoom(imageSize, {
        width: areaWidth,
        height: areaHeight,
    })
    const canPan = zoom > MIN_ZOOM

    function handleWheel(event: KonvaEventObject<WheelEvent>) {
        event.evt.preventDefault() // stop the page (or the browser) from scrolling/zooming
        const pointer = event.target.getStage()?.getPointerPosition()
        if (!pointer) return

        // Exponential zoom: smooth with trackpads (many small deltas) and mouse wheels (few big ones)
        zoomAt(pointer, zoom * Math.exp(-event.evt.deltaY * WHEEL_ZOOM_SENSITIVITY))
    }

    function handleDragMove(event: KonvaEventObject<DragEvent>) {
        // Only the stage pans the view (in the future boxes may be draggable too)
        if (event.target !== event.target.getStage()) return
        panTo(event.target.position())
    }

    const shownDetections = filterByThreshold(image.detections, confidenceThreshold).filter(
        detection => detection.visible,
    )

    const isEmphasized = (detection: Detection) => detection.highlighted || detection.id === hoveredDetectionId
    const hasEmphasis = shownDetections.some(isEmphasized)

    function getEmphasis(detection: Detection): Emphasis {
        if (isEmphasized(detection)) return "highlighted"
        return hasEmphasis ? "dimmed" : "normal"
    }

    // Konva draws in render order: emphasized boxes go last so they stay on top
    const orderedDetections = [...shownDetections].sort(
        (a, b) => Number(isEmphasized(a)) - Number(isEmphasized(b)),
    )

    return (
        <Box
            ref={ref}
            sx={{
                position: "relative", // reference for the toolbar
                height: "100%",
                width: "100%",
                minHeight: 0,
                overflow: "hidden",
                cursor: canPan ? "grab" : "default",
                "&:active": { cursor: canPan ? "grabbing" : "default" },
            }}
        >
            <Stage
                width={areaWidth}
                height={areaHeight}
                scaleX={scale}
                scaleY={scale}
                x={position.x}
                y={position.y}
                draggable={canPan}
                dragBoundFunc={point => clampPosition(point)}
                onDragMove={handleDragMove}
                onWheel={handleWheel}
            >
                <Layer>
                    {htmlImage && (
                        <>
                            <KonvaImage image={htmlImage} />
                            {orderedDetections.map(detection => (
                                <DetectionBox
                                    key={detection.id}
                                    detection={detection}
                                    color={colorForLabel(detection.label)}
                                    emphasis={getEmphasis(detection)}
                                    viewScale={scale}
                                />
                            ))}
                        </>
                    )}
                </Layer>
            </Stage>

            {htmlImage && <ZoomToolbar zoom={zoom} onZoomChange={zoomToCenter} onReset={reset} />}
        </Box>
    )
}