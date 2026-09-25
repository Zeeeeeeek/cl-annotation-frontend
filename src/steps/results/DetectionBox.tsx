import { Group, Rect, Text } from "react-konva"
import type { BoundingBox, Detection } from "../../types"
import { formatConfidence } from "../../utils/format"

const LABEL_FONT_SIZE = 14
const LABEL_PADDING_X = 4
const LABEL_PADDING_Y = 2
const LABEL_OFFSET = 4

interface DetectionBoxProps {
    detection: Detection
    scale: number
    strokeColor: string
    textColor: string
}

function scaleBox(box: BoundingBox, scale: number): BoundingBox {
    return {
        x: box.x * scale,
        y: box.y * scale,
        width: box.width * scale,
        height: box.height * scale,
    }
}

export function DetectionBox({ detection, scale, strokeColor, textColor }: DetectionBoxProps) {
    const box = scaleBox(detection.box, scale)
    const labelText = `${detection.label} ${formatConfidence(detection.confidence)}`

    // Approximate text width: Konva can't measure it before rendering
    const labelWidth = labelText.length * (LABEL_FONT_SIZE * 0.6) + LABEL_PADDING_X * 2
    const labelHeight = LABEL_FONT_SIZE + LABEL_PADDING_Y * 2

    return (
        <Group>
            <Rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke={strokeColor}
                strokeWidth={3}
                shadowBlur={10}
            />
            <Rect
                x={box.x + LABEL_OFFSET}
                y={box.y + LABEL_OFFSET}
                width={labelWidth}
                height={labelHeight}
                fill={strokeColor}
            />
            <Text
                x={box.x + LABEL_OFFSET + LABEL_PADDING_X}
                y={box.y + LABEL_OFFSET + LABEL_PADDING_Y}
                text={labelText}
                fontSize={LABEL_FONT_SIZE}
                fill={textColor}
                fontStyle="bold"
            />
        </Group>
    )
}