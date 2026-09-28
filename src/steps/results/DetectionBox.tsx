import { Group, Rect, Text } from "react-konva"
import type { BoundingBox, Detection, Emphasis } from "../../types"
import { formatDetectionLabel } from "../../utils/format"
import { brighten, getContrastTextColor } from "../../utils/labelColors.ts"

const LABEL_FONT_SIZE = 14
const LABEL_PADDING_X = 4
const LABEL_PADDING_Y = 2
const LABEL_OFFSET = 4

interface DetectionBoxProps {
    detection: Detection
    scale: number
    color: string
    emphasis: Emphasis
}

function scaleBox(box: BoundingBox, scale: number): BoundingBox {
    return {
        x: box.x * scale,
        y: box.y * scale,
        width: box.width * scale,
        height: box.height * scale,
    }
}

export function DetectionBox({ detection, scale, color, emphasis }: DetectionBoxProps) {
    const box = scaleBox(detection.box, scale)
    const labelText = formatDetectionLabel(detection)

    // Approximate text width: Konva can't measure it before rendering
    const labelWidth = labelText.length * (LABEL_FONT_SIZE * 0.6) + LABEL_PADDING_X * 2
    const labelHeight = LABEL_FONT_SIZE + LABEL_PADDING_Y * 2
    const isHighlighted = emphasis === "highlighted"

    const displayColor = isHighlighted ? brighten(color) : color
    const textColor = getContrastTextColor(displayColor)
    const strokeWidth = isHighlighted ? 5 : 3
    const opacity = emphasis === "dimmed" ? 0.25 : 1

    return (
        <Group opacity={opacity}>
            <Rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke={color}
                strokeWidth={strokeWidth}
                shadowBlur={10}
            />
            <Rect
                x={box.x + LABEL_OFFSET}
                y={box.y + LABEL_OFFSET}
                width={labelWidth}
                height={labelHeight}
                fill={color}
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
