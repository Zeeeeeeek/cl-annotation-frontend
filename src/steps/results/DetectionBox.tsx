import {Group, Rect} from "react-konva"
import type {Detection, Emphasis} from "../../types"
import {brighten} from "../../utils/labelColors"
import {DetectionLabel} from "../../components/DetectionLabel.tsx";


interface DetectionBoxProps {
    detection: Detection
    color: string
    emphasis: Emphasis
    viewScale: number
    detectionIndex: number
}

export function DetectionBox({detection, color, emphasis, viewScale, detectionIndex}: DetectionBoxProps) {
    const {box} = detection
    const isHighlighted = emphasis === "highlighted"

    const displayColor = isHighlighted ? brighten(color) : color
    const strokeWidth = isHighlighted ? 5 : 3
    const opacity = emphasis === "dimmed" ? 0.25 : 1

    return (
        <Group opacity={opacity}>
            <Rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke={displayColor}
                strokeWidth={strokeWidth}
                strokeScaleEnabled={false}
                shadowBlur={10}
            />
            <DetectionLabel detection={detection} detectionIndex={detectionIndex} displayColor={displayColor}
                            viewScale={viewScale}/>
        </Group>
    )
}
