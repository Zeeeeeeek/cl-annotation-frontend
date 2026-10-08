import useImage from "use-image"
import { useElementSize } from "../hooks/useElementSize.ts"
import { MIN_ZOOM, useZoom } from "../hooks/useZoom.ts"
import type { KonvaEventObject } from "konva/lib/Node"
import { Box } from "@mui/material"
import { Layer, Stage, Image as KonvaImage } from "react-konva"
import { ZoomToolbar } from "./ZoomToolbar.tsx"
import type { ReactNode } from "react"

const WHEEL_ZOOM_SENSITIVITY = 0.002

interface ImageViewerProps {
    imageUrl: string
    renderOverlay: (scale: number) => ReactNode
    onBackGroundClick?: () => void
}

export function ImageViewer({ imageUrl, renderOverlay, onBackGroundClick }: ImageViewerProps) {
    const { ref, width: areaWidth, height: areaHeight } = useElementSize<HTMLDivElement>()
    const [htmlImage] = useImage(imageUrl)

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

    return (
        <Box
            ref={ref}
            sx={{
                position: "relative",
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
                dragBoundFunc={(point) => clampPosition(point)}
                onDragMove={handleDragMove}
                onWheel={handleWheel}
                onClick={(e) => {
                    const clickedOnBackground = e.target === e.target.getStage() || e.target.name() === "background"
                    if (clickedOnBackground) {
                        e.cancelBubble = true
                        if (onBackGroundClick) {
                            onBackGroundClick()
                        }
                    }
                }}
            >
                <Layer>
                    {htmlImage && (
                        <>
                            <KonvaImage image={htmlImage} name={"background"} />
                            {renderOverlay?.(scale)}
                        </>
                    )}
                </Layer>
            </Stage>
            {htmlImage && <ZoomToolbar zoom={zoom} onZoomChange={zoomToCenter} onReset={reset} />}
        </Box>
    )
}
