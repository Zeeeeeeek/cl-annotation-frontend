import { Box } from "@mui/material"
import { Image as KonvaImage, Layer, Stage } from "react-konva"
import useImage from "use-image"
import type { Detection, Emphasis, ImageItem } from "../../types"
import { DetectionBox } from "./DetectionBox"
import { filterByThreshold } from "../../utils/detections"
import { useElementSize } from "../../hooks/useElementSize.ts"

interface AnnotatedImageProps {
    image: ImageItem
    confidenceThreshold: number
    colorForLabel: (label: string) => string
    hoveredDetectionId: string | null
}

export function AnnotatedImage({ image, confidenceThreshold, colorForLabel, hoveredDetectionId }: AnnotatedImageProps) {
    const { ref, width: areaWidth, height: areaHeight } = useElementSize<HTMLDivElement>()
    const [htmlImage] = useImage(image.previewUrl)

    const scale = htmlImage ? Math.min(1, areaWidth / htmlImage.width, areaHeight / htmlImage.height) : 0
    const stageWidth = htmlImage ? htmlImage.width * scale : 0
    const stageHeight = htmlImage ? htmlImage.height * scale : 0

    const shownDetections = filterByThreshold(image.detections, confidenceThreshold).filter(
        (detection) => detection.visible,
    )

    const isEmphasized = (detection: Detection) => detection.highlighted || detection.id === hoveredDetectionId

    const hasEmphasizedDetections = shownDetections.some(isEmphasized)

    function getEmphasis(detection: Detection): Emphasis {
        if (isEmphasized(detection)) {
            return "highlighted"
        }
        return hasEmphasizedDetections ? "dimmed" : "normal"
    }

    return (
        <Box
            ref={ref}
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
                            {shownDetections.map((detection) => {
                                return (
                                    <DetectionBox
                                        key={detection.id}
                                        detection={detection}
                                        scale={scale}
                                        color={colorForLabel(detection.label)}
                                        emphasis={getEmphasis(detection)}
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
