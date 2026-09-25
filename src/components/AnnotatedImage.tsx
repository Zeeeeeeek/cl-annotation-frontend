import { Box } from "@mui/material"
import { Image as KonvaImage, Layer, Stage } from "react-konva"
import useImage from "use-image"
import type { ImageItem } from "../types"
import { DetectionBox } from "./DetectionBox"
import { filterByThreshold } from "../utils/detections"
import { getContrastTextColor } from "../utils/labelColors"

interface AnnotatedImageProps {
    image: ImageItem
    confidenceThreshold: number
    colorForLabel: (label: string) => string
    maxWidth?: number
}

export function AnnotatedImage({ image, confidenceThreshold, colorForLabel, maxWidth = 800 }: AnnotatedImageProps) {
    const [htmlImage] = useImage(image.previewUrl)

    const scale = htmlImage ? Math.min(1, maxWidth / htmlImage.width) : 1
    const stageWidth = htmlImage ? htmlImage.width * scale : maxWidth
    const stageHeight = htmlImage ? htmlImage.height * scale : 0

    const shownDetections = filterByThreshold(image.detections, confidenceThreshold).filter(
        detection => detection.visible,
    )

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <Stage width={stageWidth} height={stageHeight}>
                <Layer>
                    {htmlImage && (
                        <>
                            <KonvaImage image={htmlImage} width={stageWidth} height={stageHeight} />
                            {shownDetections.map(detection => {
                                const color = colorForLabel(detection.label)
                                return (
                                    <DetectionBox
                                        key={detection.id}
                                        detection={detection}
                                        scale={scale}
                                        strokeColor={color}
                                        textColor={getContrastTextColor(color)}
                                    />
                                )
                            })}
                        </>
                    )}
                </Layer>
            </Stage>
        </Box>
    )
}